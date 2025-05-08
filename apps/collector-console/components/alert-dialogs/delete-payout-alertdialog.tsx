import { useTRPC } from "@/trpc/react";
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
} from "@cmt/ui/components/alert-dialog";
import { Button } from "@cmt/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function DeletePayoutAlertDialog({
  children,
  payoutId,
}: {
  children: React.ReactNode;
  payoutId: string;
}) {
  const [open, onOpenChange] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutateAsync: deletepayout, isPending } = useMutation(
    trpc.payouts.delete.mutationOptions({
      async onSuccess(d, v) {
        await queryClient.invalidateQueries(trpc.payouts.ofBatch.pathFilter());
        toast.info("payout details deleted");
        onOpenChange(false);
      },
      onError() {
        toast.info("Unable to delete payout record", {
          description: "Try again later sometime",
        });
      },
    })
  );

  async function handleDelete() {
    await deletepayout({ payoutId });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete payout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the payout?. Because, once you
            delete the payout it's irreversable process. You can't undo this
            action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"outline"}>Cancel</Button>
          </AlertDialogCancel>

          <AlertDialogAction onClick={(e) => e.preventDefault()} asChild>
            <Button
              isLoading={isPending}
              onClick={handleDelete}
              variant={"destructive"}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
