import { Skeleton } from "@/components/ui/skeleton";
import { BillCardSkeleton } from "@/components/skeletons/bill-card-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <BillCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
