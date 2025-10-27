import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useCreateContribution } from '@/hooks/useContributions';
import { DollarSign, CheckCircle, Upload, CreditCard, Banknote, Smartphone, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

const contributionSchema = z.object({
  type: z.enum(['monetary', 'manual', 'chore']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  description: z.string().min(1, 'Description is required'),
  receipt_url: z.string().optional(),
  payment_method: z.string().optional(),
  card_number: z.string().optional(),
  expiry_date: z.string().optional(),
  cvv: z.string().optional(),
});

type ContributionForm = z.infer<typeof contributionSchema>;

interface ContributionFormProps {
  goalId: string;
  goalTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const contributionTypes = [
  { value: 'monetary', label: 'Monetary Contribution', icon: DollarSign, description: 'Add money to the goal', color: 'mint-green' },
  { value: 'manual', label: 'Manual Entry', icon: CheckCircle, description: 'Record a non-monetary contribution', color: 'pale-lavender' },
  { value: 'chore', label: 'Chore Completion', icon: CheckCircle, description: 'Complete a chore for points', color: 'light-pink' },
];

const paymentMethods = [
  { value: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, American Express' },
  { value: 'bank', label: 'Bank Transfer', icon: Banknote, description: 'Direct bank transfer' },
  { value: 'mobile', label: 'Mobile Payment', icon: Smartphone, description: 'Apple Pay, Google Pay' },
];

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
];

export function ContributionForm({ goalId, goalTitle, onSuccess, onCancel }: ContributionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing' | 'complete'>('method');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const createContribution = useCreateContribution();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContributionForm>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      type: 'monetary',
      currency: 'USD',
      payment_method: 'card',
    },
  });

  const watchedType = watch('type');
  const watchedPaymentMethod = watch('payment_method');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // In a real app, you would upload the file to a server and get a URL
      setValue('receipt_url', URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ContributionForm) => {
    setIsSubmitting(true);
    setPaymentStep('processing');
    
    try {
      // Simulate payment processing for monetary contributions
      if (data.type === 'monetary') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      await createContribution.mutateAsync({
        goal_id: goalId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        receipt_url: data.receipt_url,
      });
      
      setPaymentStep('complete');
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      console.error('Error creating contribution:', error);
      setPaymentStep('details');
      toast.error('Failed to process contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    switch (paymentStep) {
      case 'method': return 25;
      case 'details': return 50;
      case 'processing': return 75;
      case 'complete': return 100;
      default: return 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white shadow-card border-0">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Contribute to "{goalTitle}"
          </h2>
          <p className="text-text-secondary text-sm">
            Add your contribution to help reach this family goal.
          </p>
        </div>

        {/* Progress Bar */}
        {watchedType === 'monetary' && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-text-secondary mb-2">
              <span>Step {paymentStep === 'method' ? 1 : paymentStep === 'details' ? 2 : paymentStep === 'processing' ? 3 : 4} of 4</span>
              <span>{getProgressPercentage()}% Complete</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Contribution Type */}
          <div>
            <Label className="text-sm font-medium text-text-secondary">Contribution Type</Label>
            <Tabs value={watchedType} onValueChange={(value) => setValue('type', value as any)} className="mt-2">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                {contributionTypes.map((type) => (
                  <TabsTrigger 
                    key={type.value} 
                    value={type.value} 
                    className={`flex flex-col items-center p-4 data-[state=active]:bg-${type.color} data-[state=active]:text-text-primary`}
                  >
                    <type.icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {contributionTypes.map((type) => (
                <TabsContent key={type.value} value={type.value} className="mt-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 bg-mint-tint rounded-2xl"
                  >
                    <type.icon className="h-8 w-8 text-mint-green mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">{type.description}</p>
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
            {errors.type && (
              <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-text-secondary">
                {watchedType === 'monetary' ? 'Amount' : 'Value/Points'}
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder={watchedType === 'monetary' ? '0.00' : '0'}
                className="mt-1"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            {watchedType === 'monetary' && (
              <div>
                <Label htmlFor="currency" className="text-sm font-medium text-text-secondary">Currency</Label>
                <Select onValueChange={(value) => setValue('currency', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-red-500 mt-1">{errors.currency.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-text-secondary">Description</Label>
            <Textarea
              id="description"
              placeholder={
                watchedType === 'monetary' 
                  ? 'e.g., Weekly allowance contribution'
                  : watchedType === 'chore'
                  ? 'e.g., Cleaned the garage'
                  : 'e.g., Helped organize the house'
              }
              rows={3}
              className="mt-1"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Payment Method Selection (for monetary contributions) */}
          {watchedType === 'monetary' && paymentStep === 'method' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Label className="text-sm font-medium text-text-secondary">Payment Method</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <motion.label
                    key={method.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                      watchedPaymentMethod === method.value
                        ? 'border-mint-green bg-mint-tint'
                        : 'border-gray-200 bg-white hover:border-mint-green hover:bg-mint-tint/30'
                    }`}
                  >
                    <input
                      type="radio"
                      value={method.value}
                      {...register('payment_method')}
                      className="sr-only"
                    />
                    <method.icon className="h-8 w-8 text-mint-green mb-2" />
                    <span className="font-medium text-text-primary text-sm mb-1">{method.label}</span>
                    <span className="text-xs text-text-secondary text-center">{method.description}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Payment Details (for monetary contributions) */}
          {watchedType === 'monetary' && paymentStep === 'details' && watchedPaymentMethod === 'card' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-mint-green" />
                <span className="text-sm font-medium text-text-secondary">Secure Payment Details</span>
                <Lock className="h-4 w-4 text-text-tertiary" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="card_number" className="text-sm font-medium text-text-secondary">Card Number</Label>
                  <Input
                    id="card_number"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                    {...register('card_number')}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_date" className="text-sm font-medium text-text-secondary">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    placeholder="MM/YY"
                    className="mt-1"
                    {...register('expiry_date')}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-sm font-medium text-text-secondary">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    className="mt-1"
                    {...register('cvv')}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Receipt Upload (for monetary contributions) */}
          {watchedType === 'monetary' && (
            <div>
              <Label htmlFor="receipt" className="text-sm font-medium text-text-secondary">Receipt (Optional)</Label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-text-tertiary" />
                    <p className="mb-2 text-sm text-text-secondary">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-text-tertiary">PNG, JPG or PDF (MAX. 10MB)</p>
                  </div>
                  <input 
                    id="receipt" 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                  />
                </label>
                {uploadedFile && (
                  <p className="text-sm text-mint-green mt-2">
                    ✓ {uploadedFile.name} uploaded successfully
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Processing State */}
          {paymentStep === 'processing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-green mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Processing Payment</h3>
              <p className="text-text-secondary">Please wait while we process your contribution...</p>
            </motion.div>
          )}

          {/* Success State */}
          {paymentStep === 'complete' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Contribution Successful!</h3>
              <p className="text-text-secondary">Your contribution has been processed and added to the goal.</p>
            </motion.div>
          )}

          {/* Action Buttons */}
          {paymentStep !== 'complete' && (
            <div className="flex justify-end space-x-4 pt-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              
              {watchedType === 'monetary' && paymentStep === 'method' && (
                <Button 
                  type="button" 
                  onClick={() => setPaymentStep('details')}
                  className="bg-mint-green hover:bg-light-mint text-text-primary"
                >
                  Continue to Payment Details
                </Button>
              )}
              
              {watchedType === 'monetary' && paymentStep === 'details' && (
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-mint-green hover:bg-light-mint text-text-primary"
                >
                  Process Payment
                </Button>
              )}
              
              {watchedType !== 'monetary' && (
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-mint-green hover:bg-light-mint text-text-primary"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
                </Button>
              )}
            </div>
          )}
        </form>
      </Card>
    </motion.div>
  );
}