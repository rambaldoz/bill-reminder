import type { BillWithCategory } from "./bills/types";

export function monthKeyOf(dateIso: string) {
  return dateIso.slice(0, 7); // YYYY-MM
}

export function monthLabel(monthKey: string) {
  const [y, m] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

export function monthAbbrev(monthKey: string) {
  const [y, m] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, { month: "short" }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  );
}

export function shiftMonthKey(monthKey: string, delta: number) {
  const [y, m] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Distinct currencies used across the given bills, alphabetical. */
export function currenciesUsed(bills: BillWithCategory[]) {
  return [...new Set(bills.map((bill) => bill.currency))].sort();
}

export function totalForMonth(bills: BillWithCategory[], monthKey: string, currency: string) {
  return bills
    .filter(
      (bill) =>
        bill.paid_at && bill.currency === currency && monthKeyOf(bill.paid_at) === monthKey,
    )
    .reduce((sum, bill) => sum + bill.amount, 0);
}

export type CategorySlice = {
  categoryId: string | null;
  name: string;
  color: string;
  icon: string | null;
  total: number;
};

/** Paid-bill totals per category for one month + currency, largest first. */
export function categoryBreakdown(
  bills: BillWithCategory[],
  monthKey: string,
  currency: string,
): CategorySlice[] {
  const paid = bills.filter(
    (bill) =>
      bill.paid_at && bill.currency === currency && monthKeyOf(bill.paid_at) === monthKey,
  );

  const map = new Map<string, CategorySlice>();
  for (const bill of paid) {
    const key = bill.category_id ?? "none";
    const existing = map.get(key);
    if (existing) {
      existing.total += bill.amount;
    } else {
      map.set(key, {
        categoryId: bill.category_id,
        name: bill.category?.name ?? "Uncategorized",
        color: bill.category?.color ?? "var(--muted-foreground)",
        icon: bill.category?.icon ?? null,
        total: bill.amount,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

export type MonthPoint = { key: string; label: string; total: number };

/** `months` consecutive month totals ending at `endMonthKey`, oldest first. */
export function spendOverTime(
  bills: BillWithCategory[],
  currency: string,
  months: number,
  endMonthKey: string,
): MonthPoint[] {
  const points: MonthPoint[] = [];
  let key = shiftMonthKey(endMonthKey, -(months - 1));
  for (let i = 0; i < months; i++) {
    points.push({ key, label: monthAbbrev(key), total: totalForMonth(bills, key, currency) });
    key = shiftMonthKey(key, 1);
  }
  return points;
}

/** The most recent `count` month keys ending at `endMonthKey`, newest first. */
export function recentMonthKeys(endMonthKey: string, count: number) {
  return Array.from({ length: count }, (_, i) => shiftMonthKey(endMonthKey, -i));
}
