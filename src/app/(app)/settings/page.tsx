import Link from "next/link";
import { ChevronRight, LogOut, Tags } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile";
import { CurrencyForm } from "@/components/settings/currency-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName = (user?.user_metadata?.display_name as string | undefined) ?? "";
  const profile = user ? await getProfile(supabase, user.id) : null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Settings</h1>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-sm font-medium">{displayName || "—"}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </CardContent>
      </Card>

      <Link
        href="/settings/categories"
        className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3.5 ring-1 ring-border/70 transition-colors hover:bg-muted/40"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Tags className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Categories</p>
          <p className="text-xs text-muted-foreground">Manage bill categories</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </Link>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencyForm defaultCurrency={profile?.default_currency ?? "AED"} />
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
        Reminder defaults and push notifications are coming in a later step.
      </div>

      <form action={signOut}>
        <Button type="submit" variant="outline" className="w-full">
          <LogOut className="size-4" />
          Sign out
        </Button>
      </form>
    </div>
  );
}
