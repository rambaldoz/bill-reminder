import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBills } from "@/lib/bills/queries";
import { billStatus } from "@/lib/bills/status";
import { BottomNav } from "@/components/nav/bottom-nav";
import { NotificationBell } from "@/components/nav/notification-bell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = (user.user_metadata?.display_name as string | undefined) || "there";

  const bills = await getBills(supabase);
  const reminders = bills.filter((bill) => {
    if (bill.paid_at) return false;
    const status = billStatus(bill);
    return status === "due_soon" || status === "overdue";
  });

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="font-heading text-lg font-semibold tracking-tight">{displayName}</p>
          </div>
          <NotificationBell bills={reminders} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-5 pb-28 pt-6">{children}</main>

      <BottomNav />
    </div>
  );
}
