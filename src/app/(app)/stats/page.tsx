import { createClient } from "@/lib/supabase/server";
import { getBills } from "@/lib/bills/queries";
import { getProfile } from "@/lib/profile";
import { StatsView } from "@/components/stats/stats-view";

export default async function StatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [bills, profile] = await Promise.all([
    getBills(supabase),
    user ? getProfile(supabase, user.id) : Promise.resolve(null),
  ]);

  return <StatsView bills={bills} defaultCurrency={profile?.default_currency ?? "AED"} />;
}
