import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getBills } from "@/lib/bills/queries";
import { addDaysIso, todayIso } from "@/lib/bills/status";
import { formatMonthLabel, formatMoney } from "@/lib/format";
import { StatTile } from "@/components/dashboard/stat-tile";
import { BillCard } from "@/components/bills/bill-card";
import { Button } from "@/components/ui/button";
import type { BillWithCategory } from "@/lib/bills/types";

function totalsByCurrency(bills: BillWithCategory[]) {
  const totals = new Map<string, number>();
  for (const bill of bills) {
    totals.set(bill.currency, (totals.get(bill.currency) ?? 0) + bill.amount);
  }
  return [...totals.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const bills = await getBills(supabase);

  const today = todayIso();
  const weekOut = addDaysIso(today, 7);

  const overdue = bills.filter((bill) => !bill.paid_at && bill.due_date < today);
  const dueSoon = bills.filter(
    (bill) => !bill.paid_at && bill.due_date >= today && bill.due_date <= weekOut,
  );
  const upcoming = dueSoon.slice(0, 5);

  const monthKey = today.slice(0, 7);
  const paidThisMonth = bills.filter(
    (bill) => bill.paid_at && bill.paid_at.slice(0, 7) === monthKey,
  );
  const sortedTotals = totalsByCurrency(paidThisMonth);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          {formatMonthLabel(monthKey)}
        </h2>
        {sortedTotals.length > 1 ? (
          <div className="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sortedTotals.map(([currency, total]) => {
              const paidCount = paidThisMonth.filter((bill) => bill.currency === currency).length;
              return (
                <div
                  key={currency}
                  className="flex h-[124px] w-[68%] shrink-0 snap-start flex-col justify-center rounded-2xl bg-card p-4 "
                >
                  <span className="w-fit rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                    {currency}
                  </span>
                  <p className="mt-1.5 font-heading text-2xl font-semibold tabular-nums tracking-tight">
                    {formatMoney(total, currency)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {paidCount} bill{paidCount === 1 ? "" : "s"} paid
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <StatTile
            label={sortedTotals[0]?.[0] ?? "AED"}
            value={formatMoney(sortedTotals[0]?.[1] ?? 0, sortedTotals[0]?.[0] ?? "AED")}
            hint={`${paidThisMonth.length} bill${paidThisMonth.length === 1 ? "" : "s"} paid`}
          />
        )}
      </div>

      {overdue.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-status-overdue">
              Overdue bills
            </h2>
            <Link href="/bills?status=overdue" className="text-xs font-medium text-primary-ink">
              See all
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {overdue.slice(0, 5).map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                className="bg-status-overdue-bg ring-status-overdue/15"
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Upcoming bills
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Next 7 days</p>
          </div>
          {bills.length > 0 && (
            <Link href="/bills" className="text-xs font-medium text-primary-ink">
              See all
            </Link>
          )}
        </div>
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-10 text-center">
            <p className="text-sm text-muted-foreground">
              {bills.length === 0
                ? "No bills yet. Add your first one to see it here."
                : "Nothing due in the next 7 days."}
            </p>
            {bills.length === 0 && (
              <Button size="sm" nativeButton={false} render={<Link href="/bills/new" />}>
                <Plus className="size-4" />
                Add a bill
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {upcoming.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
