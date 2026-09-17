import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/bills/queries";
import { BillForm } from "@/components/bills/bill-form";
import { createBill } from "@/app/(app)/bills/actions";

export default async function NewBillPage() {
  const supabase = await createClient();
  const categories = await getCategories(supabase);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Add a bill</h1>
      <BillForm categories={categories} action={createBill} submitLabel="Add bill" />
    </div>
  );
}
