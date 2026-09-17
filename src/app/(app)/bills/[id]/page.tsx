import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBill, getCategories } from "@/lib/bills/queries";
import { billStatus } from "@/lib/bills/status";
import { BillForm } from "@/components/bills/bill-form";
import { StatusBadge } from "@/components/bills/status-badge";
import { MarkPaidButton } from "@/components/bills/mark-paid-button";
import { DeleteBillButton } from "@/components/bills/delete-bill-button";
import { updateBill } from "@/app/(app)/bills/actions";

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [bill, categories] = await Promise.all([
    getBill(supabase, id),
    getCategories(supabase),
  ]);

  if (!bill) notFound();

  const status = billStatus(bill);
  const isRecurring = bill.recurrence !== "none";
  const boundUpdate = updateBill.bind(null, bill.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Edit bill
        </h1>
        <StatusBadge status={status} />
      </div>

      {status !== "paid" && (
        <div className="flex items-center gap-2">
          <MarkPaidButton id={bill.id} />
          <DeleteBillButton id={bill.id} isRecurring={isRecurring} />
        </div>
      )}
      {status === "paid" && (
        <div>
          <DeleteBillButton id={bill.id} isRecurring={isRecurring} />
        </div>
      )}

      <BillForm
        categories={categories}
        bill={bill}
        action={boundUpdate}
        submitLabel="Save changes"
      />
    </div>
  );
}
