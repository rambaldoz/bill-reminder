"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { nextDueDate } from "@/lib/bills/recurrence";
import type { Recurrence } from "@/lib/bills/types";

export type BillActionState = { error: string | null };

const RECURRENCES: Recurrence[] = ["none", "weekly", "monthly", "yearly"];

function parseBillForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "");
  const currency = String(formData.get("currency") ?? "").trim().toUpperCase();
  const dueDate = String(formData.get("dueDate") ?? "");
  const recurrence = String(formData.get("recurrence") ?? "none") as Recurrence;
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  const reminderOffsetRaw = String(formData.get("reminderOffsetDays") ?? "3");
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!title) return { error: "Title is required." } as const;

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount) || amount < 0) {
    return { error: "Enter a valid amount." } as const;
  }

  if (!currency) return { error: "Currency is required." } as const;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    return { error: "Enter a valid due date." } as const;
  }

  if (!RECURRENCES.includes(recurrence)) {
    return { error: "Invalid recurrence." } as const;
  }

  const reminderOffsetDays = Number(reminderOffsetRaw);
  if (!Number.isInteger(reminderOffsetDays) || reminderOffsetDays < 0) {
    return { error: "Reminder offset must be a whole number of days." } as const;
  }

  return {
    error: null,
    values: {
      title,
      amount,
      currency,
      due_date: dueDate,
      recurrence,
      category_id: categoryId,
      reminder_offset_days: reminderOffsetDays,
      notes,
    },
  } as const;
}

export async function createBill(
  _prevState: BillActionState,
  formData: FormData,
): Promise<BillActionState> {
  const parsed = parseBillForm(formData);
  if (parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("bills").insert({
    ...parsed.values,
    user_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/bills");
}

export async function updateBill(
  id: string,
  _prevState: BillActionState,
  formData: FormData,
): Promise<BillActionState> {
  const parsed = parseBillForm(formData);
  if (parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase
    .from("bills")
    // Any edit resets reminder eligibility, so a rescheduled due date or
    // offset still gets a fresh reminder instead of being skipped as "sent".
    .update({ ...parsed.values, reminder_sent_at: null })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect(`/bills/${id}`);
}

export async function deleteBill(id: string, scope: "this" | "series") {
  const supabase = await createClient();

  if (scope === "series") {
    const { data: bill, error: fetchError } = await supabase
      .from("bills")
      .select("id, parent_bill_id")
      .eq("id", id)
      .single();
    if (fetchError) throw fetchError;

    const rootId = bill.parent_bill_id ?? bill.id;
    const { error } = await supabase
      .from("bills")
      .delete()
      .or(`id.eq.${rootId},parent_bill_id.eq.${rootId}`);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("bills").delete().eq("id", id);
    if (error) throw error;
  }

  revalidatePath("/", "layout");
  redirect("/bills");
}

export async function markBillPaid(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bill, error: fetchError } = await supabase
    .from("bills")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchError) throw fetchError;

  const { error: updateError } = await supabase
    .from("bills")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) throw updateError;

  if (bill.recurrence !== "none") {
    const { error: insertError } = await supabase.from("bills").insert({
      user_id: bill.user_id,
      category_id: bill.category_id,
      title: bill.title,
      amount: bill.amount,
      currency: bill.currency,
      due_date: nextDueDate(bill.due_date, bill.recurrence),
      recurrence: bill.recurrence,
      status: "upcoming",
      reminder_offset_days: bill.reminder_offset_days,
      notes: bill.notes,
      parent_bill_id: bill.parent_bill_id ?? bill.id,
    });
    if (insertError) throw insertError;
  }

  revalidatePath("/", "layout");
}
