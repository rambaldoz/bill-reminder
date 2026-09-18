"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PushSubscriptionJSON = { endpoint: string; p256dh: string; auth: string };

export async function saveSubscription(subscription: PushSubscriptionJSON) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert(
      { user_id: user.id, ...subscription },
      { onConflict: "endpoint" },
    );

  if (error) throw error;
}

export async function removeSubscription(endpoint: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  if (error) throw error;
}
