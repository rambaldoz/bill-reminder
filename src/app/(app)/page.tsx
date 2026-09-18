import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getBills } from "@/lib/bills/queries";
import { addDaysIso, todayIso } from "@/lib/bills/status";
import { formatMoney } from "@/lib/format";
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName = (user?.user_metadata?.display_name as string | undefined) ?? "there";
  const firstName = displayName.split(" ")[0];

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
  const sortedOverdueTotals = totalsByCurrency(overdue);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Hello, {firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s coming up.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sortedTotals.length > 1 ? (
          <div className="rounded-2xl bg-card p-4 ring-1 ring-border/70">
            <p className="text-xs font-medium text-muted-foreground">This month</p>
            <div className="mt-1.5 flex flex-col gap-0.5">
              {sortedTotals.map(([currency, total]) => (
                <p
                  key={currency}
                  className="font-heading text-lg leading-tight font-semibold tabular-nums tracking-tight"
                >
                  {formatMoney(total, currency)}
                </p>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {paidThisMonth.length} bill{paidThisMonth.length === 1 ? "" : "s"} paid
            </p>
          </div>
        ) : (
          <StatTile
            label="This month"
            value={formatMoney(sortedTotals[0]?.[1] ?? 0, sortedTotals[0]?.[0] ?? "AED")}
            hint={`${paidThisMonth.length} bill${paidThisMonth.length === 1 ? "" : "s"} paid`}
          />
        )}
        <StatTile label="Next 7 days" value={String(dueSoon.length)} hint="bills due" />
      </div>

      {overdue.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold text-status-overdue">
              Overdue bills
            </h2>
            <span className="text-xs text-muted-foreground">
              {sortedOverdueTotals.map(([currency, total]) => formatMoney(total, currency)).join(" · ")}
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {overdue.slice(0, 5).map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                className="bg-status-overdue-bg ring-status-overdue/15 hover:bg-status-overdue-bg/70"
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold text-foreground">
            Upcoming bills
          </h2>
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
