"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Plus, Settings, PieChart, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isAction?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/bills/new", label: "Add", icon: Plus, isAction: true },
  { href: "/stats", label: "Stats", icon: PieChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/70 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="mx-auto flex max-w-md items-center justify-between px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon, isAction }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

          if (isAction) {
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className="-mt-6 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95"
              >
                <Icon className="size-6" />
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                active ? "text-primary-ink" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
