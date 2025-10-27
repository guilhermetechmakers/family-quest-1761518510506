import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGoal } from '@/hooks/useGoals';
import { ContributionForm } from '@/components/contribution-form/ContributionForm';
import { 
  ArrowLeft, 
  Edit, 
  Share2, 
  MoreHorizontal,
  Target,
  Users,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Gift,
  Plus
} from 'lucide-react';

interface GoalDetailProps {
  goalId: string;
  onBack: () => void;
  onEdit: () => void;
}

export function GoalDetail({ goalId, onBack, onEdit }: GoalDetailProps) {
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: goal, isLoading, error } = useGoal(goalId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-mint-green border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading goal details...</p>
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
            The goal you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Goals
          </Button>
        </Card>
      </div>
    );
  }

  const progressPercentage = (goal.current_value / goal.target_value) * 100;
  const remainingAmount = goal.target_value - goal.current_value;
  const isCompleted = goal.status === 'completed';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-light-mint text-text-primary';
      case 'active':
        return 'bg-mint-green text-text-primary';
      case 'paused':
        return 'bg-pastel-yellow text-text-primary';
      case 'draft':
        return 'bg-gray-200 text-text-primary';
      case 'cancelled':
        return 'bg-light-pink text-text-primary';
      default:
        return 'bg-gray-200 text-text-primary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vacation':
        return '🏖️';
      case 'purchase':
        return '🛍️';
      case 'home_upgrade':
        return '🏠';
      case 'pet':
        return '🐕';
      case 'education':
        return '🎓';
      default:
        return '🎯';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥',
    };
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                Back to Goals
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={onEdit}
                  className="h-10"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Goal
                </Button>
                <Button
                  variant="outline"
                  className="h-10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Goal Hero */}
            <Card className="p-8 bg-white shadow-card mb-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-mint-tint rounded-full flex items-center justify-center">
                      <span className="text-4xl">{getTypeIcon(goal.type)}</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-text-primary mb-2">
                        {goal.title}
                      </h1>
                      <Badge className={`${getStatusColor(goal.status)} text-sm px-3 py-1`}>
                        {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary text-lg mb-6">
                    {goal.description}
                  </p>

                  {/* Progress Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-text-primary">Progress</span>
                      <span className="text-2xl font-bold text-text-primary">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <div className="flex items-center justify-between text-sm text-text-tertiary">
                      <span>{formatCurrency(goal.current_value, goal.currency)} raised</span>
                      <span>{formatCurrency(goal.target_value, goal.currency)} target</span>
                    </div>
                  </div>
                </div>

                {/* Goal Image */}
                {goal.image_url && (
                  <div className="lg:w-80">
                    <div className="aspect-video bg-mint-tint rounded-2xl overflow-hidden">
                      <img
                        src={goal.image_url}
                        alt={goal.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="p-6 bg-white shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Remaining</p>
                    <p className="text-2xl font-bold text-text-primary">
                      {formatCurrency(remainingAmount, goal.currency)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-pastel-yellow rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Contributors</p>
                    <p className="text-2xl font-bold text-text-primary">
                      {goal.contributors?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-pale-lavender rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Milestones</p>
                    <p className="text-2xl font-bold text-text-primary">
                      {goal.milestones?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-light-pink rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-text-primary" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-secondary">Created</p>
                    <p className="text-lg font-bold text-text-primary">
                      {formatDate(goal.created_at)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-light-mint rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-text-primary" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="contributors">Contributors</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Actions */}
                  <Card className="p-6 bg-white shadow-card">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button
                        onClick={() => setShowContributeModal(true)}
                        className="w-full bg-mint-green hover:bg-light-mint text-text-primary"
                        disabled={isCompleted}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        {isCompleted ? 'Goal Completed' : 'Make Contribution'}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={isCompleted}
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        Add Milestone
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Invite Contributors
                      </Button>
                    </div>
                  </Card>

                  {/* Goal Details */}
                  <Card className="p-6 bg-white shadow-card">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Goal Details</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Type</span>
                        <span className="font-medium text-text-primary capitalize">
                          {goal.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Currency</span>
                        <span className="font-medium text-text-primary">{goal.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Status</span>
                        <Badge className={`${getStatusColor(goal.status)} text-xs`}>
                          {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Created</span>
                        <span className="font-medium text-text-primary">
                          {formatDate(goal.created_at)}
                        </span>
                      </div>
                      {goal.updated_at !== goal.created_at && (
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Last Updated</span>
                          <span className="font-medium text-text-primary">
                            {formatDate(goal.updated_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-6">
                <Card className="p-6 bg-white shadow-card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Milestones</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Milestone
                    </Button>
                  </div>
                  
                  {goal.milestones && goal.milestones.length > 0 ? (
                    <div className="space-y-4">
                      {goal.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-mint-tint rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-mint-green rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-text-primary">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-text-primary">{milestone.title}</h4>
                              {milestone.description && (
                                <p className="text-sm text-text-secondary">{milestone.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-text-primary">
                              {formatCurrency(milestone.target_value, goal.currency)}
                            </p>
                            {milestone.reward && (
                              <p className="text-sm text-text-secondary">Reward: {milestone.reward}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                      <p className="text-text-secondary">No milestones yet</p>
                      <p className="text-sm text-text-tertiary">Add milestones to break down your goal into smaller steps</p>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="contributors" className="space-y-6">
                <Card className="p-6 bg-white shadow-card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-text-primary">Contributors</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Invite Contributor
                    </Button>
                  </div>
                  
                  {goal.contributors && goal.contributors.length > 0 ? (
                    <div className="space-y-4">
                      {goal.contributors.map((contributor, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-pale-lavender-bg rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-mint-green text-text-primary">
                                {contributor.user.full_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium text-text-primary">{contributor.user.full_name}</h4>
                              <p className="text-sm text-text-secondary">Joined {formatDate(contributor.joined_at)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-1">
                              {contributor.permissions.can_edit ? 'Editor' : 'Contributor'}
                            </Badge>
                            <p className="text-sm text-text-secondary">
                              {contributor.permissions.can_approve_contributions ? 'Can approve' : 'Cannot approve'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                      <p className="text-text-secondary">No contributors yet</p>
                      <p className="text-sm text-text-tertiary">Invite family members to help achieve this goal</p>
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="p-6 bg-white shadow-card">
                  <h3 className="text-lg font-semibold text-text-primary mb-6">Recent Activity</h3>
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                    <p className="text-text-secondary">No recent activity</p>
                    <p className="text-sm text-text-tertiary">Activity will appear here as people contribute to this goal</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>

      {/* Contribution Modal */}
      <Dialog open={showContributeModal} onOpenChange={setShowContributeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-text-primary">
              Make a Contribution
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              Help achieve "{goal.title}" by making a contribution
            </DialogDescription>
          </DialogHeader>
          <ContributionForm
            goalId={goal.id}
            goalTitle={goal.title}
            onSuccess={() => setShowContributeModal(false)}
            onCancel={() => setShowContributeModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
