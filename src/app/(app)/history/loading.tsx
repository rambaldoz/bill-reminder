import { Skeleton } from "@/components/ui/skeleton";
import { BillCardSkeleton } from "@/components/skeletons/bill-card-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Skeleton className="size-9 rounded-xl" />
        <Skeleton className="h-8 w-28" />
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <BillCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
