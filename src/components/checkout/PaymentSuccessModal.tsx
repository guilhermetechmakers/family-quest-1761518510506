import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Target } from 'lucide-react';
import { useGenerateReceiptPDF } from '@/hooks/usePayments';

interface PaymentSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  paymentIntent: any;
  amount: number;
  currency: string;
}

export function PaymentSuccessModal({
  open,
  onOpenChange,
  onClose,
  paymentIntent,
  amount,
  currency
}: PaymentSuccessModalProps) {
  const generateReceiptPDF = useGenerateReceiptPDF();

  const handleDownloadReceipt = async () => {
    if (paymentIntent?.id) {
      try {
        await generateReceiptPDF.mutateAsync(paymentIntent.id);
      } catch (error) {
        console.error('Error generating receipt:', error);
      }
    }
  };

  const handleViewGoal = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mx-auto mb-4"
          >
            <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-text-primary" />
            </div>
          </motion.div>
          
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Payment Successful!
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Your contribution has been processed and added to the family goal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Details */}
          <Card className="bg-mint-tint border-mint-green/20">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Amount Paid</span>
                  <span className="font-semibold text-text-primary">
                    ${amount.toFixed(2)} {currency}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-tertiary">Transaction ID</span>
                  <span className="text-text-tertiary font-mono text-xs">
                    {paymentIntent?.id?.slice(-8) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-tertiary">Date</span>
                  <span className="text-text-tertiary">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-pale-lavender/30 rounded-xl p-4 border border-pale-lavender/50"
          >
            <div className="flex items-start gap-3">
              <div className="p-1 bg-pale-lavender rounded-full mt-0.5">
                <Target className="h-4 w-4 text-text-primary" />
              </div>
              <div>
                <p className="font-medium text-text-primary">Contribution Added!</p>
                <p className="text-sm text-text-secondary">
                  Your payment has been successfully added to the family goal. 
                  You can view the updated progress on the goal page.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleDownloadReceipt}
              disabled={generateReceiptPDF.isPending}
              variant="outline"
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {generateReceiptPDF.isPending ? 'Generating...' : 'Download Receipt'}
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleViewGoal}
                variant="outline"
                className="flex-1"
              >
                <Target className="h-4 w-4 mr-2" />
                View Goal
              </Button>
              <Button
                onClick={onClose}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Done
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-xs text-text-tertiary">
              A receipt has been sent to your email address. You can also view this transaction in your transaction history.
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}