import { Skeleton } from "@/components/ui/skeleton";
import { BillFormSkeleton } from "@/components/skeletons/bill-form-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-32" />
      <BillFormSkeleton />
    </div>
  );
}
