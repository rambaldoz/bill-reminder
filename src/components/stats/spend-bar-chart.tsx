import { formatMoney } from "@/lib/format";
import type { MonthPoint } from "@/lib/stats";

export function SpendBarChart({
  points,
  currency,
}: {
  points: MonthPoint[];
  currency: string;
}) {
  const max = Math.max(1, ...points.map((p) => p.total));

  return (
    <div className="flex h-36 items-end gap-2">
      {points.map((point) => {
        const heightPct = (point.total / max) * 100;
        return (
          <div key={point.key} className="flex h-full flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-primary"
                style={{ height: `${point.total > 0 ? Math.max(heightPct, 4) : 0}%` }}
                title={`${point.label}: ${formatMoney(point.total, currency)}`}
              />
            </div>
            <span className="text-[0.65rem] text-muted-foreground">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}
