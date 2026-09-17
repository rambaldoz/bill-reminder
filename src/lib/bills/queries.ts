import type { SupabaseClient } from "@supabase/supabase-js";
import type { BillWithCategory, Category } from "./types";

export async function getCategories(
  supabase: SupabaseClient,
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;

  // "Other" is a catch-all, so it reads better pinned to the end of the
  // list rather than sorted alphabetically with everything else.
  const categories = data as Category[];
  return categories.sort((a, b) => {
    if (a.name === "Other") return 1;
    if (b.name === "Other") return -1;
    return 0;
  });
}

export async function getCategory(
  supabase: SupabaseClient,
  id: string,
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as Category | null;
}

export async function getBills(
  supabase: SupabaseClient,
): Promise<BillWithCategory[]> {
  const { data, error } = await supabase
    .from("bills")
    .select("*, category:categories(*)")
    .order("due_date", { ascending: true });

  if (error) throw error;
  return data as unknown as BillWithCategory[];
}

export async function getBill(
  supabase: SupabaseClient,
  id: string,
): Promise<BillWithCategory | null> {
  const { data, error } = await supabase
    .from("bills")
    .select("*, category:categories(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as BillWithCategory | null;
}
