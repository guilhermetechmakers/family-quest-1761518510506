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
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateGoal } from '@/hooks/useGoals';
import { 
  ArrowLeft, 
  ArrowRight, 
  Target, 
  DollarSign, 
  Users, 
  Gift, 
  Check, 
  Plus, 
  X, 
  Image as ImageIcon,
  TrendingUp,
  Share2
} from 'lucide-react';

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  type: z.enum(['vacation', 'purchase', 'home_upgrade', 'pet', 'education', 'other']),
  target_value: z.number().min(1, 'Target value must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  image_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  milestones: z.array(z.object({
    title: z.string().min(1, 'Milestone title is required'),
    target_value: z.number().min(0, 'Target value must be positive'),
    reward: z.string().optional(),
    order: z.number(),
  })).optional(),
  contributors: z.array(z.object({
    email: z.string().email('Please enter a valid email'),
    role: z.enum(['parent', 'child', 'guest']),
    permissions: z.object({
      can_contribute: z.boolean(),
      can_edit: z.boolean(),
      can_approve_contributions: z.boolean(),
      can_invite_contributors: z.boolean(),
    }),
  })).optional(),
  reward: z.string().optional(),
  parental_approval_required: z.boolean().default(true),
  allow_manual_contributions: z.boolean().default(true),
  is_public: z.boolean().default(false),
});

type GoalForm = z.infer<typeof goalSchema>;

const goalTypes = [
  { value: 'vacation', label: 'Vacation', icon: '🏖️', description: 'Family trips and adventures' },
  { value: 'purchase', label: 'Purchase', icon: '🛍️', description: 'Buying something special' },
  { value: 'home_upgrade', label: 'Home Upgrade', icon: '🏠', description: 'Improving our home' },
  { value: 'pet', label: 'Pet', icon: '🐕', description: 'Getting a new family pet' },
  { value: 'education', label: 'Education', icon: '🎓', description: 'Learning and development' },
  { value: 'other', label: 'Other', icon: '🎯', description: 'Something else special' },
];

const currencies = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
];

const contributorRoles = [
  { value: 'parent', label: 'Parent', description: 'Full access and control' },
  { value: 'child', label: 'Child', description: 'Can contribute and view progress' },
  { value: 'guest', label: 'Guest', description: 'Limited access, can contribute only' },
];

