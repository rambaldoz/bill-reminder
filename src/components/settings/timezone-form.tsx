"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateTimezone, type SettingsActionState } from "@/app/(app)/settings/actions";
import { TIMEZONES } from "@/lib/timezone";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: SettingsActionState = { error: null };

const TIMEZONE_ITEMS = Object.fromEntries(TIMEZONES.map((tz) => [tz, tz]));

export function TimezoneForm({ defaultTimezone }: { defaultTimezone: string }) {
  const [state, formAction, pending] = useActionState(updateTimezone, initialState);

  useEffect(() => {
    if (state.success) toast.success("Timezone saved");
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Label htmlFor="timezone">Timezone</Label>
      <div className="flex items-center gap-2">
        <Select name="timezone" items={TIMEZONE_ITEMS} defaultValue={defaultTimezone}>
          <SelectTrigger id="timezone" className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <p className="text-xs text-muted-foreground">
        Reminder times (below, and on each bill) are based on this timezone.
      </p>
    </form>
  );
}
