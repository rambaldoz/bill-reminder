import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CategoryForm } from "@/components/settings/category-form";
import { createCategory } from "@/app/(app)/settings/categories/actions";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link
          href="/settings/categories"
          aria-label="Back to categories"
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Add category</h1>
      </div>
      <CategoryForm action={createCategory} submitLabel="Add category" />
    </div>
  );
}
