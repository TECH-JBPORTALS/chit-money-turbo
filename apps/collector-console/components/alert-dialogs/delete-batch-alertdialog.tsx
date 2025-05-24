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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteBatchAlertDialog({
  children,
  batchId,
}: {
  children: React.ReactNode;
  batchId: string;
}) {
  const [open, onOpenChange] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: deletePayment, isPending } = useMutation(
    trpc.batches.delete.mutationOptions({
      async onSuccess(d, v) {
        toast.info("Batch deleted");
      },
      async onSettled() {
        await queryClient.invalidateQueries(trpc.batches.getAll.queryOptions());
        onOpenChange(false);
        router.replace("/");
      },
      onError() {
        toast.info("Unable to delete batch record", {
          description: "Try again later sometime",
        });
      },
    })
  );

  async function handleDelete() {
    await deletePayment({ batchId });

    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
    }, 300);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Batch</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the batch?. Because, once you delete
            the batch it's irreversable process. You can't undo this action. All
            associated data with this batch will be gone.
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
