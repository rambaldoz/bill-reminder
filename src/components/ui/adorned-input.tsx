import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A bare input with a trailing icon or text unit, for fields where the
 * native affordance renders inconsistently across platforms — e.g. date/time
 * pickers show a small icon on desktop Chrome but none at all on iOS Safari.
 *
 * Built with the adornment as a normal flex sibling rather than absolutely
 * positioned over the input: native date/time controls have their own
 * intrinsic sizing that doesn't reliably respect extra reserved padding on
 * iOS, which was overflowing the page. Plain flexbox has no such quirk.
 */
export function AdornedInput({
  icon: Icon,
  suffix,
  className,
  ...props
}: ComponentProps<"input"> & { icon?: LucideIcon; suffix?: ReactNode }) {
  return (
    <div className="flex h-12 w-full min-w-0 items-center gap-1 rounded-xl border border-input bg-card pr-3 pl-4 shadow-xs transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      <input
        className={cn(
          "min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground",
          className,
        )}
        {...props}
      />
      {Icon && <Icon className="pointer-events-none size-4 shrink-0 text-muted-foreground" aria-hidden />}
      {suffix && (
        <span className="pointer-events-none shrink-0 text-sm text-muted-foreground">{suffix}</span>
      )}
    </div>
  );
}
