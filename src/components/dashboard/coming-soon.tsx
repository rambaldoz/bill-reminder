import { type LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Icon className="size-5" />
        </span>
        <p className="max-w-[22ch] text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
