"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CategoryActionState = { error: string | null };

function parseCategoryForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const icon = String(formData.get("icon") ?? "").trim();

  if (!name) return { error: "Name is required." } as const;
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) return { error: "Choose a color." } as const;
  if (!icon) return { error: "Choose an icon." } as const;

  return { error: null, values: { name, color, icon } } as const;
}

export async function createCategory(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const parsed = parseCategoryForm(formData);
  if (parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("categories").insert({
    ...parsed.values,
    user_id: user.id,
    is_default: false,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/settings/categories");
}

export async function updateCategory(
  id: string,
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const parsed = parseCategoryForm(formData);
  if (parsed.error) return { error: parsed.error };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").update(parsed.values).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/settings/categories");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/", "layout");
  redirect("/settings/categories");
}
