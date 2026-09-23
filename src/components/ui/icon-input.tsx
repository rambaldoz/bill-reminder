import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

/**
 * An Input with a trailing icon overlay, for native date/time fields whose
 * own picker affordance renders inconsistently across platforms (a small
 * icon on desktop Chrome, none at all on iOS Safari) — see the matching
 * ::-webkit-calendar-picker-indicator rule in globals.css.
 */
export function IconInput({
  icon: Icon,
  className,
  ...props
}: ComponentProps<typeof Input> & { icon: LucideIcon }) {
  return (
    <div className="relative">
      <Input className={cn("pr-11", className)} {...props} />
      <Icon
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}
