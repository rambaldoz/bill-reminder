import Link from "next/link";
import { CategoryIcon } from "@/lib/bills/category-icons";
import { formatDateShort, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BillWithCategory } from "@/lib/bills/types";

export function BillCard({
  bill,
  className,
}: {
  bill: BillWithCategory;
  className?: string;
}) {
  return (
    <Link
      href={`/bills/${bill.id}`}
      className={cn(
        "flex items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3.5 transition hover:brightness-95",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            !bill.category && "bg-secondary text-muted-foreground",
          )}
          style={
            bill.category
              ? { backgroundColor: `${bill.category.color}1f`, color: bill.category.color }
              : undefined
          }
        >
          <CategoryIcon icon={bill.category?.icon ?? null} className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{bill.title}</p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {formatDateShort(bill.due_date)}
          </p>
        </div>
      </div>
      <p className="shrink-0 font-heading text-sm font-semibold tabular-nums">
        {formatMoney(bill.amount, bill.currency)}
      </p>
    </Link>
  );
}
