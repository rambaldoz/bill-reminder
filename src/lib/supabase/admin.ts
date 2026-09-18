import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client that bypasses Row Level Security. Server-only, and
 * only for the reminders cron — never expose SUPABASE_SERVICE_ROLE_KEY to
 * the client or use this helper from user-facing code paths.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
