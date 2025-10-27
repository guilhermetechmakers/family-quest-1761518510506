import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { useCreatePaymentMethod } from '@/hooks/usePayments';

const paymentMethodSchema = z.object({
  cardholder_name: z.string().min(2, 'Cardholder name must be at least 2 characters'),
  card_number: z.string().min(13, 'Please enter a valid card number').max(19, 'Card number too long'),
  expiry_month: z.string().min(1, 'Please select expiry month'),
  expiry_year: z.string().min(1, 'Please select expiry year'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits').max(4, 'CVV must be at most 4 digits'),
  is_default: z.boolean().optional(),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface AddPaymentMethodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentMethodAdded: (method: any) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString().padStart(2, '0'),
  label: (i + 1).toString().padStart(2, '0')
}));

const YEARS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() + i;
  return { value: year.toString(), label: year.toString() };
});

export function AddPaymentMethodModal({ open, onOpenChange, onPaymentMethodAdded }: AddPaymentMethodModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPaymentMethod = useCreatePaymentMethod();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      is_default: false
    }
  });

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setValue('card_number', formatted);
  };

  const onSubmit = async (data: PaymentMethodFormData) => {
    setIsSubmitting(true);
    
    try {
      // Remove spaces from card number for processing
      const cardData = {
        ...data,
        card_number: data.card_number.replace(/\s/g, ''),
        expiry_month: parseInt(data.expiry_month),
        expiry_year: parseInt(data.expiry_year),
      };

      const newMethod = await createPaymentMethod.mutateAsync(cardData);
      onPaymentMethodAdded(newMethod);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating payment method:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-text-primary">
            <div className="p-2 bg-mint-green rounded-full">
              <CreditCard className="h-5 w-5 text-text-primary" />
            </div>
            Add Payment Method
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Add a new credit or debit card to your account for secure payments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardholder_name" className="text-text-primary font-medium">
              Cardholder Name
            </Label>
            <Input
              id="cardholder_name"
              placeholder="John Doe"
              {...register('cardholder_name')}
              className={errors.cardholder_name ? 'border-red-500' : ''}
            />
            {errors.cardholder_name && (
              <p className="text-sm text-red-500">{errors.cardholder_name.message}</p>
            )}
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="card_number" className="text-text-primary font-medium">
              Card Number
            </Label>
            <Input
              id="card_number"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              onChange={handleCardNumberChange}
              className={errors.card_number ? 'border-red-500' : ''}
            />
            {errors.card_number && (
              <p className="text-sm text-red-500">{errors.card_number.message}</p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry_month" className="text-text-primary font-medium">
                Month
              </Label>
              <Select onValueChange={(value) => setValue('expiry_month', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expiry_month && (
                <p className="text-sm text-red-500">{errors.expiry_month.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_year" className="text-text-primary font-medium">
                Year
              </Label>
              <Select onValueChange={(value) => setValue('expiry_year', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expiry_year && (
                <p className="text-sm text-red-500">{errors.expiry_year.message}</p>
              )}
            </div>
          </div>

          {/* CVV */}
          <div className="space-y-2">
            <Label htmlFor="cvv" className="text-text-primary font-medium">
              CVV
            </Label>
            <Input
              id="cvv"
              placeholder="123"
              type="password"
              maxLength={4}
              {...register('cvv')}
              className={errors.cvv ? 'border-red-500' : ''}
            />
            {errors.cvv && (
              <p className="text-sm text-red-500">{errors.cvv.message}</p>
            )}
          </div>

          {/* Set as Default */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={watch('is_default')}
              onCheckedChange={(checked) => setValue('is_default', checked as boolean)}
            />
            <Label htmlFor="is_default" className="text-sm text-text-secondary">
              Set as default payment method
            </Label>
          </div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-mint-tint rounded-xl p-3 border border-mint-green/20"
          >
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-mint-green mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-primary">Secure & Encrypted</p>
                <p className="text-xs text-text-secondary">
                  Your card details are encrypted and securely processed. We never store your full card information.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </div>
              ) : (
                'Add Payment Method'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}