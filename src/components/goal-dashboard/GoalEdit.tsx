import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGoal, useUpdateGoal } from '@/hooks/useGoals';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Target, 
  DollarSign, 
  Gift, 
  Image as ImageIcon,
  Check
} from 'lucide-react';
import type { GoalType, GoalStatus } from '@/types/goal';

const goalEditSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  type: z.enum(['vacation', 'purchase', 'home_upgrade', 'pet', 'education', 'other']),
  target_value: z.number().min(1, 'Target value must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']),
  image_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  milestones: z.array(z.object({
    id: z.string().optional(),
    goal_id: z.string().optional(),
    title: z.string().min(1, 'Milestone title is required'),
    target_value: z.number().min(0, 'Target value must be positive'),
    reward: z.string().optional(),
    order: z.number(),
  })).optional(),
});

type GoalEditForm = z.infer<typeof goalEditSchema>;

interface GoalEditProps {
  goalId: string;
  onBack: () => void;
  onSave: () => void;
}

export function GoalEdit({ goalId, onBack, onSave }: GoalEditProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { data: goal, isLoading, error } = useGoal(goalId);
  const updateGoal = useUpdateGoal();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<GoalEditForm>({
    resolver: zodResolver(goalEditSchema),
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Load goal data into form
  useEffect(() => {
    if (goal) {
      setValue('title', goal.title);
      setValue('description', goal.description);
      setValue('type', goal.type);
      setValue('target_value', goal.target_value);
      setValue('currency', goal.currency);
      setValue('status', goal.status);
      setValue('image_url', goal.image_url || '');
      setValue('milestones', goal.milestones || []);
    }
  }, [goal, setValue]);

  const steps = [
    { number: 1, title: 'Basic Info', icon: Target, description: 'Update goal details' },
    { number: 2, title: 'Target & Status', icon: DollarSign, description: 'Adjust target and status' },
    { number: 3, title: 'Milestones', icon: Gift, description: 'Manage milestones' },
    { number: 4, title: 'Review', icon: Check, description: 'Review and save changes' },
  ];

  const goalTypes: { value: GoalType; label: string; icon: string }[] = [
    { value: 'vacation', label: 'Vacation', icon: '🏖️' },
    { value: 'purchase', label: 'Purchase', icon: '🛍️' },
    { value: 'home_upgrade', label: 'Home Upgrade', icon: '🏠' },
    { value: 'pet', label: 'Pet', icon: '🐕' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'other', label: 'Other', icon: '🎯' },
  ];

  const statusOptions: { value: GoalStatus; label: string; color: string }[] = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-200' },
    { value: 'active', label: 'Active', color: 'bg-mint-green' },
    { value: 'paused', label: 'Paused', color: 'bg-pastel-yellow' },
    { value: 'completed', label: 'Completed', color: 'bg-light-mint' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-light-pink' },
  ];

  const currencies = [
    { value: 'USD', label: 'US Dollar', symbol: '$' },
    { value: 'EUR', label: 'Euro', symbol: '€' },
    { value: 'GBP', label: 'British Pound', symbol: '£' },
    { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
    { value: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
    { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  ];

  const onSubmit = async (data: GoalEditForm) => {
    try {
      await updateGoal.mutateAsync({
        id: goalId,
        updates: {
          id: goalId,
          title: data.title,
          description: data.description,
          type: data.type,
          target_value: data.target_value,
          currency: data.currency,
          status: data.status,
          image_url: data.image_url,
          milestones: data.milestones?.map((milestone, index) => ({
            ...milestone,
            id: milestone.id || `temp-${Date.now()}-${index}`,
            goal_id: goalId,
          })),
        },
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return watchedValues.title && watchedValues.description && watchedValues.type;
      case 2:
        return watchedValues.target_value && watchedValues.currency && watchedValues.status;
      case 3:
        return true; // Milestones are optional
      case 4:
        return isValid;
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-mint-green border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading goal...</p>
        </Card>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-light-pink rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Goal Not Found</h2>
          <p className="text-text-secondary mb-4">
            The goal you're trying to edit doesn't exist or has been removed.
          </p>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Goals
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-text-secondary hover:text-text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Goal
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="h-10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isDirty || updateGoal.isPending}
                  className="h-10 bg-mint-green hover:bg-light-mint text-text-primary"
                >
                  {updateGoal.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-text-primary border-t-transparent mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Edit Goal</h1>
              <p className="text-text-secondary text-lg">
                Update your family goal details and settings
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-text-primary">
                  Step {currentStep} of {steps.length}
                </span>
                <span className="text-sm text-text-secondary">
                  {Math.round(calculateProgress())}% Complete
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="p-8 bg-white shadow-card">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold text-text-primary mb-2">Basic Information</h2>
                      <p className="text-text-secondary">Update your goal's basic details</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="title" className="text-base font-medium text-text-primary">
                          Goal Title *
                        </Label>
                        <Input
                          id="title"
                          placeholder="e.g., Family Vacation to Hawaii"
                          className="mt-2 h-12 text-lg"
                          {...register('title')}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-500 mt-2">{errors.title.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="description" className="text-base font-medium text-text-primary">
                          Description *
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your goal and why it's important to your family..."
                          rows={4}
                          className="mt-2 text-base"
                          {...register('description')}
                        />
                        {errors.description && (
                          <p className="text-sm text-red-500 mt-2">{errors.description.message}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-base font-medium text-text-primary">Goal Type *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {goalTypes.map((type) => (
                            <motion.div
                              key={type.value}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <label
                                className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                  watchedValues.type === type.value
                                    ? 'border-mint-green bg-mint-tint'
                                    : 'border-pale-lavender hover:border-light-purple'
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={type.value}
                                  {...register('type')}
                                  className="sr-only"
                                />
                                <div className="flex items-center space-x-3">
                                  <span className="text-2xl">{type.icon}</span>
                                  <div>
                                    <div className="font-medium text-text-primary">{type.label}</div>
                                  </div>
                                </div>
                              </label>
                            </motion.div>
                          ))}
                        </div>
                        {errors.type && (
                          <p className="text-sm text-red-500 mt-2">{errors.type.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="image_url" className="text-base font-medium text-text-primary">
                          Image URL (Optional)
                        </Label>
                        <div className="mt-2 relative">
                          <Input
                            id="image_url"
                            placeholder="https://example.com/image.jpg"
                            className="h-12 text-base pr-12"
                            {...register('image_url')}
                          />
                          <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                        </div>
                        {errors.image_url && (
                          <p className="text-sm text-red-500 mt-2">{errors.image_url.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Target & Status */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-pale-lavender rounded-full flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="h-8 w-8 text-text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold text-text-primary mb-2">Target & Status</h2>
                      <p className="text-text-secondary">Update your target amount and goal status</p>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="target_value" className="text-base font-medium text-text-primary">
                            Target Amount *
                          </Label>
                          <div className="mt-2 relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                              {currencies.find(c => c.value === watchedValues.currency)?.symbol || '$'}
                            </span>
                            <Input
                              id="target_value"
                              type="number"
                              placeholder="5000"
                              className="h-12 text-lg pl-8"
                              {...register('target_value', { valueAsNumber: true })}
                            />
                          </div>
                          {errors.target_value && (
                            <p className="text-sm text-red-500 mt-2">{errors.target_value.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="currency" className="text-base font-medium text-text-primary">
                            Currency *
                          </Label>
                          <Select onValueChange={(value) => setValue('currency', value)}>
                            <SelectTrigger className="mt-2 h-12 text-lg">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem key={currency.value} value={currency.value}>
                                  <span className="flex items-center">
                                    <span className="mr-2">{currency.symbol}</span>
                                    {currency.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.currency && (
                            <p className="text-sm text-red-500 mt-2">{errors.currency.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-base font-medium text-text-primary">Goal Status *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {statusOptions.map((status) => (
                            <motion.div
                              key={status.value}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <label
                                className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                  watchedValues.status === status.value
                                    ? 'border-mint-green bg-mint-tint'
                                    : 'border-pale-lavender hover:border-light-purple'
                                }`}
                              >
                                <input
                                  type="radio"
                                  value={status.value}
                                  {...register('status')}
                                  className="sr-only"
                                />
                                <div className="flex items-center space-x-3">
                                  <div className={`w-4 h-4 rounded-full ${status.color}`} />
                                  <div className="font-medium text-text-primary">{status.label}</div>
                                </div>
                              </label>
                            </motion.div>
                          ))}
                        </div>
                        {errors.status && (
                          <p className="text-sm text-red-500 mt-2">{errors.status.message}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Milestones */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-light-pink rounded-full flex items-center justify-center mx-auto mb-4">
                        <Gift className="h-8 w-8 text-text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold text-text-primary mb-2">Milestones</h2>
                      <p className="text-text-secondary">Manage your goal milestones</p>
                    </div>

                    <div className="space-y-6">
                      {watchedValues.milestones && watchedValues.milestones.length > 0 ? (
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary mb-4">Current Milestones</h3>
                          <div className="space-y-4">
                            {watchedValues.milestones.map((milestone, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Card className="p-4 bg-pale-lavender-bg border-pale-lavender">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium text-text-primary">{milestone.title}</h4>
                                      <p className="text-sm text-text-secondary">
                                        {currencies.find(c => c.value === watchedValues.currency)?.symbol}
                                        {milestone.target_value?.toLocaleString()}
                                      </p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const currentMilestones = watchedValues.milestones || [];
                                        setValue('milestones', currentMilestones.filter((_, i) => i !== index));
                                      }}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Gift className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                          <p className="text-text-secondary">No milestones yet</p>
                          <p className="text-sm text-text-tertiary">Milestones will be managed in the full version</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-light-purple rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold text-text-primary mb-2">Review Changes</h2>
                      <p className="text-text-secondary">Review your changes before saving</p>
                    </div>

                    <Card className="p-8 bg-white shadow-card">
                      <h3 className="text-xl font-semibold text-text-primary mb-6">Goal Summary</h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-medium text-text-primary mb-2">{watchedValues.title}</h4>
                          <p className="text-text-secondary">{watchedValues.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-text-secondary mb-1">Type</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {goalTypes.find(t => t.value === watchedValues.type)?.icon}
                              </span>
                              <span className="font-medium text-text-primary">
                                {goalTypes.find(t => t.value === watchedValues.type)?.label}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary mb-1">Status</p>
                            <Badge className={`${statusOptions.find(s => s.value === watchedValues.status)?.color} text-xs`}>
                              {statusOptions.find(s => s.value === watchedValues.status)?.label}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary mb-1">Target</p>
                            <p className="text-lg font-semibold text-text-primary">
                              {currencies.find(c => c.value === watchedValues.currency)?.symbol}
                              {watchedValues.target_value?.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-text-secondary mb-1">Currency</p>
                            <p className="font-medium text-text-primary">{watchedValues.currency}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <motion.div 
                className="flex justify-between mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="px-6 py-3 bg-mint-green hover:bg-light-mint text-text-primary"
                  >
                    Next
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={!isValid || updateGoal.isPending}
                    className="px-8 py-3 bg-mint-green hover:bg-light-mint text-text-primary"
                  >
                    {updateGoal.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-text-primary border-t-transparent mr-2" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                )}
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-text-primary">
              🎉 Goal Updated Successfully!
            </DialogTitle>
            <DialogDescription className="text-center text-text-secondary">
              Your goal has been updated and saved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {watchedValues.title}
              </h3>
              <p className="text-text-secondary">
                Status: {statusOptions.find(s => s.value === watchedValues.status)?.label}
              </p>
            </div>
            <Button 
              className="w-full bg-mint-green hover:bg-light-mint text-text-primary"
              onClick={() => {
                setShowSuccessModal(false);
                onSave();
              }}
            >
              <Target className="h-4 w-4 mr-2" />
              View Updated Goal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
