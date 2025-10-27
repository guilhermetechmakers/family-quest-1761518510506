import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Download, 
  Share2, 
  TrendingUp,
  Target,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressBar } from '@/components/progress/ProgressBar';
import { MilestoneCard } from '@/components/progress/MilestoneCard';
import { ETADisplay } from '@/components/progress/ETADisplay';
import { ProgressChart } from '@/components/progress/ProgressChart';
import { ContributorsSummary } from '@/components/progress/ContributorsSummary';
import { ProgressAdjustmentModal } from '@/components/progress/ProgressAdjustmentModal';
import { ProgressSettingsModal } from '@/components/progress/ProgressSettingsModal';
import { useGoalProgress, useProgressSettings, useTriggerMilestoneCheck, useExportProgressData } from '@/hooks/useProgress';
import { toast } from 'sonner';

export function ProgressTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: progress, isLoading, error } = useGoalProgress(id || '');
  const { data: settings } = useProgressSettings(id || '');
  const triggerMilestoneCheck = useTriggerMilestoneCheck();
  const exportData = useExportProgressData();

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleAdjustProgress = () => {
    setShowAdjustmentModal(true);
  };

  const handleSettings = () => {
    setShowSettingsModal(true);
  };

  const handleShare = () => {
    toast.info('Share functionality coming soon!');
  };

  const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
    if (!id) return;
    try {
      await exportData.mutateAsync({ goalId: id, format });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCheckMilestones = async () => {
    if (!id) return;
    try {
      await triggerMilestoneCheck.mutateAsync(id);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleMilestoneAchieve = (milestoneId: string) => {
    toast.success(`Milestone ${milestoneId} marked as achieved!`);
    // In a real app, this would trigger an API call
  };

  const handleMilestoneShare = (milestoneId: string) => {
    toast.info(`Sharing milestone ${milestoneId}...`);
    // In a real app, this would generate and share a card
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-mint-green mx-auto mb-4" />
          <p className="text-text-secondary">Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (error || !progress) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <Target className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">Progress Not Found</h2>
          <p className="text-text-secondary mb-4">
            We couldn't load the progress data for this goal.
          </p>
          <Button onClick={handleBack} className="bg-mint-green hover:bg-light-mint">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-primary-bg"
    >
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{progress.goal_title}</h1>
              <p className="text-text-secondary capitalize">{progress.goal_type.replace('_', ' ')} Goal</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckMilestones}
              disabled={triggerMilestoneCheck.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${triggerMilestoneCheck.isPending ? 'animate-spin' : ''}`} />
              Check Milestones
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdjustProgress}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Adjust
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSettings}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            progress={progress}
            showPercentage={true}
            showETA={true}
            size="lg"
            animated={true}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ETA Display */}
              <ETADisplay
                estimatedCompletionDate={progress.estimated_completion_date}
                daysRemaining={progress.days_remaining}
                confidence={85} // Mock confidence
                dailyAverage={progress.daily_average_contribution}
                status={progress.status}
              />

              {/* Progress Chart */}
              <ProgressChart
                data={progress.trend_data}
                currency={progress.currency}
                showPercentage={false}
              />
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-mint-green" />
                <span>Recent Activity</span>
              </h3>
              <div className="space-y-3">
                {progress.recent_activity.slice(0, 5).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-mint-green rounded-full" />
                      <span className="text-sm text-text-primary">{activity.description || 'Progress update'}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary">
                        {activity.amount ? `$${activity.amount.toLocaleString()}` : 'N/A'}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {progress.milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.milestone_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MilestoneCard
                    milestone={milestone}
                    onAchieve={handleMilestoneAchieve}
                    onShare={handleMilestoneShare}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Chart with Percentage */}
              <ProgressChart
                data={progress.trend_data}
                currency={progress.currency}
                showPercentage={true}
              />

              {/* Analytics Summary */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Analytics Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Total Contributions</span>
                    <span className="font-semibold text-text-primary">
                      {progress.recent_activity.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Average Daily</span>
                    <span className="font-semibold text-text-primary">
                      ${progress.daily_average_contribution?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Milestones Achieved</span>
                    <span className="font-semibold text-text-primary">
                      {progress.milestones.filter(m => m.is_achieved).length} / {progress.milestones.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Completion Rate</span>
                    <span className="font-semibold text-text-primary">
                      {Math.round(progress.percentage)}%
                    </span>
                  </div>
                </div>

                {/* Export Options */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-text-primary mb-3">Export Data</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('csv')}
                      disabled={exportData.isPending}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('pdf')}
                      disabled={exportData.isPending}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport('json')}
                      disabled={exportData.isPending}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contributors Tab */}
          <TabsContent value="contributors" className="space-y-6">
            <ContributorsSummary
              contributors={progress.contributors_summary}
              totalValue={progress.current_value}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {progress && (
        <>
          <ProgressAdjustmentModal
            goalId={progress.goal_id}
            goalTitle={progress.goal_title}
            currentValue={progress.current_value}
            isOpen={showAdjustmentModal}
            onClose={() => setShowAdjustmentModal(false)}
          />

          {settings && (
            <ProgressSettingsModal
              goalId={progress.goal_id}
              goalTitle={progress.goal_title}
              settings={settings}
              isOpen={showSettingsModal}
              onClose={() => setShowSettingsModal(false)}
            />
          )}
        </>
      )}
    </motion.div>
  );
}