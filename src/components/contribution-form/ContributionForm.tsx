import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateContribution } from '@/hooks/useContributions';
import { DollarSign, CheckCircle, Upload, CreditCard } from 'lucide-react';

const contributionSchema = z.object({
  type: z.enum(['monetary', 'manual', 'chore']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  description: z.string().min(1, 'Description is required'),
  receipt_url: z.string().optional(),
});

type ContributionForm = z.infer<typeof contributionSchema>;

interface ContributionFormProps {
  goalId: string;
  goalTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const contributionTypes = [
  { value: 'monetary', label: 'Monetary Contribution', icon: DollarSign, description: 'Add money to the goal' },
  { value: 'manual', label: 'Manual Entry', icon: CheckCircle, description: 'Record a non-monetary contribution' },
  { value: 'chore', label: 'Chore Completion', icon: CheckCircle, description: 'Complete a chore for points' },
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
    },
  });

  const watchedType = watch('type');

  const onSubmit = async (data: ContributionForm) => {
    setIsSubmitting(true);
    try {
      await createContribution.mutateAsync({
        goal_id: goalId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        receipt_url: data.receipt_url,
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating contribution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Contribute to "{goalTitle}"
        </h2>
        <p className="text-text-secondary text-sm">
          Add your contribution to help reach this family goal.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Contribution Type */}
        <div>
          <Label>Contribution Type</Label>
          <Tabs value={watchedType} onValueChange={(value) => setValue('type', value as any)} className="mt-2">
            <TabsList className="grid w-full grid-cols-3">
              {contributionTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value} className="flex flex-col items-center p-4">
                  <type.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{type.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {contributionTypes.map((type) => (
              <TabsContent key={type.value} value={type.value} className="mt-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <type.icon className="h-8 w-8 text-mint-green mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">{type.description}</p>
                </div>
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
            <Label htmlFor="amount">
              {watchedType === 'monetary' ? 'Amount' : 'Value/Points'}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder={watchedType === 'monetary' ? '0.00' : '0'}
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
            )}
          </div>

          {watchedType === 'monetary' && (
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select onValueChange={(value) => setValue('currency', value)}>
                <SelectTrigger>
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
          <Label htmlFor="description">Description</Label>
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
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Receipt Upload (for monetary contributions) */}
        {watchedType === 'monetary' && (
          <div>
            <Label htmlFor="receipt">Receipt (Optional)</Label>
            <div className="mt-2">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or PDF (MAX. 10MB)</p>
                </div>
                <input id="receipt" type="file" className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* Payment Method (for monetary contributions) */}
        {watchedType === 'monetary' && (
          <div>
            <Label>Payment Method</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="card" defaultChecked className="text-mint-green" />
                <CreditCard className="h-5 w-5 text-text-tertiary" />
                <span className="text-sm">Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value="bank" className="text-mint-green" />
                <div className="h-5 w-5 bg-mint-green rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-text-primary">$</span>
                </div>
                <span className="text-sm">Bank Transfer</span>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
          </Button>
        </div>
      </form>
    </Card>
  );
}