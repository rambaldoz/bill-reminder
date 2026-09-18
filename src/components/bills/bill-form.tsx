"use client";

import { useActionState } from "react";
import type { BillActionState } from "@/app/(app)/bills/actions";
import { CategoryIcon } from "@/lib/bills/category-icons";
import { RECURRENCE_LABEL } from "@/lib/bills/recurrence";
import type { BillWithCategory, Category, Recurrence } from "@/lib/bills/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RECURRENCES: Recurrence[] = ["none", "weekly", "monthly", "yearly"];
const initialState: BillActionState = { error: null };

export function BillForm({
  categories,
  bill,
  action,
  submitLabel,
  defaultCurrency = "AED",
  defaultReminderOffsetDays = 3,
}: {
  categories: Category[];
  bill?: BillWithCategory;
  action: (prevState: BillActionState, formData: FormData) => Promise<BillActionState>;
  submitLabel: string;
  defaultCurrency?: string;
  defaultReminderOffsetDays?: number;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const categoryItems = Object.fromEntries(
    categories.map((category) => [
      category.id,
      <span key={category.id} className="inline-flex items-center gap-1.5">
        <CategoryIcon icon={category.icon} className="size-4" />
        {category.name}
      </span>,
    ]),
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. DEWA — September"
          defaultValue={bill?.title}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select
          name="categoryId"
          items={categoryItems}
          defaultValue={bill?.category_id ?? categories[0]?.id}
        >
          <SelectTrigger id="categoryId" className="w-full">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <CategoryIcon icon={category.icon} className="size-4" />
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            defaultValue={bill?.amount}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            name="currency"
            placeholder="AED"
            maxLength={8}
            defaultValue={bill?.currency ?? defaultCurrency}
            className="uppercase"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="dueDate">Due date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          defaultValue={bill?.due_date}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="recurrence">Repeats</Label>
        <Select
          name="recurrence"
          items={RECURRENCE_LABEL}
          defaultValue={bill?.recurrence ?? "none"}
        >
          <SelectTrigger id="recurrence" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RECURRENCES.map((value) => (
              <SelectItem key={value} value={value}>
                {RECURRENCE_LABEL[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reminderOffsetDays">Remind me (days before due)</Label>
        <Input
          id="reminderOffsetDays"
          name="reminderOffsetDays"
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          defaultValue={bill?.reminder_offset_days ?? defaultReminderOffsetDays}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Optional"
          defaultValue={bill?.notes ?? ""}
          rows={3}
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
