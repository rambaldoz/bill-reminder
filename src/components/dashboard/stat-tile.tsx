import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: React.ReactNode;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-card p-4 ", className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-heading text-2xl font-semibold tabular-nums tracking-tight">
        {value}
      </p>
      {hint && (
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          {icon}
          {hint}
        </p>
      )}
    </div>
  );
}
