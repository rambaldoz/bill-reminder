"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SettingsActionState = { error: string | null; success?: boolean };

export async function updateDefaultCurrency(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const currency = String(formData.get("defaultCurrency") ?? "")
    .trim()
    .toUpperCase();

  if (!/^[A-Z]{3,8}$/.test(currency)) {
    return { error: "Enter a valid currency code, e.g. AED." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ default_currency: currency })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { error: null, success: true };
}

export async function updateDefaultReminderOffset(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const days = Number(formData.get("defaultReminderOffsetDays"));

  if (!Number.isInteger(days) || days < 0 || days > 30) {
    return { error: "Enter a whole number of days, 0-30." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ default_reminder_offset_days: days })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { error: null, success: true };
}
