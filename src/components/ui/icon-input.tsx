import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A bare input with a trailing icon, for native date/time fields whose own
 * picker affordance renders inconsistently across platforms (a small icon
 * on desktop Chrome, none at all on iOS Safari) — see the matching
 * ::-webkit-calendar-picker-indicator rule in globals.css.
 *
 * Built with the icon as a normal flex sibling rather than absolutely
 * positioned over the input: native date/time controls have their own
 * intrinsic sizing that doesn't reliably respect extra reserved padding on
 * iOS, which was overflowing the page. Plain flexbox has no such quirk.
 */
export function IconInput({
  icon: Icon,
  className,
  ...props
}: ComponentProps<"input"> & { icon: LucideIcon }) {
  return (
    <div className="flex h-12 w-full min-w-0 items-center gap-2 rounded-xl border border-input bg-card px-4 shadow-xs transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      <input
        className={cn(
          "min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground",
          className,
        )}
        {...props}
      />
      <Icon className="pointer-events-none size-4 shrink-0 text-muted-foreground" aria-hidden />
    </div>
  );
}
