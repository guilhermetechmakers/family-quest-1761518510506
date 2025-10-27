import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, DollarSign, FileText } from 'lucide-react';

interface PaymentSummaryProps {
  goalTitle: string;
  amount: number;
  currency: string;
  description?: string;
}

export function PaymentSummary({ goalTitle, amount, currency, description }: PaymentSummaryProps) {
  return (
    <Card className="bg-white border-0 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-text-primary">
          <div className="p-2 bg-pale-lavender rounded-full">
            <Target className="h-5 w-5 text-text-primary" />
          </div>
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Goal Information */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-text-primary mb-1">Goal</h3>
            <p className="text-text-secondary">{goalTitle}</p>
          </div>
          
          {description && (
            <div>
              <h4 className="font-medium text-text-primary mb-1 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </h4>
              <p className="text-text-secondary text-sm">{description}</p>
            </div>
          )}
        </div>

        {/* Amount Breakdown */}
        <div className="border-t border-border pt-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Contribution Amount</span>
              <span className="font-semibold text-text-primary">
                ${amount.toFixed(2)} {currency}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-tertiary">Processing Fee</span>
              <span className="text-text-tertiary">$0.00</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-tertiary">Tax</span>
              <span className="text-text-tertiary">$0.00</span>
            </div>
          </div>
          
          <div className="border-t border-border pt-2 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-text-primary">Total</span>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-mint-green" />
                <span className="text-xl font-bold text-text-primary">
                  ${amount.toFixed(2)} {currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-mint-tint rounded-xl p-3 border border-mint-green/20"
        >
          <div className="flex items-start gap-2">
            <div className="p-1 bg-mint-green rounded-full mt-0.5">
              <DollarSign className="h-3 w-3 text-text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Secure Payment</p>
              <p className="text-xs text-text-secondary">
                Your payment is processed securely and will be added to your family goal immediately.
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}