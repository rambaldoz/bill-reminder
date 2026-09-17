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
  Dumbbell,
  HeartPulse,
  Gift,
  Plane,
  GraduationCap,
  Smartphone,
  Tv,
  Music,
  Coffee,
  Pill,
  PawPrint,
  Baby,
  Briefcase,
  Fuel,
  Wrench,
  CreditCard,
  PiggyBank,
  Building2,
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
  tag: Tag,
  dumbbell: Dumbbell,
  "heart-pulse": HeartPulse,
  gift: Gift,
  plane: Plane,
  "graduation-cap": GraduationCap,
  smartphone: Smartphone,
  tv: Tv,
  music: Music,
  coffee: Coffee,
  pill: Pill,
  "paw-print": PawPrint,
  baby: Baby,
  briefcase: Briefcase,
  fuel: Fuel,
  wrench: Wrench,
  "credit-card": CreditCard,
  "piggy-bank": PiggyBank,
  building: Building2,
};

/** Options for the category icon picker, in display order. */
export const CATEGORY_ICON_OPTIONS: Array<{ slug: string; label: string }> = [
  { slug: "bolt", label: "Electricity" },
  { slug: "droplet", label: "Water" },
  { slug: "wifi", label: "Internet" },
  { slug: "home", label: "Home" },
  { slug: "building", label: "Building" },
  { slug: "shopping-cart", label: "Groceries" },
  { slug: "repeat", label: "Subscription" },
  { slug: "car", label: "Car" },
  { slug: "fuel", label: "Fuel" },
  { slug: "shield-check", label: "Insurance" },
  { slug: "heart-pulse", label: "Health" },
  { slug: "pill", label: "Medical" },
  { slug: "dumbbell", label: "Fitness" },
  { slug: "graduation-cap", label: "Education" },
  { slug: "plane", label: "Travel" },
  { slug: "smartphone", label: "Phone" },
  { slug: "tv", label: "Streaming" },
  { slug: "music", label: "Music" },
  { slug: "coffee", label: "Coffee" },
  { slug: "paw-print", label: "Pet" },
  { slug: "baby", label: "Baby" },
  { slug: "briefcase", label: "Business" },
  { slug: "wrench", label: "Maintenance" },
  { slug: "credit-card", label: "Fees" },
  { slug: "piggy-bank", label: "Savings" },
  { slug: "gift", label: "Gift" },
  { slug: "receipt-2", label: "Other" },
  { slug: "tag", label: "General" },
];

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
