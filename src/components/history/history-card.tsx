import Link from "next/link";
import { CategoryChip } from "@/components/bills/category-chip";
import { formatDateShort, formatMoney } from "@/lib/format";
import type { BillWithCategory } from "@/lib/bills/types";

export function HistoryCard({ bill }: { bill: BillWithCategory }) {
  return (
    <Link
      href={`/bills/${bill.id}`}
      className="flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 ring-border/70 transition-colors hover:bg-muted/40"
    >
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="truncate text-sm font-medium text-foreground">{bill.title}</p>
        <CategoryChip category={bill.category} />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className="font-heading text-sm font-semibold tabular-nums">
          {formatMoney(bill.amount, bill.currency)}
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          Paid {formatDateShort(bill.paid_at!.slice(0, 10))}
        </p>
      </div>
    </Link>
  );
}
