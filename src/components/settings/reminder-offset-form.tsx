"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import {
  updateDefaultReminderOffset,
  type SettingsActionState,
} from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: SettingsActionState = { error: null };

export function ReminderOffsetForm({ defaultDays }: { defaultDays: number }) {
  const [state, formAction, pending] = useActionState(updateDefaultReminderOffset, initialState);

  useEffect(() => {
    if (state.success) toast.success("Default reminder saved");
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Label htmlFor="defaultReminderOffsetDays">Remind me (days before due)</Label>
      <div className="flex items-center gap-2">
        <Input
          id="defaultReminderOffsetDays"
          name="defaultReminderOffsetDays"
          type="number"
          min="0"
          max="30"
          step="1"
          inputMode="numeric"
          defaultValue={defaultDays}
          className="w-28"
          required
        />
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <p className="text-xs text-muted-foreground">
        Used as the starting reminder offset when you add a new bill.
      </p>
    </form>
  );
}