export function GoalWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newContributorEmail, setNewContributorEmail] = useState('');
  const [newContributorRole, setNewContributorRole] = useState<'parent' | 'child' | 'guest'>('child');
  const createGoal = useCreateGoal();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<GoalForm>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      currency: 'USD',
      milestones: [],
      contributors: [],
      parental_approval_required: true,
      allow_manual_contributions: true,
      is_public: false,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Autosave functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (watchedValues.title || watchedValues.description) {
        localStorage.setItem('goal-wizard-draft', JSON.stringify(watchedValues));
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [watchedValues]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('goal-wizard-draft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        Object.keys(parsedDraft).forEach(key => {
          setValue(key as keyof GoalForm, parsedDraft[key]);
        });
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [setValue]);

  const steps = [
    { number: 1, title: 'Basics', icon: Target, description: 'Set your goal foundation' },
    { number: 2, title: 'Target & Milestones', icon: DollarSign, description: 'Define your target and milestones' },
    { number: 3, title: 'Contributors', icon: Users, description: 'Invite family members' },
    { number: 4, title: 'Rewards & Rules', icon: Gift, description: 'Set rewards and permissions' },
    { number: 5, title: 'Review', icon: Check, description: 'Review and create your goal' },
  ];

  const onSubmit = async (data: GoalForm) => {
    setIsSubmitting(true);
    try {
      // Transform contributors to match the expected API format
      const transformedContributors = data.contributors?.map(contributor => ({
        user_id: contributor.email, // For now, using email as user_id
        permissions: contributor.permissions,
      }));

      await createGoal.mutateAsync({
        title: data.title,
        description: data.description,
        type: data.type,
        target_value: data.target_value,
        currency: data.currency,
        family_id: 'current-family-id', // This would come from context
        image_url: data.image_url,
        milestones: data.milestones?.map((milestone, index) => ({
          title: milestone.title,
          target_value: milestone.target_value,
          reward: milestone.reward,
          order: index,
        })),
        contributors: transformedContributors,
      });
      localStorage.removeItem('goal-wizard-draft');
      setShowSuccessModal(true);
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

  const addContributor = () => {
    if (newContributorEmail && newContributorRole) {
      const currentContributors = watchedValues.contributors || [];
      const defaultPermissions = {
        can_contribute: true,
        can_edit: newContributorRole === 'parent',
        can_approve_contributions: newContributorRole === 'parent',
        can_invite_contributors: newContributorRole === 'parent',
      };

      setValue('contributors', [
        ...currentContributors,
        {
          email: newContributorEmail,
          role: newContributorRole,
          permissions: defaultPermissions,
        },
      ]);
      setNewContributorEmail('');
      setNewContributorRole('child');
    }
  };

  const removeContributor = (index: number) => {
    const currentContributors = watchedValues.contributors || [];
    setValue('contributors', currentContributors.filter((_, i) => i !== index));
  };

  const calculateProgress = () => {
    return (currentStep / steps.length) * 100;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return watchedValues.title && watchedValues.description && watchedValues.type;
      case 2:
        return watchedValues.target_value && watchedValues.currency;
      case 3:
        return true; // Contributors are optional
      case 4:
        return true; // Rules are optional
      case 5:
        return isValid;
      default:
        return false;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-primary-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1 
                className="text-3xl font-bold text-text-primary mb-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Create Your Family Goal
              </motion.h1>
              <motion.p 
                className="text-text-secondary text-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Turn your dreams into achievable family missions
              </motion.p>
            </div>

            {/* Progress Bar */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-text-primary">
                  Step {currentStep} of {steps.length}
                </span>
                <span className="text-sm text-text-secondary">
                  {Math.round(calculateProgress())}% Complete
                </span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </motion.div>

            {/* Step Indicators */}
            <motion.div 
              className="flex items-center justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    className="flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentStep >= step.number
                          ? 'bg-mint-green text-text-primary shadow-lg'
                          : 'bg-pale-lavender text-text-secondary'
                      }`}
                    >
                      <step.icon className="h-6 w-6" />
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                          currentStep > step.number ? 'bg-mint-green' : 'bg-pale-lavender'
                        }`}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Main Content Card */}
            <Card className="p-8 shadow-card">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Basics */}
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
                        <h2 className="text-2xl font-semibold text-text-primary mb-2">Goal Basics</h2>
                        <p className="text-text-secondary">Tell us about your family's goal</p>
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
                                      <div className="text-sm text-text-secondary">{type.description}</div>
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

                  {/* Step 2: Target & Milestones */}
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
                        <h2 className="text-2xl font-semibold text-text-primary mb-2">Target & Milestones</h2>
                        <p className="text-text-secondary">Set your target and break it into milestones</p>
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
                          <div className="flex items-center justify-between mb-4">
                            <Label className="text-base font-medium text-text-primary">Milestones (Optional)</Label>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={addMilestone}
                              className="bg-mint-green hover:bg-light-mint text-text-primary border-mint-green"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Milestone
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            {watchedValues.milestones?.map((milestone, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Card className="p-4 bg-pale-lavender-bg border-pale-lavender">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium text-text-primary">Title</Label>
                                      <Input
                                        placeholder="e.g., 25% Complete"
                                        value={milestone.title}
                                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-text-primary">Amount</Label>
                                      <Input
                                        type="number"
                                        placeholder="1250"
                                        value={milestone.target_value}
                                        onChange={(e) => updateMilestone(index, 'target_value', Number(e.target.value))}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-text-primary">Reward (Optional)</Label>
                                      <Input
                                        placeholder="e.g., Family movie night"
                                        value={milestone.reward || ''}
                                        onChange={(e) => updateMilestone(index, 'reward', e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMilestone(index)}
                                    className="mt-3 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Remove
                                  </Button>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Contributors */}
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
                          <Users className="h-8 w-8 text-text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold text-text-primary mb-2">Contributors</h2>
                        <p className="text-text-secondary">Invite family members to join your goal</p>
                      </div>

                      <div className="space-y-6">
                        {/* Add Contributor Form */}
                        <Card className="p-6 bg-pale-lavender-bg border-pale-lavender">
                          <h3 className="text-lg font-semibold text-text-primary mb-4">Add Family Member</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-text-primary">Email Address</Label>
                              <Input
                                placeholder="family@example.com"
                                value={newContributorEmail}
                                onChange={(e) => setNewContributorEmail(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-text-primary">Role</Label>
                              <Select value={newContributorRole} onValueChange={(value: any) => setNewContributorRole(value)}>
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {contributorRoles.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                      <div>
                                        <div className="font-medium">{role.label}</div>
                                        <div className="text-xs text-text-secondary">{role.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={addContributor}
                            disabled={!newContributorEmail}
                            className="mt-4 bg-mint-green hover:bg-light-mint text-text-primary"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Contributor
                          </Button>
                        </Card>

                        {/* Contributors List */}
                        {watchedValues.contributors && watchedValues.contributors.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Contributors</h3>
                            <div className="space-y-3">
                              {watchedValues.contributors.map((contributor, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Card className="p-4 bg-white border-pale-lavender">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10">
                                          <AvatarFallback className="bg-mint-green text-text-primary">
                                            {contributor.email.charAt(0).toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium text-text-primary">{contributor.email}</div>
                                          <Badge 
                                            variant="secondary" 
                                            className={`${
                                              contributor.role === 'parent' ? 'bg-mint-green' :
                                              contributor.role === 'child' ? 'bg-pastel-yellow' :
                                              'bg-light-pink'
                                            } text-text-primary`}
                                          >
                                            {contributorRoles.find(r => r.value === contributor.role)?.label}
                                          </Badge>
                                        </div>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeContributor(index)}
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
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Rewards & Rules */}
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
                        <div className="w-16 h-16 bg-pastel-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                          <Gift className="h-8 w-8 text-text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold text-text-primary mb-2">Rewards & Rules</h2>
                        <p className="text-text-secondary">Set up rewards and contribution rules</p>
                      </div>

                      <div className="space-y-6">
                        <Card className="p-6 bg-mint-tint border-mint-green">
                          <h3 className="text-lg font-semibold text-text-primary mb-2">Completion Reward</h3>
                          <p className="text-text-secondary text-sm mb-4">
                            What will your family do to celebrate when this goal is achieved?
                          </p>
                          <Textarea
                            placeholder="e.g., Book a special dinner at our favorite restaurant, or plan a weekend getaway..."
                            rows={3}
                            {...register('reward')}
                            className="text-base"
                          />
                        </Card>

                        <Card className="p-6 bg-pale-lavender-bg border-pale-lavender">
                          <h3 className="text-lg font-semibold text-text-primary mb-4">Contribution Rules</h3>
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id="parental_approval"
                                checked={watchedValues.parental_approval_required}
                                onCheckedChange={(checked) => setValue('parental_approval_required', !!checked)}
                              />
                              <Label htmlFor="parental_approval" className="text-text-primary">
                                Require approval for monetary contributions
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id="manual_contributions"
                                checked={watchedValues.allow_manual_contributions}
                                onCheckedChange={(checked) => setValue('allow_manual_contributions', !!checked)}
                              />
                              <Label htmlFor="manual_contributions" className="text-text-primary">
                                Allow manual contributions (chores, tasks)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id="is_public"
                                checked={watchedValues.is_public}
                                onCheckedChange={(checked) => setValue('is_public', !!checked)}
                              />
                              <Label htmlFor="is_public" className="text-text-primary">
                                Make this goal visible to extended family
                              </Label>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Review */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step-5"
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
                        <h2 className="text-2xl font-semibold text-text-primary mb-2">Review & Create</h2>
                        <p className="text-text-secondary">Review your goal details before creating</p>
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
                              <p className="text-sm text-text-secondary mb-1">Target</p>
                              <p className="text-lg font-semibold text-text-primary">
                                {currencies.find(c => c.value === watchedValues.currency)?.symbol}
                                {watchedValues.target_value?.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {watchedValues.milestones && watchedValues.milestones.length > 0 && (
                            <div>
                              <p className="text-sm text-text-secondary mb-3">Milestones</p>
                              <div className="space-y-2">
                                {watchedValues.milestones.map((milestone, index) => (
                                  <div key={index} className="flex justify-between items-center p-3 bg-pale-lavender-bg rounded-lg">
                                    <span className="font-medium text-text-primary">{milestone.title}</span>
                                    <span className="font-semibold text-text-primary">
                                      {currencies.find(c => c.value === watchedValues.currency)?.symbol}
                                      {milestone.target_value?.toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {watchedValues.contributors && watchedValues.contributors.length > 0 && (
                            <div>
                              <p className="text-sm text-text-secondary mb-3">Contributors</p>
                              <div className="flex flex-wrap gap-2">
                                {watchedValues.contributors.map((contributor, index) => (
                                  <Badge 
                                    key={index}
                                    variant="secondary"
                                    className="bg-mint-green text-text-primary"
                                  >
                                    {contributor.email}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {watchedValues.reward && (
                            <div>
                              <p className="text-sm text-text-secondary mb-2">Completion Reward</p>
                              <p className="text-text-primary font-medium">{watchedValues.reward}</p>
                            </div>
                          )}
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
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !isValid}
                      className="px-8 py-3 bg-mint-green hover:bg-light-mint text-text-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-text-primary border-t-transparent mr-2" />
                          Creating Goal...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Create Goal
                        </>
                      )}
                    </Button>
                  )}
                </motion.div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-text-primary">
              🎉 Goal Created Successfully!
            </DialogTitle>
            <DialogDescription className="text-center text-text-secondary">
              Your family goal has been created and is ready to start tracking progress.
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
                Target: {currencies.find(c => c.value === watchedValues.currency)?.symbol}
                {watchedValues.target_value?.toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button 
                className="flex-1 bg-mint-green hover:bg-light-mint text-text-primary"
                onClick={() => {
                  setShowSuccessModal(false);
                  // Navigate to dashboard or goal detail
                }}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Goal
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowSuccessModal(false);
                  // Navigate to dashboard
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}