import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Lock } from 'lucide-react';
import { useAddPaymentMethod } from '@/hooks/useProfile';

const paymentSchema = z.object({
  cardholder_name: z.string().min(2, 'Cardholder name must be at least 2 characters'),
  card_number: z.string().min(13, 'Please enter a valid card number').max(19, 'Card number too long'),
  expiry_month: z.number().min(1).max(12),
  expiry_year: z.number().min(new Date().getFullYear()),
  cvv: z.string().min(3, 'CVV must be at least 3 digits').max(4, 'CVV must be at most 4 digits'),
  is_default: z.boolean(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPaymentMethodModal({ isOpen, onClose }: AddPaymentMethodModalProps) {
  const [cardType, setCardType] = useState<string>('');
  const addPaymentMethod = useAddPaymentMethod();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardholder_name: '',
      card_number: '',
      expiry_month: new Date().getMonth() + 1,
      expiry_year: new Date().getFullYear(),
      cvv: '',
      is_default: false,
    },
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    if (cleanNumber.startsWith('6')) return 'discover';
    return 'other';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setValue('card_number', formatted);
    setCardType(detectCardType(formatted));
  };

  const onSubmit = async (data: PaymentFormData) => {
    try {
      await addPaymentMethod.mutateAsync({
        cardholder_name: data.cardholder_name,
        card_number: data.card_number.replace(/\s/g, ''),
        expiry_month: data.expiry_month,
        expiry_year: data.expiry_year,
        cvv: data.cvv,
        is_default: data.is_default,
      });
      reset();
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const cardTypeColors = {
    visa: 'bg-blue-500',
    mastercard: 'bg-red-500',
    amex: 'bg-green-500',
    discover: 'bg-orange-500',
    other: 'bg-gray-500',
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-mint-green" />
            <span>Add Payment Method</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Card Preview */}
          <div className="relative p-6 bg-gradient-to-r from-mint-green to-light-purple rounded-xl text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-sm opacity-80">Cardholder Name</p>
                <p className="font-semibold">
                  {watch('cardholder_name') || 'JOHN DOE'}
                </p>
              </div>
              {cardType && (
                <div className={`w-8 h-5 rounded ${cardTypeColors[cardType as keyof typeof cardTypeColors] || 'bg-gray-500'} flex items-center justify-center text-xs font-bold`}>
                  {cardType.toUpperCase().slice(0, 4)}
                </div>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm opacity-80">Card Number</p>
              <p className="font-mono text-lg">
                {watch('card_number') || '•••• •••• •••• ••••'}
              </p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="space-y-1">
                <p className="text-xs opacity-80">Expires</p>
                <p className="font-semibold">
                  {watch('expiry_month')?.toString().padStart(2, '0') || 'MM'}/{watch('expiry_year')?.toString().slice(-2) || 'YY'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs opacity-80">CVV</p>
                <p className="font-semibold">
                  {watch('cvv') || '•••'}
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardholder_name" className="text-sm font-medium text-text-primary">
                Cardholder Name
              </Label>
              <Input
                id="cardholder_name"
                {...register('cardholder_name')}
                className="hover:border-mint-green focus:border-mint-green"
                placeholder="John Doe"
              />
              {errors.cardholder_name && (
                <p className="text-sm text-red-500">{errors.cardholder_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="card_number" className="text-sm font-medium text-text-primary">
                Card Number
              </Label>
              <Input
                id="card_number"
                value={watch('card_number')}
                onChange={handleCardNumberChange}
                className="hover:border-mint-green focus:border-mint-green font-mono"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.card_number && (
                <p className="text-sm text-red-500">{errors.card_number.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry_month" className="text-sm font-medium text-text-primary">
                  Month
                </Label>
                <select
                  id="expiry_month"
                  {...register('expiry_month', { valueAsNumber: true })}
                  className="w-full p-2 border border-input rounded-md hover:border-mint-green focus:border-mint-green focus:outline-none"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                {errors.expiry_month && (
                  <p className="text-sm text-red-500">{errors.expiry_month.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_year" className="text-sm font-medium text-text-primary">
                  Year
                </Label>
                <select
                  id="expiry_year"
                  {...register('expiry_year', { valueAsNumber: true })}
                  className="w-full p-2 border border-input rounded-md hover:border-mint-green focus:border-mint-green focus:outline-none"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.expiry_year && (
                  <p className="text-sm text-red-500">{errors.expiry_year.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-sm font-medium text-text-primary">
                CVV
              </Label>
              <Input
                id="cvv"
                {...register('cvv')}
                className="hover:border-mint-green focus:border-mint-green font-mono"
                placeholder="123"
                maxLength={4}
                type="password"
              />
              {errors.cvv && (
                <p className="text-sm text-red-500">{errors.cvv.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-pale-lavender-bg rounded-xl">
              <div className="space-y-1">
                <span className="text-sm font-medium text-text-primary">Set as Default</span>
                <p className="text-xs text-text-secondary">Use this card for future payments</p>
              </div>
              <Switch
                checked={watch('is_default')}
                onCheckedChange={(checked) => setValue('is_default', checked)}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-2 p-3 bg-mint-tint rounded-lg">
            <Lock className="h-4 w-4 text-mint-green mt-0.5" />
            <p className="text-xs text-text-secondary">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200"
            >
              {isSubmitting ? 'Adding...' : 'Add Payment Method'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}