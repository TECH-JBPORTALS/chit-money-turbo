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

export default function DeletePaymentAlertDialog({
  children,
  paymentId,
}: {
  children: React.ReactNode;
  paymentId: string;
}) {
  const [open, onOpenChange] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const { mutateAsync: deletePayment, isPending } = useMutation(
    trpc.payments.delete.mutationOptions({
      async onSuccess(d, v) {
        await queryClient.invalidateQueries(
          trpc.payments.ofBatchSelectedRunway.pathFilter()
        );
        toast.info("Payment details deleted");
        onOpenChange(false);
      },
      onError() {
        toast.info("Unable to delete payment record", {
          description: "Try again later sometime",
        });
      },
    })
  );

  async function handleDelete() {
    await deletePayment({ paymentId });

    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
    }, 300);
  }

  return (
    <AlertDialog
      defaultOpen={open}
      key={"Delete Payment"}
      onOpenChange={onOpenChange}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Payment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delte the payment?. Because, once you
            delete the payment it's irreversable process. You can't undo this
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
