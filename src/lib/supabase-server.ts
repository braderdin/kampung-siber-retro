// Start: Server-side Supabase Client (Route Handlers only)
// Uses the service role key when available to bypass RLS for internal reads,
// and falls back gracefully to the anon key when secrets are absent.
// Start: Force IPv4 DNS resolution to bypass WSL IPv6 ENETUNREACH (Phase 1 Fix)
// This module is server-only. Node resolves the Supabase/Postgres hostnames here,
// so we bias resolution toward A (IPv4) records. Without this, the WSL network
// stack attempts AAAA first and crashes with ENETUNREACH before any fallback.
import dns from "node:dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  /* Older Node runtimes lack setDefaultResultOrder — safe no-op. */
}
// End: Force IPv4 DNS resolution

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { validateSupabaseEnv, validateServerSupabaseEnv } from "./env-validation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "placeholder-key";

// Start: Shared 7-day session TTL parity with browser client (Rule 31 Auth)
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // Exactly 7 days
export const SESSION_UPDATE_AGE_SECONDS = 24 * 60 * 60; // Refresh token expiry max every 24h
// End: Shared 7-day session TTL parity with browser client (Rule 31 Auth)

let cachedClient: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient;

  // Start: Environment Validation Guard (Rule 35) — warn before silent fallback
  validateSupabaseEnv();
  // End: Environment Validation Guard (Rule 35)

  // Start: Service Role Key privileged hard-fail guard (Fasa 2)
  // In production this THROWS before createClient so privileged server
  // operations never silently fall back to the anon key (silent RLS
  // rejection). In development it emits a non-fatal console.warn only.
  validateServerSupabaseEnv();
  // End: Service Role Key privileged hard-fail guard

  const key = supabaseServiceKey || supabaseAnonKey;
  cachedClient = createClient(supabaseUrl, key, {
    auth: {
      // Server-side client never persists to local storage; it validates
      // incoming bearer tokens. The 7-day bound is enforced by Supabase JWT
      // (project-level) + browser cookie maxAge (see src/lib/supabase.ts).
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
// End: Server-side Supabase Client
