import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-32" />

      <div className="rounded-2xl bg-card p-4 ">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-1">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={`h-${i}`} className="mx-auto mb-2 h-3 w-6" />
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="mx-auto size-10 rounded-full" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-40" />
        <div className="rounded-2xl border border-dashed border-border py-8" />
      </div>
    </div>
  );
}
