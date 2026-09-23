import * as Flags from "country-flag-icons/react/3x2";
import type { SVGProps } from "react";
import { currencyRegion } from "@/lib/currencies";
import { cn } from "@/lib/utils";

// The package's own types only declare each ISO region as a named export, with
// no index signature, so a dynamic lookup by a runtime string needs this cast.
const FLAGS = Flags as unknown as Record<string, (props: SVGProps<SVGSVGElement>) => React.JSX.Element>;

export function CurrencyFlag({ currency, className }: { currency: string; className?: string }) {
  const region = currencyRegion(currency);
  const Flag = region ? FLAGS[region] : undefined;
  if (!Flag) return null;
  return <Flag className={cn("h-3.5 w-auto shrink-0 rounded-full", className)} aria-hidden />;
}
