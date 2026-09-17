import { createClient } from "@/lib/supabase/server";
import { getBills } from "@/lib/bills/queries";
import { MonthCalendar } from "@/components/calendar/month-calendar";

export default async function CalendarPage() {
  const supabase = await createClient();
  const bills = await getBills(supabase);

  return <MonthCalendar bills={bills} />;
}
