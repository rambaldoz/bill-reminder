import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/nav/bottom-nav";
import { UserMenu } from "@/components/nav/user-menu";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = (user.user_metadata?.display_name as string | undefined) ?? "";

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-heading text-sm font-semibold">
              B
            </span>
            <span className="font-heading text-base font-semibold tracking-tight">
              Bill Tracker
            </span>
          </div>
          <UserMenu displayName={displayName} email={user.email ?? ""} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-28 pt-6">{children}</main>

      <BottomNav />
    </div>
  );
}
