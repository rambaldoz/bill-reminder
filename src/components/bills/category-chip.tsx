import { Tag } from "lucide-react";
import { CategoryIcon } from "@/lib/bills/category-icons";
import type { Category } from "@/lib/bills/types";

export function CategoryChip({ category }: { category: Category | null }) {
  if (!category) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        <Tag className="size-3.5" strokeWidth={1.75} aria-hidden />
        Uncategorized
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${category.color}1f`, color: category.color }}
    >
      <CategoryIcon icon={category.icon} className="size-3.5" />
      {category.name}
    </span>
  );
}
