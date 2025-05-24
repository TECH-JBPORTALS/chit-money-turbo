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

export default function CompleteBatchAlertDialog({
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

  const { mutateAsync: markAsCompleted, isPending } = useMutation(
    trpc.batches.markAsCompleted.mutationOptions({
      async onSuccess(d, v) {
        toast.info("Batch marked as completed");
      },
      async onSettled() {
        await queryClient.invalidateQueries(trpc.batches.getAll.queryOptions());
        onOpenChange(false);
      },
      onError() {
        toast.info("Unable to update batch", {
          description: "Try again later sometime",
        });
      },
    })
  );

  async function handleUpdate() {
    await markAsCompleted({ batchId });

    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
    }, 300);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Batch Completion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark as a complete?. Once you marked as
            complete all data will be readonly not editable.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"outline"}>Cancel</Button>
          </AlertDialogCancel>

          <AlertDialogAction onClick={(e) => e.preventDefault()} asChild>
            <Button isLoading={isPending} onClick={handleUpdate}>
              Mark as Completed
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
