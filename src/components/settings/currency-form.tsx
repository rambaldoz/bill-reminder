"use client";

import { useActionState } from "react";
import { updateDefaultCurrency, type SettingsActionState } from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SettingsActionState = { error: null };

export function CurrencyForm({ defaultCurrency }: { defaultCurrency: string }) {
  const [state, formAction, pending] = useActionState(updateDefaultCurrency, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Label htmlFor="defaultCurrency">Default currency</Label>
      <div className="flex items-center gap-2">
        <Input
          id="defaultCurrency"
          name="defaultCurrency"
          defaultValue={defaultCurrency}
          maxLength={8}
          className="w-28 uppercase"
          required
        />
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-status-paid">Saved.</p>}
      <p className="text-xs text-muted-foreground">
        Used as the starting currency when you add a new bill.
      </p>
    </form>
  );
}
