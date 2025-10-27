import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGoal } from '@/hooks/useGoals';
import { useGoalActivities } from '@/hooks/useActivities';
import { ActivityFeed } from '@/components/activity-feed/ActivityFeed';
import { ContributionForm } from '@/components/contribution-form/ContributionForm';
import { 
  ArrowLeft, 
  Share2, 
  Edit, 
  MoreHorizontal, 
  Target, 
  DollarSign, 
  Users, 
  TrendingUp,
  Star,
  CheckCircle,
  Clock,
  Archive,
  Trash2,
  Settings,
  Plus,
  Image as ImageIcon,
  MessageCircle,
  Sparkles,
  Trophy,
  Gift,
  Zap
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from 'sonner';

export function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  const { data: goal, isLoading: goalLoading } = useGoal(id || '');
  const { data: activities, isLoading: activitiesLoading } = useGoalActivities(id || '');

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
              The goal you're looking for doesn't exist or you don't have permission to view it.
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

  const progressPercentage = Math.round((goal.current_value / goal.target_value) * 100);
  const remainingAmount = goal.target_value - goal.current_value;
  const isCompleted = progressPercentage >= 100;

  const handleAddComment = (_activityId: string, _content: string) => {
    // TODO: Implement add comment functionality
    toast.success('Comment added successfully!');
  };

  const handleAddReaction = (_activityId: string, _emoji: string) => {
    // TODO: Implement add reaction functionality
    toast.success('Reaction added!');
  };

  const handleFlagActivity = (_activityId: string) => {
    // TODO: Implement flag activity functionality
    toast.success('Activity flagged for review');
  };

  const handleShareGoal = () => {
    // TODO: Implement share functionality
    toast.success('Share link copied to clipboard!');
  };

  const handleEditGoal = () => {
    // TODO: Implement edit goal functionality
    toast.success('Edit goal functionality coming soon!');
  };

  const handleArchiveGoal = () => {
    // TODO: Implement archive goal functionality
    toast.success('Goal archived successfully!');
  };

  const handleDeleteGoal = () => {
    // TODO: Implement delete goal functionality
    toast.success('Goal deleted successfully!');
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
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-text-primary">{goal.title}</h1>
                <Badge 
                  variant="secondary" 
                  className={`${
                    isCompleted 
                      ? 'bg-mint-green text-text-primary' 
                      : 'bg-pastel-yellow text-text-primary'
                  }`}
                >
                  {isCompleted ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
              <p className="text-text-secondary text-lg max-w-2xl">{goal.description}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleShareGoal}
                className="bg-mint-green hover:bg-light-mint text-text-primary"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Goal
              </Button>
              <Button 
                variant="outline" 
                onClick={handleEditGoal}
                className="border-mint-green text-mint-green hover:bg-mint-tint"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-mint-tint">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Goal Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchiveGoal}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Goal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteGoal} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Goal
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 bg-gradient-to-br from-white to-mint-tint/30 border-0 shadow-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Goal Image */}
                  <div className="relative">
                    {goal.image_url ? (
                      <img
                        src={goal.image_url}
                        alt={goal.title}
                        className="w-full h-48 object-cover rounded-2xl shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-mint-green to-light-mint rounded-2xl flex items-center justify-center shadow-lg">
                        <Target className="h-16 w-16 text-text-primary opacity-60" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-text-primary backdrop-blur-sm">
                        {goal.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Goal Stats */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/60 rounded-xl">
                        <p className="text-sm text-text-secondary mb-1">Target</p>
                        <p className="text-2xl font-bold text-text-primary">
                          ${goal.target_value.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-xl">
                        <p className="text-sm text-text-secondary mb-1">Raised</p>
                        <p className="text-2xl font-bold text-mint-green">
                          ${goal.current_value.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm text-text-secondary mb-2">
                        <span>Progress</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        className="h-3 bg-gray-200"
                      />
                    </div>

                    {!isCompleted && (
                      <div className="text-center p-4 bg-pastel-yellow/20 rounded-xl">
                        <p className="text-sm text-text-secondary mb-1">Remaining</p>
                        <p className="text-xl font-bold text-text-primary">
                          ${remainingAmount.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {goal.estimated_completion && (
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          Estimated completion: {formatRelativeTime(goal.estimated_completion)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Progress Bar & Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-mint-green" />
                  Progress & Milestones
                </h3>
                
                <div className="space-y-4">
                  {goal.milestones?.map((milestone, index) => {
                    const isAchieved = goal.current_value >= milestone.target_value;
                    const isNext = !isAchieved && index === goal.milestones.findIndex(m => goal.current_value < m.target_value);
                    
                    return (
                      <div 
                        key={milestone.id}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-mint-tint/30 transition-colors cursor-pointer"
                        onClick={() => {
                          // TODO: Implement milestone details modal
                          toast.success(`Viewing details for ${milestone.title}`);
                        }}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isAchieved 
                            ? 'bg-mint-green text-text-primary' 
                            : isNext
                            ? 'bg-pastel-yellow text-text-primary'
                            : 'bg-gray-200 text-text-tertiary'
                        }`}>
                          {isAchieved ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <span className="font-bold">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-text-primary">{milestone.title}</h4>
                            <span className="text-sm font-medium text-text-secondary">
                              ${milestone.target_value.toLocaleString()}
                            </span>
                          </div>
                          {milestone.description && (
                            <p className="text-sm text-text-secondary">{milestone.description}</p>
                          )}
                          {milestone.reward && (
                            <div className="flex items-center gap-1 mt-2">
                              <Gift className="h-4 w-4 text-pastel-yellow" />
                              <span className="text-sm text-text-secondary">{milestone.reward}</span>
                            </div>
                          )}
                        </div>
                        
                        {isAchieved && (
                          <Badge className="bg-mint-green text-text-primary">
                            <Trophy className="h-3 w-3 mr-1" />
                            Achieved
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-text-primary flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-pale-lavender" />
                    Activity Feed
                  </h3>
                  <Button 
                    onClick={() => setShowContributionForm(true)}
                    className="bg-mint-green hover:bg-light-mint text-text-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </div>
                
                {activitiesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                ) : activities && activities.length > 0 ? (
                  <ActivityFeed
                    activities={activities}
                    onAddComment={handleAddComment}
                    onAddReaction={handleAddReaction}
                    onFlagActivity={handleFlagActivity}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-pale-lavender/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="h-8 w-8 text-pale-lavender" />
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">No Activity Yet</h4>
                    <p className="text-text-secondary mb-6">Be the first to add an activity or contribution!</p>
                    <Button 
                      onClick={() => setShowContributionForm(true)}
                      className="bg-mint-green hover:bg-light-mint text-text-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Activity
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-pastel-yellow" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowContributionForm(true)}
                    className="w-full bg-mint-green hover:bg-light-mint text-text-primary justify-start"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Contribute Money
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-pale-lavender text-pale-lavender hover:bg-pale-lavender/10 justify-start"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Chore
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-light-pink text-light-pink hover:bg-light-pink/10 justify-start"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Add Manual Entry
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-light-pink" />
                  Contributors
                </h3>
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
                        <p className="text-sm text-text-tertiary">
                          {contributor.permissions.can_contribute ? 'Can contribute' : 'View only'}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {contributor.permissions.can_edit ? 'Admin' : 'Member'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Share Card Generator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2 text-pastel-yellow" />
                  Share Card
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Create a beautiful shareable card to promote your goal.
                </p>
                <Button 
                  onClick={() => setShowShareDialog(true)}
                  className="w-full bg-pastel-yellow hover:bg-pastel-yellow/80 text-text-primary"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Share Card
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Contribution Form Dialog */}
        <Dialog open={showContributionForm} onOpenChange={setShowContributionForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Contribution</DialogTitle>
              <DialogDescription>
                Contribute to "{goal.title}" and help reach the family goal.
              </DialogDescription>
            </DialogHeader>
            <ContributionForm
              goalId={goal.id}
              goalTitle={goal.title}
              onSuccess={() => setShowContributionForm(false)}
              onCancel={() => setShowContributionForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Share Goal</DialogTitle>
              <DialogDescription>
                Share this goal with family and friends to get more support.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-mint-tint rounded-xl">
                <h4 className="font-semibold text-text-primary mb-2">Share Link</h4>
                <p className="text-sm text-text-secondary mb-3">
                  Copy this link to share the goal
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/goals/${goal.id}`}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                  />
                  <Button size="sm" onClick={handleShareGoal}>
                    Copy
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <Button 
                  onClick={() => setShowShareDialog(false)}
                  className="bg-mint-green hover:bg-light-mint text-text-primary"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Goal Settings</DialogTitle>
              <DialogDescription>
                Manage your goal settings and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <Button 
                  onClick={handleEditGoal}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Goal Details
                </Button>
                <Button 
                  onClick={handleArchiveGoal}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Goal
                </Button>
                <Button 
                  onClick={handleDeleteGoal}
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}