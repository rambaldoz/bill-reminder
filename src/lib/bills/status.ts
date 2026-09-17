import type { Bill, BillStatus } from "./types";

/** Days between two YYYY-MM-DD dates (b - a), ignoring time of day. */
function daysBetween(a: string, b: string) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const utcA = Date.UTC(ay, am - 1, ad);
  const utcB = Date.UTC(by, bm - 1, bd);
  return Math.round((utcB - utcA) / msPerDay);
}

export function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
}

export function addDaysIso(dateIso: string, days: number) {
  const [y, m, d] = dateIso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * The bill's status is derived from due_date/paid_at rather than trusted
 * from the stored `status` column, so it's always accurate without a cron
 * job keeping it in sync.
 */
export function billStatus(
  bill: Pick<Bill, "due_date" | "paid_at" | "reminder_offset_days">,
  today: string = todayIso(),
): BillStatus {
  if (bill.paid_at) return "paid";

  const daysUntilDue = daysBetween(today, bill.due_date);
  if (daysUntilDue < 0) return "overdue";
  if (daysUntilDue <= bill.reminder_offset_days) return "due_soon";
  return "upcoming";
}

export const STATUS_LABEL: Record<BillStatus, string> = {
  upcoming: "Upcoming",
  due_soon: "Due soon",
  overdue: "Overdue",
  paid: "Paid",
};
