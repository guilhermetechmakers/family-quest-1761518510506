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
import { useCreateGoal } from '@/hooks/useGoals';
import { ArrowLeft, ArrowRight, Target, DollarSign, Users, Gift, Check } from 'lucide-react';

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['vacation', 'purchase', 'home_upgrade', 'pet', 'education', 'other']),
  target_value: z.number().min(1, 'Target value must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  image_url: z.string().optional(),
  milestones: z.array(z.object({
    title: z.string(),
    target_value: z.number(),
    reward: z.string().optional(),
    order: z.number(),
  })).optional(),
  contributors: z.array(z.object({
    user_id: z.string(),
    permissions: z.object({
      can_contribute: z.boolean(),
      can_edit: z.boolean(),
      can_approve_contributions: z.boolean(),
      can_invite_contributors: z.boolean(),
    }),
  })).optional(),
});

type GoalForm = z.infer<typeof goalSchema>;

const goalTypes = [
  { value: 'vacation', label: 'Vacation', icon: '🏖️' },
  { value: 'purchase', label: 'Purchase', icon: '🛍️' },
  { value: 'home_upgrade', label: 'Home Upgrade', icon: '🏠' },
  { value: 'pet', label: 'Pet', icon: '🐕' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'other', label: 'Other', icon: '🎯' },
];

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
];

export function GoalWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createGoal = useCreateGoal();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      currency: 'USD',
      milestones: [],
      contributors: [],
    },
  });

  const watchedValues = watch();

  const steps = [
    { number: 1, title: 'Basics', icon: Target },
    { number: 2, title: 'Target & Milestones', icon: DollarSign },
    { number: 3, title: 'Contributors', icon: Users },
    { number: 4, title: 'Rewards & Rules', icon: Gift },
    { number: 5, title: 'Review', icon: Check },
  ];

  const onSubmit = async (data: GoalForm) => {
    setIsSubmitting(true);
    try {
      await createGoal.mutateAsync({
        ...data,
        family_id: 'current-family-id', // This would come from context
      });
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
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

  const addMilestone = () => {
    const currentMilestones = watchedValues.milestones || [];
    setValue('milestones', [
      ...currentMilestones,
      { title: '', target_value: 0, reward: '', order: currentMilestones.length },
    ]);
  };

  const removeMilestone = (index: number) => {
    const currentMilestones = watchedValues.milestones || [];
    setValue('milestones', currentMilestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: string, value: any) => {
    const currentMilestones = watchedValues.milestones || [];
    const updatedMilestones = currentMilestones.map((milestone, i) =>
      i === index ? { ...milestone, [field]: value } : milestone
    );
    setValue('milestones', updatedMilestones);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-text-primary">Create New Goal</h1>
            <span className="text-sm text-text-secondary">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
                      ? 'bg-mint-green text-text-primary'
                      : 'bg-gray-200 text-text-tertiary'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-1 mx-2 ${
                      currentStep > step.number ? 'bg-mint-green' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Basics */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Goal Basics</h2>
              
              <div>
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Family Vacation to Hawaii"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal and why it's important to your family..."
                  rows={4}
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="type">Goal Type</Label>
                <Select onValueChange={(value) => setValue('type', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center">
                          <span className="mr-2">{type.icon}</span>
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="image_url">Image URL (Optional)</Label>
                <Input
                  id="image_url"
                  placeholder="https://example.com/image.jpg"
                  {...register('image_url')}
                />
              </div>
            </div>
          )}

          {/* Step 2: Target & Milestones */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Target & Milestones</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="target_value">Target Amount</Label>
                  <Input
                    id="target_value"
                    type="number"
                    placeholder="5000"
                    {...register('target_value', { valueAsNumber: true })}
                  />
                  {errors.target_value && (
                    <p className="text-sm text-red-500 mt-1">{errors.target_value.message}</p>
                  )}
                </div>

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
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Milestones (Optional)</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                    Add Milestone
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {watchedValues.milestones?.map((milestone, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            placeholder="e.g., 25% Complete"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Amount</Label>
                          <Input
                            type="number"
                            placeholder="1250"
                            value={milestone.target_value}
                            onChange={(e) => updateMilestone(index, 'target_value', Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label>Reward (Optional)</Label>
                          <Input
                            placeholder="e.g., Family movie night"
                            value={milestone.reward || ''}
                            onChange={(e) => updateMilestone(index, 'reward', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                        className="mt-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contributors */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Contributors</h2>
              <p className="text-text-secondary">
                Invite family members to contribute to this goal. You can always add more later.
              </p>
              
              <Card className="p-6 text-center">
                <Users className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Invite Contributors
                </h3>
                <p className="text-text-secondary mb-4">
                  This feature will be available after you create the goal.
                </p>
                <Button variant="outline" disabled>
                  Invite Family Members
                </Button>
              </Card>
            </div>
          )}

          {/* Step 4: Rewards & Rules */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Rewards & Rules</h2>
              
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Completion Reward</h3>
                  <p className="text-text-secondary text-sm mb-4">
                    What will your family do to celebrate when this goal is achieved?
                  </p>
                  <Textarea
                    placeholder="e.g., Book a special dinner at our favorite restaurant, or plan a weekend getaway..."
                    rows={3}
                  />
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Contribution Rules</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-text-secondary">
                        Require approval for monetary contributions
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm text-text-secondary">
                        Allow manual contributions (chores, tasks)
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-text-secondary">
                        Make this goal visible to extended family
                      </span>
                    </label>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-text-primary">Review & Create</h2>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Goal Summary</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-text-primary">{watchedValues.title}</h4>
                    <p className="text-text-secondary text-sm">{watchedValues.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-secondary">Type</p>
                      <p className="font-medium text-text-primary">
                        {goalTypes.find(t => t.value === watchedValues.type)?.label}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Target</p>
                      <p className="font-medium text-text-primary">
                        {watchedValues.currency} {watchedValues.target_value?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {watchedValues.milestones && watchedValues.milestones.length > 0 && (
                    <div>
                      <p className="text-sm text-text-secondary mb-2">Milestones</p>
                      <div className="space-y-2">
                        {watchedValues.milestones.map((milestone, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{milestone.title}</span>
                            <span className="font-medium">
                              {watchedValues.currency} {milestone.target_value?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button type="button" onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Goal...' : 'Create Goal'}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}