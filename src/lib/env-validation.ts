// Start: Kampung Siber Environment Validation Guard (Rule 35 Security Guard)
// Provides a DYNAMIC build/runtime guard that:
//  - In production (Vercel live): THROWS on missing/placeholder Supabase keys (hard-fail)
//  - In development/local: emits a NON-FATAL console.warn
//  - Emits a SEPARATE warning when SUPABASE_SERVICE_ROLE_KEY is missing/invalid
//    (critical for server-side RLS bypass integrity, but non-fatal — server
//     gracefully falls back to the anon key).

const REQUIRED_SUPABASE_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_KEY",
] as const;

const SERVICE_ROLE_KEY = "SUPABASE_SERVICE_ROLE_KEY" as const;

// Placeholder values that must NEVER reach production (see .env.example).
// Extended with the .env.example template defaults so a careless deploy of the
// template itself is caught by the production hard-fail guard.
const PLACEHOLDER_VALUES = new Set<string>([
  "https://placeholder.supabase.co",
  "placeholder-key",
  "your-project.supabase.co",
  "your-anon-public-key",
  "your-service-role-key",
  "",
]);

export interface EnvValidationResult {
  isValid: boolean;
  warnings: string[];
}

// Start: isProduction — derive environment safely capping NODE_ENV
function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
// End: isProduction

// Start: validateSupabaseEnv — call BEFORE createClient in client/server modules
export function validateSupabaseEnv(): EnvValidationResult {
  const warnings: string[] = [];
  const isProd = isProduction();

  // Start: Required public keys + production hard-fail
  for (const key of REQUIRED_SUPABASE_KEYS) {
    const value = process.env[key];
    if (!value || PLACEHOLDER_VALUES.has(value.trim())) {
      const msg =
        `[Kampung Siber ENV GUARD] Required key "${key}" is missing or still ` +
        `set to a placeholder value. Copy .env.example to .env.local and ` +
        `supply real Supabase credentials before deploying.`;
      warnings.push(msg);

      // Hard-fail in production to prevent operating in a broken state.
      if (isProd) {
        throw new Error(
          `[Kampung Siber ENV GUARD] HARD-FAIL: ${msg} ` +
            `Deployment aborted (NODE_ENV=production).`
        );
      }
    }
  }
  // End: Required public keys + production hard-fail

  // Start: Service Role Key specific check (separate, NON-FATAL warning)
  // The server gracefully falls back to the anon key, so a missing service
  // role key must WARN (not block bootstrap) even in production.
  const serviceKey = process.env[SERVICE_ROLE_KEY];
  if (!serviceKey || PLACEHOLDER_VALUES.has(serviceKey.trim())) {
    warnings.push(
      `[Kampung Siber ENV GUARD] ${SERVICE_ROLE_KEY} is missing or invalid. ` +
        `Server-side RLS bypass will be unavailable; falling back to anon key.`
    );
  }
  // End: Service Role Key specific check

  if (warnings.length > 0 && typeof console !== "undefined") {
    console.warn(
      `\n[Kampung Siber ENV GUARD] ${warnings.length} environment issue(s) detected:\n` +
        warnings.map((w) => `  • ${w}`).join("\n") +
        `\n  Fix: cp .env.example .env.local\n`
    );
  }

  return { isValid: warnings.length === 0, warnings };
}
// End: validateSupabaseEnv

// Start: validateServerSupabaseEnv — Server-only privileged hard-fail (Fasa 2)
// Guards privileged server pathways (RLS bypass). In production, a missing or
// placeholder SUPABASE_SERVICE_ROLE_KEY MUST hard-fail so privileged operations
// never silently fall back to the anon key (silent RLS rejection). In
// development, emit a NON-FATAL warning to keep local bootstrap available.
export function validateServerSupabaseEnv(): void {
  const isProd = isProduction();
  const serviceKey = process.env[SERVICE_ROLE_KEY];

  if (!serviceKey || PLACEHOLDER_VALUES.has(serviceKey.trim())) {
    const msg =
      `[Kampung Siber SERVER GUARD] ${SERVICE_ROLE_KEY} is missing, empty, ` +
      `or still set to a .env.example placeholder/default. Privileged ` +
      `server-side RLS bypass is UNAVAILABLE — operating with anon key would ` +
      `cause silent RLS rejection on admin operations.`;

    if (isProd) {
      throw new Error(
        `[Kampung Siber SERVER GUARD] HARD-FAIL: ${msg} ` +
          `Server bootstrap aborted (NODE_ENV=production). Supply a valid ` +
          `SUPABASE_SERVICE_ROLE_KEY before deploying.`
      );
    }

    if (typeof console !== "undefined") {
      console.warn(`\n${msg}\n  Fix: cp .env.example .env.local\n`);
    }
  }
}
// End: validateServerSupabaseEnv

// End: Kampung Siber Environment Validation Guard (Rule 35 Security Guard)
