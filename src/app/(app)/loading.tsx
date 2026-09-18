import { Skeleton } from "@/components/ui/skeleton";
import { StatTileSkeleton } from "@/components/skeletons/stat-tile-skeleton";
import { BillCardSkeleton } from "@/components/skeletons/bill-card-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-52" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTileSkeleton />
        <StatTileSkeleton />
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28" />
        <div className="flex flex-col gap-2.5">
          <BillCardSkeleton />
          <BillCardSkeleton />
        </div>
      </div>
    </div>
  );
}
