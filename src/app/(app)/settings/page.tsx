import { LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName = (user?.user_metadata?.display_name as string | undefined) ?? "";

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Settings</h1>

      <Card className="border-border/60 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-sm font-medium">{displayName || "—"}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
        Categories, reminder defaults, push notifications, and currency
        preferences are coming in a later step.
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
