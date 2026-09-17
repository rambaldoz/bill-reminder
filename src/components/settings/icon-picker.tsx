"use client";

import { useState } from "react";
import { CATEGORY_ICON_OPTIONS, CategoryIcon } from "@/lib/bills/category-icons";
import { cn } from "@/lib/utils";

export function IconPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [value, setValue] = useState(defaultValue || CATEGORY_ICON_OPTIONS[0].slug);

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="grid grid-cols-5 gap-2">
        {CATEGORY_ICON_OPTIONS.map((option) => {
          const selected = value === option.slug;
          return (
            <button
              key={option.slug}
              type="button"
              aria-label={option.label}
              aria-pressed={selected}
              onClick={() => setValue(option.slug)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl ring-1 transition-colors",
                selected
                  ? "bg-primary text-primary-foreground ring-transparent"
                  : "bg-secondary/60 text-foreground ring-border/70 hover:bg-secondary",
              )}
            >
              <CategoryIcon icon={option.slug} className="size-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
