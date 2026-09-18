import { Skeleton } from "@/components/ui/skeleton";

export function BillFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <Skeleton className="mt-2 h-12 w-full rounded-xl" />
    </div>
  );
}
