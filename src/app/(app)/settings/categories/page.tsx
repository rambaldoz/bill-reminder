import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/bills/queries";
import { CategoryIcon } from "@/lib/bills/category-icons";
import { Button } from "@/components/ui/button";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const categories = await getCategories(supabase);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            aria-label="Back to settings"
            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Categories</h1>
        </div>
        <Button size="sm" nativeButton={false} render={<Link href="/settings/categories/new" />}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      <div className="flex flex-col gap-2.5">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/settings/categories/${category.id}`}
            className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 ring-border/70 transition-colors hover:bg-muted/40"
          >
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${category.color}1f`, color: category.color }}
            >
              <CategoryIcon icon={category.icon} className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{category.name}</p>
              {category.is_default && (
                <p className="text-xs text-muted-foreground">Default category</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
