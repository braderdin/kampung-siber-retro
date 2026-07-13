// Start: Server-side Supabase Client (Route Handlers only)
// Uses the service role key when available to bypass RLS for internal reads,
// and falls back gracefully to the anon key when secrets are absent.
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "placeholder-key";

let cachedClient: SupabaseClient | null = null;

export function getServerSupabase(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const key = supabaseServiceKey || supabaseAnonKey;
  cachedClient = createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}
// End: Server-side Supabase Client