import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getBills, getCategories } from "@/lib/bills/queries";
import { billStatus } from "@/lib/bills/status";
import { BillCard } from "@/components/bills/bill-card";
import { BillFilters } from "@/components/bills/bill-filters";
import { Button } from "@/components/ui/button";
import type { BillStatus } from "@/lib/bills/types";

export default async function BillsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>;
}) {
  const { status, category } = await searchParams;
  const supabase = await createClient();
  const [bills, categories] = await Promise.all([
    getBills(supabase),
    getCategories(supabase),
  ]);

  const filtered = bills.filter((bill) => {
    const matchesStatus = !status || status === "all" || billStatus(bill) === (status as BillStatus);
    const matchesCategory = !category || category === "all" || bill.category_id === category;
    return matchesStatus && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Bills</h1>
        <Button size="sm" nativeButton={false} render={<Link href="/bills/new" />}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      <BillFilters categories={categories} />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">No bills match these filters.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      )}
    </div>
  );
}
