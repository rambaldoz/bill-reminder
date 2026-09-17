"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { markBillPaid } from "@/app/(app)/bills/actions";
import { Button } from "@/components/ui/button";

export function MarkPaidButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => markBillPaid(id))}
    >
      <Check className="size-4" />
      {pending ? "Marking paid…" : "Mark as paid"}
    </Button>
  );
}
