"use client";

import { useActionState } from "react";
import type { CategoryActionState } from "@/app/(app)/settings/categories/actions";
import type { Category } from "@/lib/bills/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPicker } from "./icon-picker";
import { ColorPicker } from "./color-picker";

const initialState: CategoryActionState = { error: null };

export function CategoryForm({
  category,
  action,
  submitLabel,
}: {
  category?: Category;
  action: (prevState: CategoryActionState, formData: FormData) => Promise<CategoryActionState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Gym membership"
          defaultValue={category?.name}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Color</Label>
        <ColorPicker name="color" defaultValue={category?.color} />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Icon</Label>
        <IconPicker name="icon" defaultValue={category?.icon} />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
