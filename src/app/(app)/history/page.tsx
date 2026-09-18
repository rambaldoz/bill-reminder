import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getBills, getCategories } from "@/lib/bills/queries";
import { currenciesUsed } from "@/lib/stats";
import { HistoryCard } from "@/components/history/history-card";
import { HistoryFilters } from "@/components/history/history-filters";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; currency?: string; from?: string; to?: string }>;
}) {
  const { category, currency, from, to } = await searchParams;
  const supabase = await createClient();
  const [bills, categories] = await Promise.all([getBills(supabase), getCategories(supabase)]);

  const paid = bills.filter((bill) => bill.paid_at);
  const currencies = currenciesUsed(paid);

  const filtered = paid
    .filter((bill) => !category || category === "all" || bill.category_id === category)
    .filter((bill) => !currency || currency === "all" || bill.currency === currency)
    .filter((bill) => !from || bill.paid_at!.slice(0, 10) >= from)
    .filter((bill) => !to || bill.paid_at!.slice(0, 10) <= to)
    .sort((a, b) => (a.paid_at! < b.paid_at! ? 1 : -1));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Link
          href="/stats"
          aria-label="Back to statistics"
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">History</h1>
      </div>

      <HistoryFilters categories={categories} currencies={currencies} />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          No paid bills match these filters.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((bill) => (
            <HistoryCard key={bill.id} bill={bill} />
          ))}
        </div>
      )}
    </div>
  );
}
