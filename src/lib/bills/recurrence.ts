import type { Recurrence } from "./types";

/** Adds one recurrence interval to a YYYY-MM-DD date string. */
export function nextDueDate(dueDate: string, recurrence: Recurrence): string {
  const [y, m, d] = dueDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));

  switch (recurrence) {
    case "weekly":
      date.setUTCDate(date.getUTCDate() + 7);
      break;
    case "monthly":
      date.setUTCMonth(date.getUTCMonth() + 1);
      break;
    case "yearly":
      date.setUTCFullYear(date.getUTCFullYear() + 1);
      break;
    case "none":
      return dueDate;
  }

  return date.toISOString().slice(0, 10);
}

export const RECURRENCE_LABEL: Record<Recurrence, string> = {
  none: "Does not repeat",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};
