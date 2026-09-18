import { Skeleton } from "@/components/ui/skeleton";
import { BillFormSkeleton } from "@/components/skeletons/bill-form-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-12 w-36 rounded-xl" />
        <Skeleton className="h-12 w-28 rounded-xl" />
      </div>
      <BillFormSkeleton />
    </div>
  );
}
