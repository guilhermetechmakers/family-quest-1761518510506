import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  CreditCard as CardIcon,
  Smartphone
} from 'lucide-react';
import { useBillingInfo, useUpdatePaymentMethod, useCancelSubscription } from '@/hooks/useSettings';

const mockBillingHistory = [
  {
    id: '1',
    date: '2024-01-15',
    description: 'Family Plan - Monthly',
    amount: 9.99,
    status: 'paid',
    invoice: 'INV-001'
  },
  {
    id: '2',
    date: '2023-12-15',
    description: 'Family Plan - Monthly',
    amount: 9.99,
    status: 'paid',
    invoice: 'INV-002'
  },
  {
    id: '3',
    date: '2023-11-15',
    description: 'Family Plan - Monthly',
    amount: 9.99,
    status: 'paid',
    invoice: 'INV-003'
  }
];

const mockPaymentMethods = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: '12',
    expiryYear: '2025',
    isDefault: true
  },
  {
    id: '2',
    type: 'card',
    last4: '5555',
    brand: 'Mastercard',
    expiryMonth: '08',
    expiryYear: '2026',
    isDefault: false
  }
];

export function PaymentSettings() {
  const [showAddPayment, setShowAddPayment] = useState(false);

  const { isLoading } = useBillingInfo();
  const updatePaymentMethod = useUpdatePaymentMethod();
  const cancelSubscription = useCancelSubscription();

  const handleSetDefaultPayment = (paymentMethodId: string) => {
    updatePaymentMethod.mutate(paymentMethodId);
  };

  const handleCancelSubscription = () => {
    cancelSubscription.mutate();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-mint-tint rounded-lg mb-4"></div>
          <div className="h-32 bg-mint-tint rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mint-green rounded-lg">
                <CreditCard className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-mint-tint rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-mint-green rounded-lg">
                    <DollarSign className="h-5 w-5 text-text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Family Plan</h3>
                    <p className="text-text-secondary">$9.99/month • Billed monthly</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-mint-green text-text-primary">Active</Badge>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Cancel Plan
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          Cancel Subscription
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel your Family Plan subscription? 
                          You'll lose access to premium features and your data will be archived.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelSubscription}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Cancel Subscription
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-pale-lavender rounded-xl text-center">
                  <h4 className="font-semibold text-text-primary">Unlimited Goals</h4>
                  <p className="text-sm text-text-secondary">Create as many goals as you want</p>
                </div>
                <div className="p-4 bg-light-pink rounded-xl text-center">
                  <h4 className="font-semibold text-text-primary">Family Sharing</h4>
                  <p className="text-sm text-text-secondary">Share goals with extended family</p>
                </div>
                <div className="p-4 bg-pastel-yellow rounded-xl text-center">
                  <h4 className="font-semibold text-text-primary">Priority Support</h4>
                  <p className="text-sm text-text-secondary">Get help when you need it</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pale-lavender rounded-lg">
                  <CardIcon className="h-5 w-5 text-text-primary" />
                </div>
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods and billing
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={() => setShowAddPayment(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPaymentMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-mint-tint rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <CardIcon className="h-5 w-5 text-text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">
                          {method.brand} •••• {method.last4}
                        </span>
                        {method.isDefault && (
                          <Badge className="bg-mint-green text-text-primary text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSetDefaultPayment(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-light-pink rounded-lg">
                  <Calendar className="h-5 w-5 text-text-primary" />
                </div>
                <div>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    View and download your billing statements
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" className="btn-outline">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockBillingHistory.map((invoice, index) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-mint-tint rounded-xl hover:bg-mint-green/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-mint-green rounded-lg">
                      <CheckCircle className="h-5 w-5 text-text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">
                          {invoice.description}
                        </span>
                        <Badge className="bg-mint-green text-text-primary text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {new Date(invoice.date).toLocaleDateString()} • {invoice.invoice}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-text-primary">
                      ${invoice.amount}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Payment Method Dialog */}
      <AlertDialog open={showAddPayment} onOpenChange={setShowAddPayment}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Add Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new payment method to your account for seamless contributions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-mint-tint rounded-xl text-center">
              <Smartphone className="h-8 w-8 text-mint-green mx-auto mb-2" />
              <p className="text-sm text-text-secondary">
                Payment method integration coming soon. For now, you can manage payments through your family dashboard.
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowAddPayment(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}