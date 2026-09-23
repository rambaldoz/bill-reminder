import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function StatTileSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-card p-4 ", className)}>
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-2.5 h-7 w-24" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  );
}
