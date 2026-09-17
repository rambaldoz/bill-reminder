export type CalendarDay = {
  /** YYYY-MM-DD */
  date: string;
  day: number;
  isCurrentMonth: boolean;
};

function isoFromUTC(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Builds a Monday-start month grid, padded with adjacent-month days to fill whole weeks. */
export function getMonthGrid(year: number, month: number): CalendarDay[] {
  const firstWeekday = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const daysInPrevMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  const cells: CalendarDay[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayOffset = i - firstWeekday + 1;
    if (dayOffset < 1) {
      const day = daysInPrevMonth + dayOffset;
      cells.push({ date: isoFromUTC(year, month - 1, day), day, isCurrentMonth: false });
    } else if (dayOffset > daysInMonth) {
      const day = dayOffset - daysInMonth;
      cells.push({ date: isoFromUTC(year, month + 1, day), day, isCurrentMonth: false });
    } else {
      cells.push({ date: isoFromUTC(year, month, dayOffset), day: dayOffset, isCurrentMonth: true });
    }
  }
  return cells;
}
