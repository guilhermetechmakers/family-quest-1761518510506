import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGoal, useUpdateGoal, useDeleteGoal } from '@/hooks/useGoals';
import { 
  ArrowLeft, 
  Save, 
  Edit, 
  MoreHorizontal, 
  Target, 
  Users, 
  Archive,
  Trash2,
  Settings,
  Plus,
  X,
  AlertCircle,
  UserPlus,
  UserMinus,
  Gift,
  Trophy,
  Activity,
  History,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';
import type { Milestone, GoalType, GoalStatus } from '@/types/goal';

// Form validation schemas
const goalDetailsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  target_value: z.number().min(1, 'Target value must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
  type: z.enum(['vacation', 'purchase', 'home_upgrade', 'pet', 'education', 'other']),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']),
});

const milestoneSchema = z.object({
  title: z.string().min(1, 'Milestone title is required'),
  description: z.string().optional(),
  target_value: z.number().min(1, 'Target value must be greater than 0'),
  reward: z.string().optional(),
});

type GoalDetailsForm = z.infer<typeof goalDetailsSchema>;
type MilestoneForm = z.infer<typeof milestoneSchema>;

export function EditGoalPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Data fetching
  const { data: goal, isLoading: goalLoading } = useGoal(id || '');
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();

  // Form setup
  const goalForm = useForm<GoalDetailsForm>({
    resolver: zodResolver(goalDetailsSchema),
    defaultValues: {
      title: '',
      description: '',
      target_value: 0,
      currency: 'USD',
      type: 'other',
      status: 'active',
    },
  });

  const milestoneForm = useForm<MilestoneForm>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      title: '',
      description: '',
      target_value: 0,
      reward: '',
    },
  });

  // Update form when goal data loads
  useEffect(() => {
    if (goal) {
      goalForm.reset({
        title: goal.title,
        description: goal.description,
        target_value: goal.target_value,
        currency: goal.currency,
        type: goal.type,
        status: goal.status,
      });
      if (goal.image_url) {
        setImagePreview(goal.image_url);
      }
    }
  }, [goal, goalForm]);

  // Loading state
  if (goalLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-green mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading goal details...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (!goal) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 text-center max-w-md">
            <div className="w-16 h-16 bg-light-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Goal Not Found</h2>
            <p className="text-text-secondary mb-6">
              The goal you're looking for doesn't exist or you don't have permission to edit it.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="bg-mint-green hover:bg-light-mint text-text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Event handlers
  const handleSaveGoal = async (data: GoalDetailsForm) => {
    try {
      await updateGoalMutation.mutateAsync({
        id: goal.id,
        updates: {
          id: goal.id,
          ...data,
          image_url: imagePreview || goal.image_url,
        },
      });
      setIsEditing(false);
      toast.success('Goal updated successfully!');
    } catch (error) {
      toast.error('Failed to update goal');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMilestone = () => {
    setEditingMilestone(null);
    milestoneForm.reset();
    setShowMilestoneDialog(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    milestoneForm.reset({
      title: milestone.title,
      description: milestone.description || '',
      target_value: milestone.target_value,
      reward: milestone.reward || '',
    });
    setShowMilestoneDialog(true);
  };

  const handleSaveMilestone = async (data: MilestoneForm) => {
    try {
      const updatedMilestones = editingMilestone
        ? goal.milestones.map(m => m.id === editingMilestone.id ? { ...m, ...data } : m)
        : [...goal.milestones, { ...data, id: Date.now().toString(), goal_id: goal.id, order: goal.milestones.length }];

      await updateGoalMutation.mutateAsync({
        id: goal.id,
        updates: { id: goal.id, milestones: updatedMilestones },
      });
      
      setShowMilestoneDialog(false);
      toast.success(editingMilestone ? 'Milestone updated!' : 'Milestone added!');
    } catch (error) {
      toast.error('Failed to save milestone');
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    try {
      const updatedMilestones = goal.milestones.filter(m => m.id !== milestoneId);
      await updateGoalMutation.mutateAsync({
        id: goal.id,
        updates: { id: goal.id, milestones: updatedMilestones },
      });
      toast.success('Milestone deleted!');
    } catch (error) {
      toast.error('Failed to delete milestone');
    }
  };

  const handleArchiveGoal = async () => {
    try {
      await updateGoalMutation.mutateAsync({
        id: goal.id,
        updates: { id: goal.id, status: 'cancelled' },
      });
      setShowArchiveDialog(false);
      toast.success('Goal archived successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to archive goal');
    }
  };

  const handleDeleteGoal = async () => {
    try {
      await deleteGoalMutation.mutateAsync(goal.id);
      setShowDeleteDialog(false);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete goal');
    }
  };


  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-mint-tint"
            onClick={() => navigate(`/goals/${id}`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Goal
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-2">
                Edit Goal
              </h1>
              <p className="text-text-secondary text-lg">
                Manage your goal settings, milestones, and contributors
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button 
                    onClick={goalForm.handleSubmit(handleSaveGoal)}
                    disabled={updateGoalMutation.isPending}
                    className="bg-mint-green hover:bg-light-mint text-text-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateGoalMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      goalForm.reset();
                      setImagePreview(goal.image_url || null);
                    }}
                    className="border-mint-green text-mint-green hover:bg-mint-tint"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-mint-green hover:bg-light-mint text-text-primary"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Goal
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Goal Details Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8">
                <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-mint-green" />
                  Goal Details
                </h3>
                
                <form onSubmit={goalForm.handleSubmit(handleSaveGoal)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Title</label>
                      <Input
                        {...goalForm.register('title')}
                        disabled={!isEditing}
                        className="w-full"
                        placeholder="Enter goal title"
                      />
                      {goalForm.formState.errors.title && (
                        <p className="text-sm text-red-600">{goalForm.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Type</label>
                      <Select
                        value={goalForm.watch('type')}
                        onValueChange={(value) => goalForm.setValue('type', value as GoalType)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select goal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="purchase">Purchase</SelectItem>
                          <SelectItem value="home_upgrade">Home Upgrade</SelectItem>
                          <SelectItem value="pet">Pet</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Description</label>
                    <Textarea
                      {...goalForm.register('description')}
                      disabled={!isEditing}
                      className="w-full min-h-[100px]"
                      placeholder="Describe your goal..."
                    />
                    {goalForm.formState.errors.description && (
                      <p className="text-sm text-red-600">{goalForm.formState.errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Target Value</label>
                      <Input
                        {...goalForm.register('target_value', { valueAsNumber: true })}
                        disabled={!isEditing}
                        type="number"
                        className="w-full"
                        placeholder="0"
                      />
                      {goalForm.formState.errors.target_value && (
                        <p className="text-sm text-red-600">{goalForm.formState.errors.target_value.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Currency</label>
                      <Select
                        value={goalForm.watch('currency')}
                        onValueChange={(value) => goalForm.setValue('currency', value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="CAD">CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text-primary">Status</label>
                      <Select
                        value={goalForm.watch('status')}
                        onValueChange={(value) => goalForm.setValue('status', value as GoalStatus)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Goal Image</label>
                    <div className="space-y-4">
                      {imagePreview && (
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                          <img
                            src={imagePreview}
                            alt="Goal preview"
                            className="w-full h-full object-cover"
                          />
                          {isEditing && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setImagePreview(null);
                                setImageFile(null);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {isEditing && (
                        <div className="border-2 border-dashed border-mint-green rounded-2xl p-6 text-center hover:bg-mint-tint/20 transition-colors">
                          <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <Camera className="h-8 w-8 text-mint-green" />
                            <span className="text-sm text-text-secondary">
                              {imageFile ? 'Change Image' : 'Upload Image'}
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </Card>
            </motion.div>

            {/* Milestones Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-text-primary flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-pastel-yellow" />
                    Milestones
                  </h3>
                  <Button 
                    onClick={handleAddMilestone}
                    className="bg-pastel-yellow hover:bg-pastel-yellow/80 text-text-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {goal.milestones?.map((milestone, index) => (
                    <div 
                      key={milestone.id}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-mint-tint/30 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-pastel-yellow text-text-primary flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-text-primary">{milestone.title}</h4>
                          <span className="text-sm font-medium text-text-secondary">
                            ${milestone.target_value.toLocaleString()}
                          </span>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-text-secondary mb-2">{milestone.description}</p>
                        )}
                        {milestone.reward && (
                          <div className="flex items-center gap-1">
                            <Gift className="h-4 w-4 text-pastel-yellow" />
                            <span className="text-sm text-text-secondary">{milestone.reward}</span>
                          </div>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-mint-tint">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditMilestone(milestone)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                  
                  {(!goal.milestones || goal.milestones.length === 0) && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-pastel-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="h-8 w-8 text-pastel-yellow" />
                      </div>
                      <h4 className="text-lg font-semibold text-text-primary mb-2">No Milestones Yet</h4>
                      <p className="text-text-secondary mb-4">Add milestones to break down your goal into achievable steps.</p>
                      <Button onClick={handleAddMilestone} className="bg-pastel-yellow hover:bg-pastel-yellow/80 text-text-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Milestone
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contributors Management */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary flex items-center">
                    <Users className="h-5 w-5 mr-2 text-light-pink" />
                    Contributors
                  </h3>
                  <Button 
                    onClick={() => toast.info('Contributor management coming soon!')}
                    size="sm"
                    className="bg-light-pink hover:bg-light-pink/80 text-text-primary"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {goal.contributors?.map((contributor) => (
                    <div key={contributor.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-mint-tint/30 transition-colors">
                      <Avatar className="h-10 w-10 ring-2 ring-mint-green/20">
                        <AvatarImage src={contributor.user?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-mint-green to-light-mint text-text-primary font-semibold">
                          {contributor.user?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary truncate">
                          {contributor.user?.full_name || 'Unknown User'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-text-tertiary">
                          <span>{contributor.permissions.can_contribute ? 'Can contribute' : 'View only'}</span>
                          <span>•</span>
                          <span>{contributor.permissions.can_edit ? 'Admin' : 'Member'}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-mint-tint">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info('Contributor management coming soon!')}>
                            <Settings className="h-4 w-4 mr-2" />
                            Manage
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info('Contributor management coming soon!')} className="text-red-600">
                            <UserMinus className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Activity Log */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <History className="h-5 w-5 mr-2 text-light-purple" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[
                    { action: 'Goal updated', user: 'John Doe', time: '2 hours ago' },
                    { action: 'Milestone added', user: 'Jane Smith', time: '1 day ago' },
                    { action: 'Contributor added', user: 'John Doe', time: '3 days ago' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-mint-tint/20 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-light-purple/20 flex items-center justify-center">
                        <Activity className="h-4 w-4 text-light-purple" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                        <p className="text-xs text-text-tertiary">by {activity.user} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 border-red-200">
                <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Danger Zone
                </h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowArchiveDialog(true)}
                    variant="outline"
                    className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 justify-start"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Goal
                  </Button>
                  <Button 
                    onClick={() => setShowDeleteDialog(true)}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 justify-start"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Goal
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Milestone Dialog */}
        <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingMilestone ? 'Edit Milestone' : 'Add Milestone'}
              </DialogTitle>
              <DialogDescription>
                {editingMilestone ? 'Update milestone details' : 'Create a new milestone for your goal'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={milestoneForm.handleSubmit(handleSaveMilestone)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Title</label>
                <Input
                  {...milestoneForm.register('title')}
                  placeholder="Enter milestone title"
                />
                {milestoneForm.formState.errors.title && (
                  <p className="text-sm text-red-600">{milestoneForm.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Description</label>
                <Textarea
                  {...milestoneForm.register('description')}
                  placeholder="Describe this milestone (optional)"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Target Value</label>
                <Input
                  {...milestoneForm.register('target_value', { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                />
                {milestoneForm.formState.errors.target_value && (
                  <p className="text-sm text-red-600">{milestoneForm.formState.errors.target_value.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Reward</label>
                <Input
                  {...milestoneForm.register('reward')}
                  placeholder="What's the reward for this milestone? (optional)"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMilestoneDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-mint-green hover:bg-light-mint text-text-primary">
                  {editingMilestone ? 'Update' : 'Add'} Milestone
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Archive Confirmation Dialog */}
        <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive Goal</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to archive this goal? This will mark it as cancelled and hide it from active goals. 
                You can restore it later if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleArchiveGoal}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Archive Goal
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Goal</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete this goal? This action cannot be undone. 
                All associated data including contributions, milestones, and activity logs will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteGoal}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Goal
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}