"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getMonthGrid, WEEKDAY_LABELS } from "@/lib/calendar";
import { billStatus, todayIso } from "@/lib/bills/status";
import { cn } from "@/lib/utils";
import { BillCard } from "@/components/bills/bill-card";
import type { BillWithCategory } from "@/lib/bills/types";

const MAX_DOTS = 3;

function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(
    new Date(Date.UTC(year, month, 1)),
  );
}

function dayHeading(dateIso: string) {
  const [y, m, d] = dateIso.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function MonthCalendar({ bills }: { bills: BillWithCategory[] }) {
  const today = todayIso();
  const [todayYear, todayMonth] = today.split("-").map(Number);
  const [cursor, setCursor] = useState({ year: todayYear, month: todayMonth - 1 });
  const [selectedDate, setSelectedDate] = useState(today);

  const billsByDate = useMemo(() => {
    const map = new Map<string, BillWithCategory[]>();
    for (const bill of bills) {
      const list = map.get(bill.due_date) ?? [];
      list.push(bill);
      map.set(bill.due_date, list);
    }
    return map;
  }, [bills]);

  const grid = useMemo(
    () => getMonthGrid(cursor.year, cursor.month),
    [cursor.year, cursor.month],
  );

  function goToMonth(delta: number) {
    setCursor((prev) => {
      const date = new Date(Date.UTC(prev.year, prev.month + delta, 1));
      return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
    });
  }

  const selectedBills = billsByDate.get(selectedDate) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Calendar</h1>

      <div className="rounded-2xl bg-card p-4 ring-1 ring-border/70">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-heading text-base font-semibold">
            {monthLabel(cursor.year, cursor.month)}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => goToMonth(-1)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => goToMonth(1)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="pb-1.5 text-center text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase"
            >
              {label}
            </div>
          ))}

          {grid.map((cell) => {
            const dayBills = billsByDate.get(cell.date) ?? [];
            const unpaidStatuses = dayBills
              .filter((bill) => !bill.paid_at)
              .map((bill) => billStatus(bill, today));
            const hasOverdue = unpaidStatuses.includes("overdue");
            const hasDueSoon = unpaidStatuses.includes("due_soon");
            const isToday = cell.date === today;
            const isSelected = cell.date === selectedDate;
            const visibleDots = dayBills.slice(0, MAX_DOTS - 1);
            const extraCount = dayBills.length - visibleDots.length;

            return (
              <button
                key={cell.date}
                type="button"
                onClick={() => setSelectedDate(cell.date)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl transition-colors",
                  !cell.isCurrentMonth && "opacity-40",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full text-base tabular-nums",
                    isSelected
                      ? "bg-primary font-semibold text-primary-foreground"
                      : hasOverdue
                        ? "bg-status-overdue-bg font-semibold text-status-overdue"
                        : hasDueSoon
                          ? "bg-status-due-soon-bg font-semibold text-status-due-soon"
                          : isToday
                            ? "bg-secondary font-semibold text-foreground"
                            : "",
                  )}
                >
                  {cell.day}
                </span>
                <span className="flex h-2.5 items-center gap-0.5">
                  {dayBills.length === 0 ? null : dayBills.length <= MAX_DOTS ? (
                    dayBills.map((bill) => (
                      <span
                        key={bill.id}
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: bill.category?.color ?? "var(--muted-foreground)" }}
                      />
                    ))
                  ) : (
                    <>
                      {visibleDots.map((bill) => (
                        <span
                          key={bill.id}
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: bill.category?.color ?? "var(--muted-foreground)" }}
                        />
                      ))}
                      <span className="text-[0.6rem] leading-none font-medium text-muted-foreground">
                        +{extraCount}
                      </span>
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-sm font-semibold text-foreground">
          {dayHeading(selectedDate)}
        </h2>
        {selectedBills.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No bills due this day.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {selectedBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
