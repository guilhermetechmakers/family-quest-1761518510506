import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useDisputeTransaction } from '@/hooks/useTransactions';
import type { TransactionHistory } from '@/types/transaction';

const disputeSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  additional_details: z.string().optional(),
});

type DisputeFormData = z.infer<typeof disputeSchema>;

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionHistory | null;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const disputeMutation = useDisputeTransaction();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DisputeFormData>({
    resolver: zodResolver(disputeSchema),
    defaultValues: {
      reason: '',
      additional_details: '',
    },
  });

  const onSubmit = (data: DisputeFormData) => {
    if (!transaction) return;

    disputeMutation.mutate(
      {
        transaction_id: transaction.id,
        reason: data.reason,
        additional_details: data.additional_details,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Dispute Transaction
          </DialogTitle>
        </DialogHeader>

          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Transaction Details</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><span className="font-medium">Amount:</span> ${transaction.amount.toFixed(2)} {transaction.currency.toUpperCase()}</p>
              <p><span className="font-medium">Type:</span> {transaction.type}</p>
              <p><span className="font-medium">Contributor:</span> {transaction.contributor.full_name}</p>
              <p><span className="font-medium">Goal:</span> {transaction.goal.title}</p>
              <p><span className="font-medium">Date:</span> {new Date(transaction.date).toLocaleDateString()}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Reason for Dispute *
              </label>
              <Textarea
                {...register('reason')}
                placeholder="Please explain why you are disputing this transaction..."
                className="min-h-[100px] resize-none"
              />
              {errors.reason && (
                <p className="text-sm text-red-500 mt-1">{errors.reason.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Additional Details (Optional)
              </label>
              <Textarea
                {...register('additional_details')}
                placeholder="Any additional information that might help with the review..."
                className="min-h-[80px] resize-none"
              />
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-orange-800">
                  <p className="font-medium mb-1">Important:</p>
                  <p>
                    Disputing a transaction will flag it for review by our support team. 
                    This action cannot be undone. Please ensure your reason is accurate and detailed.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={disputeMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={disputeMutation.isPending}
              >
                {disputeMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Dispute
                  </>
                )}
              </Button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
};