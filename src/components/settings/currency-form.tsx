"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateDefaultCurrency, type SettingsActionState } from "@/app/(app)/settings/actions";
import { CURRENCIES } from "@/lib/currencies";
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

const CURRENCY_ITEMS = Object.fromEntries(
  CURRENCIES.map((currency) => [currency.code, `${currency.code} — ${currency.name}`]),
);

export function CurrencyForm({ defaultCurrency }: { defaultCurrency: string }) {
  const [state, formAction, pending] = useActionState(updateDefaultCurrency, initialState);

  useEffect(() => {
    if (state.success) toast.success("Default currency saved");
  }, [state.success]);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Label htmlFor="defaultCurrency">Default currency</Label>
      <div className="flex items-center gap-2">
        <Select name="defaultCurrency" items={CURRENCY_ITEMS} defaultValue={defaultCurrency}>
          <SelectTrigger id="defaultCurrency" className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.code} — {currency.name}
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
        Used as the starting currency when you add a new bill.
      </p>
    </form>
  );
}
