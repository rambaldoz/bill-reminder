"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { History as HistoryIcon, TrendingDown, TrendingUp } from "lucide-react";
import { StatTile } from "@/components/dashboard/stat-tile";
import { CategoryIcon } from "@/lib/bills/category-icons";
import { addDaysIso, todayIso } from "@/lib/bills/status";
import { formatMoney } from "@/lib/format";
import {
  categoryBreakdown,
  currenciesUsed,
  monthKeyOf,
  monthLabel,
  recentMonthKeys,
  shiftMonthKey,
  spendOverTime,
  totalForMonth,
} from "@/lib/stats";
import { cn } from "@/lib/utils";
import { DonutChart } from "./donut-chart";
import { SpendBarChart } from "./spend-bar-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BillWithCategory } from "@/lib/bills/types";

export function StatsView({
  bills,
  defaultCurrency,
}: {
  bills: BillWithCategory[];
  defaultCurrency: string;
}) {
  const today = todayIso();
  const currentMonthKey = monthKeyOf(today);
  const lastMonthKey = shiftMonthKey(currentMonthKey, -1);

  const currencies = useMemo(() => {
    const used = currenciesUsed(bills);
    return used.length > 0 ? used : [defaultCurrency];
  }, [bills, defaultCurrency]);

  const [currency, setCurrency] = useState(
    currencies.includes(defaultCurrency) ? defaultCurrency : currencies[0],
  );
  const [periodMonth, setPeriodMonth] = useState(currentMonthKey);

  const thisMonthTotal = totalForMonth(bills, currentMonthKey, currency);
  const lastMonthTotal = totalForMonth(bills, lastMonthKey, currency);
  const delta = thisMonthTotal - lastMonthTotal;
  const deltaPct = lastMonthTotal > 0 ? Math.round((delta / lastMonthTotal) * 100) : null;

  const monthOut = addDaysIso(today, 30);
  const upcomingTotal = bills
    .filter(
      (bill) =>
        !bill.paid_at &&
        bill.currency === currency &&
        bill.due_date >= today &&
        bill.due_date <= monthOut,
    )
    .reduce((sum, bill) => sum + bill.amount, 0);

  const monthOptions = recentMonthKeys(currentMonthKey, 12);
  const monthItems = Object.fromEntries(monthOptions.map((key) => [key, monthLabel(key)]));

  const slices = categoryBreakdown(bills, periodMonth, currency);
  const periodTotal = slices.reduce((sum, slice) => sum + slice.total, 0);

  const monthPoints = spendOverTime(bills, currency, 6, currentMonthKey);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Statistics</h1>
        <Link
          href="/history"
          className="flex items-center gap-1 text-xs font-medium text-primary-ink"
        >
          <HistoryIcon className="size-3.5" />
          History
        </Link>
      </div>

      {currencies.length > 1 && (
        <div className="inline-flex w-fit gap-1 rounded-full bg-secondary/60 p-1.5 ">
          {currencies.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setCurrency(code)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                currency === code
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {code}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="This month"
          value={formatMoney(thisMonthTotal, currency)}
          hint={
            deltaPct === null
              ? undefined
              : `${deltaPct >= 0 ? "+" : ""}${deltaPct}% vs last month`
          }
          icon={
            deltaPct === null ? undefined : deltaPct >= 0 ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )
          }
        />
        <StatTile label="Last month" value={formatMoney(lastMonthTotal, currency)} />
        <StatTile
          className="col-span-2"
          label="Due in the next 30 days"
          value={formatMoney(upcomingTotal, currency)}
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold text-foreground">By category</h2>
          <Select value={periodMonth} items={monthItems} onValueChange={(v) => setPeriodMonth(String(v))}>
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((key) => (
                <SelectItem key={key} value={key}>
                  {monthLabel(key)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {slices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            No bills paid in {monthLabel(periodMonth)}.
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-card p-5 ">
            <DonutChart
              segments={slices.map((slice) => ({
                key: slice.categoryId ?? "none",
                value: slice.total,
                color: slice.color,
              }))}
              centerLabel={
                <>
                  <span className="font-heading text-lg font-semibold tabular-nums">
                    {formatMoney(periodTotal, currency)}
                  </span>
                  <span className="text-xs text-muted-foreground">total</span>
                </>
              }
            />
            <div className="flex w-full flex-col gap-2.5">
              {slices.map((slice) => (
                <div key={slice.categoryId ?? "none"} className="flex items-center gap-2.5">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${slice.color}1f`, color: slice.color }}
                  >
                    <CategoryIcon icon={slice.icon} className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {slice.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {Math.round((slice.total / periodTotal) * 100)}%
                  </span>
                  <span className="w-20 shrink-0 text-right text-sm font-medium tabular-nums">
                    {formatMoney(slice.total, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 font-heading text-sm font-semibold text-foreground">
          Last 6 months
        </h2>
        <div className="rounded-2xl bg-card p-5 ">
          <SpendBarChart points={monthPoints} currency={currency} />
        </div>
      </div>
    </div>
  );
}
