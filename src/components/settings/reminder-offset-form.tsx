"use client";

import { useActionState, useEffect } from "react";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import {
  updateReminderDefaults,
  type SettingsActionState,
} from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/button";
import { AdornedInput } from "@/components/ui/adorned-input";
import { Label } from "@/components/ui/label";

const initialState: SettingsActionState = { error: null };

export function ReminderOffsetForm({
  defaultDays,
  defaultTime,
}: {
  defaultDays: number;
  defaultTime: string;
}) {
  const [state, formAction, pending] = useActionState(updateReminderDefaults, initialState);

  useEffect(() => {
    if (state.success) toast.success("Default reminder saved");
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-[2fr_3fr] gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="defaultReminderOffsetDays" className="text-xs text-muted-foreground">
            Remind me
          </Label>
          <AdornedInput
            suffix="days"
            id="defaultReminderOffsetDays"
            name="defaultReminderOffsetDays"
            type="number"
            min="0"
            max="30"
            step="1"
            inputMode="numeric"
            defaultValue={defaultDays}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="defaultReminderTime" className="text-xs text-muted-foreground">
            At
          </Label>
          <AdornedInput
            icon={Clock}
            id="defaultReminderTime"
            name="defaultReminderTime"
            type="time"
            defaultValue={defaultTime}
            required
          />
        </div>
      </div>
      <Button type="submit" variant="secondary" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Save"}
      </Button>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <p className="text-xs text-muted-foreground">
        Used as the starting reminder for new bills. Notifications may arrive up to 15
        minutes after the chosen time.
      </p>
    </form>
  );
}
