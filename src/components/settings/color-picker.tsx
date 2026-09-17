"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { CATEGORY_COLOR_OPTIONS, DEFAULT_CATEGORY_COLOR } from "@/lib/bills/category-colors";
import { cn } from "@/lib/utils";

export function ColorPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue || DEFAULT_CATEGORY_COLOR);

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap gap-2.5">
        {CATEGORY_COLOR_OPTIONS.map((color) => {
          const selected = value === color;
          return (
            <button
              key={color}
              type="button"
              aria-label={color}
              aria-pressed={selected}
              onClick={() => setValue(color)}
              style={{ backgroundColor: color }}
              className={cn(
                "flex size-9 items-center justify-center rounded-full transition-transform",
                selected
                  ? "scale-110 outline-2 outline-offset-2 outline-foreground/70"
                  : "hover:scale-105",
              )}
            >
              {selected && <Check className="size-4 text-white" strokeWidth={3} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
