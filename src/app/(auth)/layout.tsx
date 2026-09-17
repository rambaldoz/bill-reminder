export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="mb-8 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-heading text-lg font-semibold">
          B
        </span>
        <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Bill Tracker
        </span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
