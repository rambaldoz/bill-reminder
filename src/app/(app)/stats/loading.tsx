import { Skeleton } from "@/components/ui/skeleton";
import { StatTileSkeleton } from "@/components/skeletons/stat-tile-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTileSkeleton />
        <StatTileSkeleton />
        <StatTileSkeleton className="col-span-2" />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-card p-5 ">
          <Skeleton className="size-44 shrink-0 rounded-full" />
          <div className="flex w-full flex-col gap-2.5">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </div>

      <div>
        <Skeleton className="mb-4 h-5 w-28" />
        <div className="rounded-2xl bg-card p-5 ">
          <Skeleton className="h-36 w-full" />
        </div>
      </div>
    </div>
  );
}
