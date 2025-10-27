import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Minus, AlertCircle, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateProgressAdjustment } from '@/hooks/useProgress';

const adjustmentSchema = z.object({
  adjustment_type: z.enum(['manual_add', 'manual_subtract', 'refund', 'correction']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  reason: z.string().min(1, 'Reason is required'),
  description: z.string().optional(),
});

type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

interface ProgressAdjustmentModalProps {
  goalId: string;
  goalTitle: string;
  currentValue: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ProgressAdjustmentModal({
  goalId,
  goalTitle,
  currentValue,
  isOpen,
  onClose
}: ProgressAdjustmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createAdjustment = useCreateProgressAdjustment();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      adjustment_type: 'manual_add',
      amount: 0,
      reason: '',
      description: ''
    }
  });

  const adjustmentType = watch('adjustment_type');

  const onSubmit = async (data: AdjustmentFormData) => {
    setIsSubmitting(true);
    try {
      await createAdjustment.mutateAsync({
        goal_id: goalId,
        ...data
      });
      reset();
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Adjust Progress</h2>
            <p className="text-sm text-text-secondary">{goalTitle}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Current value display */}
        <div className="bg-mint-tint rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-mint-green" />
            <span className="text-sm text-text-secondary">Current Value:</span>
            <span className="font-semibold text-text-primary">
              ${currentValue.toLocaleString()}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Adjustment type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Adjustment Type
            </label>
            <Select
              value={adjustmentType}
              onValueChange={(value) => setValue('adjustment_type', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual_add">
                  <div className="flex items-center space-x-2">
                    <Plus className="h-4 w-4 text-mint-green" />
                    <span>Add Amount</span>
                  </div>
                </SelectItem>
                <SelectItem value="manual_subtract">
                  <div className="flex items-center space-x-2">
                    <Minus className="h-4 w-4 text-light-pink" />
                    <span>Subtract Amount</span>
                  </div>
                </SelectItem>
                <SelectItem value="refund">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-pastel-yellow" />
                    <span>Refund</span>
                  </div>
                </SelectItem>
                <SelectItem value="correction">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-pale-lavender" />
                    <span>Correction</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Amount
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Reason <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., Manual contribution, Refund processing..."
              {...register('reason')}
              className={errors.reason ? 'border-red-500' : ''}
            />
            {errors.reason && (
              <p className="text-sm text-red-500">{errors.reason.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Description (Optional)
            </label>
            <Textarea
              placeholder="Additional details about this adjustment..."
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Preview */}
          {watch('amount') > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-text-primary mb-2">Preview</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Current:</span>
                  <span>${currentValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    {adjustmentType === 'manual_add' ? 'Adding:' :
                     adjustmentType === 'manual_subtract' ? 'Subtracting:' :
                     adjustmentType === 'refund' ? 'Refunding:' : 'Correcting:'}
                  </span>
                  <span className={adjustmentType === 'manual_add' ? 'text-mint-green' : 'text-light-pink'}>
                    {adjustmentType === 'manual_add' ? '+' : '-'}${watch('amount').toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-1 flex justify-between font-medium">
                  <span className="text-text-primary">New Total:</span>
                  <span className="text-text-primary">
                    ${(currentValue + (adjustmentType === 'manual_add' ? watch('amount') : -watch('amount'))).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-mint-green hover:bg-light-mint text-text-primary"
            >
              {isSubmitting ? 'Processing...' : 'Apply Adjustment'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}