import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>

      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 ring-border/70"
          >
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
