import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-24" />

      <div className="rounded-2xl bg-card p-4 ring-1 ring-border/70">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-3.5 h-4 w-32" />
        <Skeleton className="mt-1.5 h-3.5 w-40" />
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 ring-border/70">
        <Skeleton className="size-9 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      <div className="rounded-2xl bg-card p-4 ring-1 ring-border/70">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-3.5 h-12 w-full rounded-xl" />
      </div>

      <div className="rounded-2xl bg-card p-4 ring-1 ring-border/70">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-3.5 h-12 w-full rounded-xl" />
        <Skeleton className="mt-5 h-6 w-full rounded-full" />
      </div>

      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
