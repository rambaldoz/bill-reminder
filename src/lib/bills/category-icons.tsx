import {
  Zap,
  Droplet,
  Wifi,
  Home,
  ShoppingCart,
  Repeat,
  Car,
  ShieldCheck,
  Receipt,
  Tag,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps a category's stored `icon` slug (a plain string, decoupled from any
 * particular icon library) to a lucide-react component. The whole app uses
 * lucide as its one icon set, so this is the only place that mapping lives.
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  bolt: Zap,
  droplet: Droplet,
  wifi: Wifi,
  home: Home,
  "shopping-cart": ShoppingCart,
  repeat: Repeat,
  car: Car,
  "shield-check": ShieldCheck,
  "receipt-2": Receipt,
};

const FALLBACK_ICON = Tag;

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string | null;
  className?: string;
}) {
  const Icon = (icon && CATEGORY_ICONS[icon]) || FALLBACK_ICON;
  return <Icon className={className} strokeWidth={1.75} aria-hidden />;
}
