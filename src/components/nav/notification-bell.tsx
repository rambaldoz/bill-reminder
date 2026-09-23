"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { StatusBadge } from "@/components/bills/status-badge";
import { billStatus } from "@/lib/bills/status";
import { formatDateShort, formatMoney } from "@/lib/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BillWithCategory } from "@/lib/bills/types";

export function NotificationBell({ bills }: { bills: BillWithCategory[] }) {
  const count = bills.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex size-9 items-center justify-center rounded-full bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        <Bell className="size-5" />
        {count > 0 && (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-status-overdue text-[0.6rem] font-semibold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuGroup className="contents">
          <DropdownMenuLabel>Reminders</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {bills.length === 0 ? (
            <p className="px-1.5 py-3 text-center text-sm text-muted-foreground">
              Nothing due soon.
            </p>
          ) : (
            bills.slice(0, 6).map((bill) => (
              <DropdownMenuItem key={bill.id} render={<Link href={`/bills/${bill.id}`} />}>
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">{bill.title}</p>
                    <StatusBadge status={billStatus(bill)} className="mt-1" />
                  </div>
                  <div className="flex shrink-0 flex-col items-end">
                    <span className="text-sm font-medium tabular-nums">
                      {formatMoney(bill.amount, bill.currency)}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatDateShort(bill.due_date)}
                    </span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
