import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/bills/queries";
import { getProfile } from "@/lib/profile";
import { BillForm } from "@/components/bills/bill-form";
import { createBill } from "@/app/(app)/bills/actions";

export default async function NewBillPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [categories, profile] = await Promise.all([
    getCategories(supabase),
    user ? getProfile(supabase, user.id) : Promise.resolve(null),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Add a bill</h1>
      <BillForm
        categories={categories}
        action={createBill}
        submitLabel="Add bill"
        defaultCurrency={profile?.default_currency ?? "AED"}
        defaultReminderOffsetDays={profile?.default_reminder_offset_days ?? 3}
        defaultReminderTime={profile?.default_reminder_time?.slice(0, 5) ?? "09:00"}
      />
    </div>
  );
}
