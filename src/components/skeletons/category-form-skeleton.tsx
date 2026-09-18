import { Skeleton } from "@/components/ui/skeleton";

export function CategoryFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-12" />
        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="size-9 rounded-full" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-10" />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      </div>
      <Skeleton className="mt-2 h-12 w-full rounded-xl" />
    </div>
  );
}
