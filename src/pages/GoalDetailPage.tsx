import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGoal } from '@/hooks/useGoals';
import { ArrowLeft, Share2, Edit, MoreHorizontal } from 'lucide-react';

export function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: goal, isLoading } = useGoal(id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-green mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading goal details...</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Goal Not Found</h2>
          <p className="text-text-secondary mb-6">
            The goal you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild>
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-text-primary">{goal.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Goal Details</h2>
              <p className="text-text-secondary mb-6">{goal.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-text-secondary">Target Amount</p>
                  <p className="text-lg font-semibold text-text-primary">${goal.target_value.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Current Amount</p>
                  <p className="text-lg font-semibold text-text-primary">${goal.current_value.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm text-text-secondary mb-2">
                  <span>Progress</span>
                  <span>{Math.round((goal.current_value / goal.target_value) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-mint-green h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(goal.current_value / goal.target_value) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Goal
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Goal
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Contributors</h3>
              <div className="space-y-3">
                {goal.contributors?.map((contributor) => (
                  <div key={contributor.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pale-lavender rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-text-primary">
                        {contributor.user?.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {contributor.user?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {contributor.permissions.can_contribute ? 'Can contribute' : 'View only'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}