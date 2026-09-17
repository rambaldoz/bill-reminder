import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getBills } from "@/lib/bills/queries";
import { addDaysIso, todayIso } from "@/lib/bills/status";
import { formatMoney } from "@/lib/format";
import { StatTile } from "@/components/dashboard/stat-tile";
import { BillCard } from "@/components/bills/bill-card";
import { Button } from "@/components/ui/button";

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
  const upcoming = bills
    .filter((bill) => !bill.paid_at && bill.due_date >= today && bill.due_date <= weekOut)
    .slice(0, 5);

  const monthKey = today.slice(0, 7);
  const paidThisMonth = bills.filter(
    (bill) => bill.paid_at && bill.paid_at.slice(0, 7) === monthKey,
  );
  const totalsByCurrency = new Map<string, number>();
  for (const bill of paidThisMonth) {
    totalsByCurrency.set(
      bill.currency,
      (totalsByCurrency.get(bill.currency) ?? 0) + bill.amount,
    );
  }
  const sortedTotals = [...totalsByCurrency.entries()].sort((a, b) => b[1] - a[1]);
  const [topCurrency, topTotal] = sortedTotals[0] ?? ["AED", 0];
  const extraCurrencies = sortedTotals.length - 1;

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
        <StatTile
          label="This month"
          value={formatMoney(topTotal, topCurrency)}
          hint={
            extraCurrencies > 0
              ? `+${extraCurrencies} more currenc${extraCurrencies === 1 ? "y" : "ies"}`
              : `${paidThisMonth.length} bill${paidThisMonth.length === 1 ? "" : "s"} paid`
          }
        />
        <StatTile label="Next 7 days" value={String(upcoming.length)} hint="bills due" />
      </div>

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
