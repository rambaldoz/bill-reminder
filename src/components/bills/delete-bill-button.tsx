"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteBill } from "@/app/(app)/bills/actions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteBillButton({
  id,
  isRecurring,
}: {
  id: string;
  isRecurring: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete(scope: "this" | "series") {
    startTransition(() => deleteBill(id, scope));
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button type="button" variant="destructive" />}
      >
        <Trash2 className="size-4" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this bill?</AlertDialogTitle>
          <AlertDialogDescription>
            {isRecurring
              ? "This bill repeats. You can delete just this occurrence or the whole series."
              : "This can't be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {isRecurring && (
            <AlertDialogAction
              variant="outline"
              disabled={pending}
              onClick={() => handleDelete("this")}
            >
              Just this one
            </AlertDialogAction>
          )}
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={() => handleDelete(isRecurring ? "series" : "this")}
          >
            {isRecurring ? "Delete whole series" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
