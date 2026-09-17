import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-card p-4 ring-1 ring-border/70", className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-heading text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
