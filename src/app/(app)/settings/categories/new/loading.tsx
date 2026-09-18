import { Skeleton } from "@/components/ui/skeleton";
import { CategoryFormSkeleton } from "@/components/skeletons/category-form-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Skeleton className="size-9 rounded-xl" />
        <Skeleton className="h-8 w-36" />
      </div>
      <CategoryFormSkeleton />
    </div>
  );
}
