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
import { AlertCircle, RefreshCw, CreditCard, HelpCircle } from 'lucide-react';

interface PaymentFailureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onRetry: () => void;
}

export function PaymentFailureModal({
  open,
  onOpenChange,
  onClose,
  onRetry
}: PaymentFailureModalProps) {
  const handleRetry = () => {
    onRetry();
    onClose();
  };

  const handleContactSupport = () => {
    // In a real app, this would open a support ticket or chat
    window.open('mailto:support@familyquest.com?subject=Payment Issue', '_blank');
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </motion.div>
          
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Payment Failed
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            We encountered an issue processing your payment. Please try again or contact support.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Details */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">Payment Processing Error</span>
                </div>
                <p className="text-sm text-red-700">
                  Your payment could not be processed at this time. This may be due to:
                </p>
                <ul className="text-xs text-red-600 space-y-1 ml-4">
                  <li>• Insufficient funds</li>
                  <li>• Card declined by bank</li>
                  <li>• Invalid card information</li>
                  <li>• Network connectivity issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Helpful Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-pale-lavender/30 rounded-xl p-4 border border-pale-lavender/50"
          >
            <div className="flex items-start gap-3">
              <div className="p-1 bg-pale-lavender rounded-full mt-0.5">
                <HelpCircle className="h-4 w-4 text-text-primary" />
              </div>
              <div>
                <p className="font-medium text-text-primary">What can you do?</p>
                <ul className="text-sm text-text-secondary space-y-1 mt-1">
                  <li>• Check your card details and try again</li>
                  <li>• Try a different payment method</li>
                  <li>• Contact your bank if the issue persists</li>
                  <li>• Reach out to our support team</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleContactSupport}
                variant="outline"
                className="flex-1"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Change Method
              </Button>
            </div>
          </div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-xs text-text-tertiary">
              If you continue to experience issues, please contact our support team at{' '}
              <a 
                href="mailto:support@familyquest.com" 
                className="text-mint-green hover:underline"
              >
                support@familyquest.com
              </a>
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}