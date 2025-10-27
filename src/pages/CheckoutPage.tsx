import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { PaymentSummary } from '@/components/checkout/PaymentSummary';
import { PaymentMethodsSection } from '@/components/checkout/PaymentMethodsSection';
import { BillingInformationForm } from '@/components/checkout/BillingInformationForm';
import { AddPaymentMethodModal } from '@/components/checkout/AddPaymentMethodModal';
import { PaymentSuccessModal } from '@/components/checkout/PaymentSuccessModal';
import { PaymentFailureModal } from '@/components/checkout/PaymentFailureModal';
import { usePaymentMethods, useCreatePaymentIntent, useConfirmPayment } from '@/hooks/usePayments';
import { toast } from 'sonner';

interface CheckoutData {
  goalId: string;
  goalTitle: string;
  amount: number;
  currency: string;
  description?: string;
}

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [billingInfo, setBillingInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);

  // Hooks
  const { data: paymentMethods, isLoading: loadingMethods } = usePaymentMethods();
  const createPaymentIntent = useCreatePaymentIntent();
  const confirmPayment = useConfirmPayment();

  // Initialize checkout data from URL params
  useEffect(() => {
    const goalId = searchParams.get('goalId');
    const goalTitle = searchParams.get('goalTitle');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency') || 'USD';
    const description = searchParams.get('description');

    if (goalId && goalTitle && amount) {
      setCheckoutData({
        goalId,
        goalTitle,
        amount: parseFloat(amount),
        currency,
        description: description || undefined
      });
    } else {
      // Redirect to dashboard if required params are missing
      navigate('/dashboard');
    }
  }, [searchParams, navigate]);

  // Set default payment method
  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0 && !selectedPaymentMethod) {
      const defaultMethod = paymentMethods.find(method => method.is_default);
      setSelectedPaymentMethod(defaultMethod?.id || paymentMethods[0].id);
    }
  }, [paymentMethods, selectedPaymentMethod]);

  const handlePaymentSubmit = async () => {
    if (!checkoutData || !selectedPaymentMethod || !billingInfo.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const intent = await createPaymentIntent.mutateAsync({
        amount: Math.round(checkoutData.amount * 100), // Convert to cents
        currency: checkoutData.currency,
        goal_id: checkoutData.goalId,
        description: checkoutData.description
      });

      setPaymentIntent(intent);

      // Confirm payment
      const result = await confirmPayment.mutateAsync({
        payment_intent_id: intent.id,
        payment_method_id: selectedPaymentMethod
      });

      if (result.status === 'succeeded') {
        setShowSuccessModal(true);
      } else if (result.status === 'requires_action') {
        // Handle 3D Secure authentication
        toast.info('Additional verification required. Please complete the authentication process.');
        // In a real app, you would redirect to Stripe's hosted authentication page
      } else {
        setShowFailureModal(true);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setShowFailureModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate(`/goals/${checkoutData?.goalId}`);
  };

  const handleFailureClose = () => {
    setShowFailureModal(false);
  };

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 p-0 h-auto text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-mint-green rounded-full">
              <CreditCard className="h-5 w-5 text-text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-text-primary">Complete Payment</h1>
          </div>
          <p className="text-text-secondary">
            Secure payment for your family goal contribution
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <PaymentSummary
                goalTitle={checkoutData.goalTitle}
                amount={checkoutData.amount}
                currency={checkoutData.currency}
                description={checkoutData.description}
              />
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <PaymentMethodsSection
                paymentMethods={paymentMethods || []}
                selectedMethod={selectedPaymentMethod}
                onSelectMethod={setSelectedPaymentMethod}
                onAddNewMethod={() => setShowAddPaymentModal(true)}
                loading={loadingMethods}
              />
            </motion.div>

            {/* Billing Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <BillingInformationForm
                billingInfo={billingInfo}
                onUpdateBillingInfo={setBillingInfo}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-8"
            >
              <Card className="bg-mint-tint border-mint-green/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-text-primary">
                    <Shield className="h-5 w-5" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Amount</span>
                      <span className="font-semibold text-text-primary">
                        ${checkoutData.amount.toFixed(2)} {checkoutData.currency}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Processing Fee</span>
                      <span className="text-text-secondary">$0.00</span>
                    </div>
                    <div className="border-t border-border pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-text-primary">Total</span>
                        <span className="text-text-primary">
                          ${checkoutData.amount.toFixed(2)} {checkoutData.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <CheckCircle className="h-4 w-4 text-mint-green" />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <CheckCircle className="h-4 w-4 text-mint-green" />
                      <span>PCI DSS compliant</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <CheckCircle className="h-4 w-4 text-mint-green" />
                      <span>No card data stored</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={!selectedPaymentMethod || !billingInfo.email || isProcessing}
                    className="w-full h-12 text-base font-semibold"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      `Pay $${checkoutData.amount.toFixed(2)}`
                    )}
                  </Button>

                  <p className="text-xs text-text-tertiary text-center">
                    By completing this payment, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPaymentMethodModal
        open={showAddPaymentModal}
        onOpenChange={setShowAddPaymentModal}
        onPaymentMethodAdded={(method) => {
          setSelectedPaymentMethod(method.id);
          setShowAddPaymentModal(false);
        }}
      />

      <PaymentSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        onClose={handleSuccessClose}
        paymentIntent={paymentIntent}
        amount={checkoutData.amount}
        currency={checkoutData.currency}
      />

      <PaymentFailureModal
        open={showFailureModal}
        onOpenChange={setShowFailureModal}
        onClose={handleFailureClose}
        onRetry={handlePaymentSubmit}
      />
    </div>
  );
}