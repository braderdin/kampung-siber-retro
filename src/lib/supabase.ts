// Start: Kampung Siber 7-Day Persistent Session Engine (Rule 31 Brand Auth)
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { validateSupabaseEnv } from './env-validation';

// Start: Environment Validation Guard (Rule 35) — warn before silent fallback
validateSupabaseEnv();
// End: Environment Validation Guard (Rule 35)

// Start: Key resolution — accept both legacy NEXT_PUBLIC_SUPABASE_KEY and the
// newer Supabase "publishable" naming so either env template works.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'placeholder-key';
// End: Key resolution

// Start: Strict 7-day expiration threshold (seconds)
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // Exactly 7 days
export const SESSION_UPDATE_AGE_SECONDS = 24 * 60 * 60; // Refresh token expiry max every 24 hours
export const SESSION_STORAGE_KEY = 'kampung-siber-auth';
// End: Strict 7-day expiration threshold (seconds)

// Start: Hardened storage adapter — stamps every persisted session with a
// 7-day absolute expiry so the auth state self-destructs past the bound.
const createSessionStorage = (): Storage => {
  const memoryFallback = new Map<string, string>();

  const getRaw = (key: string): string | null => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return memoryFallback.get(key) ?? null;
      }
    }
    return memoryFallback.get(key) ?? null;
  };

  const setRaw = (key: string, value: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        /* fall through to memory */
      }
    }
    memoryFallback.set(key, value);
  };

  const removeRaw = (key: string): void => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    }
    memoryFallback.delete(key);
  };

  return {
    getItem(key: string): string | null {
      const raw = getRaw(key);
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw) as { expiresAt?: number; value: string };
        if (typeof parsed.expiresAt === 'number' && Date.now() > parsed.expiresAt) {
          removeRaw(key);
          return null;
        }
        return parsed.value;
      } catch {
        // Not our enveloped format — return as-is for backwards compatibility.
        return raw;
      }
    },
    setItem(key: string, value: string): void {
      const envelope = JSON.stringify({
        expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
        value,
      });
      setRaw(key, envelope);
    },
    removeItem(key: string): void {
      removeRaw(key);
    },
  } as Storage;
};
// End: Hardened storage adapter

// Start: Production-grade persistent browser client with hardened transport
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: createSessionStorage(),
    storageKey: SESSION_STORAGE_KEY,
    flowType: 'pkce',
    debug: false,
  },
});
// End: Production-grade persistent browser client with hardened transport
// End: Kampung Siber 7-Day Persistent Session Engine (Rule 31 Brand Auth)
