import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Plus, CheckCircle, Loader2 } from 'lucide-react';
import type { PaymentMethod } from '@/api/payments';

interface PaymentMethodsSectionProps {
  paymentMethods: PaymentMethod[];
  selectedMethod: string | null;
  onSelectMethod: (methodId: string) => void;
  onAddNewMethod: () => void;
  loading: boolean;
}

export function PaymentMethodsSection({
  paymentMethods,
  selectedMethod,
  onSelectMethod,
  onAddNewMethod,
  loading
}: PaymentMethodsSectionProps) {
  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      default:
        return '💳';
    }
  };

  const formatExpiryDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  if (loading) {
    return (
      <Card className="bg-white border-0 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-text-primary">
            <div className="p-2 bg-pale-lavender rounded-full">
              <CreditCard className="h-5 w-5 text-text-primary" />
            </div>
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-mint-green" />
            <span className="ml-2 text-text-secondary">Loading payment methods...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-0 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-text-primary">
          <div className="p-2 bg-pale-lavender rounded-full">
            <CreditCard className="h-5 w-5 text-text-primary" />
          </div>
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.length > 0 ? (
          <RadioGroup
            value={selectedMethod || ''}
            onValueChange={onSelectMethod}
            className="space-y-3"
          >
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Label
                  htmlFor={method.id}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedMethod === method.id
                      ? 'border-mint-green bg-mint-tint'
                      : 'border-border hover:border-mint-green/50'
                  }`}
                >
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="mr-3"
                  />
                  
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getCardIcon(method.brand)}
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">
                          {method.cardholder_name}
                        </div>
                        <div className="text-sm text-text-secondary">
                          •••• •••• •••• {method.last_four_digits}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          Expires {formatExpiryDate(method.expiry_month, method.expiry_year)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {method.is_default && (
                        <span className="px-2 py-1 bg-mint-green text-text-primary text-xs font-medium rounded-full">
                          Default
                        </span>
                      )}
                      {selectedMethod === method.id && (
                        <CheckCircle className="h-5 w-5 text-mint-green" />
                      )}
                    </div>
                  </div>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="p-4 bg-mint-tint rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-mint-green" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">No Payment Methods</h3>
            <p className="text-text-secondary text-sm mb-4">
              You don't have any saved payment methods. Add one to get started.
            </p>
          </motion.div>
        )}

        {/* Add New Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={onAddNewMethod}
            className="w-full h-12 border-2 border-dashed border-mint-green text-mint-green hover:bg-mint-green hover:text-text-primary transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            {paymentMethods.length > 0 ? 'Add New Payment Method' : 'Add Payment Method'}
          </Button>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-pale-lavender/30 rounded-xl p-3 border border-pale-lavender/50"
        >
          <div className="flex items-start gap-2">
            <div className="p-1 bg-pale-lavender rounded-full mt-0.5">
              <CreditCard className="h-3 w-3 text-text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Secure & Encrypted</p>
              <p className="text-xs text-text-secondary">
                Your payment information is encrypted and securely processed. We never store your full card details.
              </p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}