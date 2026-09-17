import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCategory } from "@/lib/bills/queries";
import { CategoryForm } from "@/components/settings/category-form";
import { DeleteCategoryButton } from "@/components/settings/delete-category-button";
import { updateCategory } from "@/app/(app)/settings/categories/actions";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const category = await getCategory(supabase, id);

  if (!category) notFound();

  const boundUpdate = updateCategory.bind(null, category.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/settings/categories"
            aria-label="Back to categories"
            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Edit category</h1>
        </div>
        <DeleteCategoryButton id={category.id} name={category.name} />
      </div>
      <CategoryForm category={category} action={boundUpdate} submitLabel="Save changes" />
    </div>
  );
}
