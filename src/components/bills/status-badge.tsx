import { cn } from "@/lib/utils";
import { STATUS_LABEL } from "@/lib/bills/status";
import type { BillStatus } from "@/lib/bills/types";

const STATUS_CLASS: Record<BillStatus, string> = {
  upcoming: "bg-status-upcoming-bg text-status-upcoming",
  due_soon: "bg-status-due-soon-bg text-status-due-soon",
  overdue: "bg-status-overdue-bg text-status-overdue",
  paid: "bg-status-paid-bg text-status-paid",
};

export function StatusBadge({ status, className }: { status: BillStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        STATUS_CLASS[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}
