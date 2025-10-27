import { useGoals } from '@/hooks/useGoals';
import { useCurrentUser } from '@/hooks/useAuth';
import { useActivities } from '@/hooks/useActivities';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { GoalsSection } from '@/components/dashboard/GoalsSection';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { MilestonesWidget } from '@/components/dashboard/MilestonesWidget';
import { ProgressTrackingWidget } from '@/components/dashboard/ProgressTrackingWidget';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function DashboardPage() {
  const { data: user } = useCurrentUser();
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const { data: activities, isLoading: activitiesLoading } = useActivities('family-123'); // Mock family ID

  // Mock family data - in a real app this would come from family context
  const familyData = {
    name: user?.full_name?.split(' ')[0] + "'s Family" || "The Johnson Family",
    balance: 1250.50,
    memberCount: 4
  };

  const stats = {
    totalGoals: goals?.length || 0,
    activeGoals: goals?.filter(g => g.status === 'active').length || 0,
    completedGoals: goals?.filter(g => g.status === 'completed').length || 0,
    totalContributions: goals?.reduce((sum, goal) => sum + goal.current_value, 0) || 0,
  };

  const handleQuickContribute = (goalId?: string) => {
    if (goalId) {
      toast.success(`Quick contribute to goal ${goalId}`);
      // In a real app, this would open a contribution modal
    } else {
      toast.info('Select a goal to contribute to');
    }
  };

  const handleAddChore = () => {
    toast.info('Chore logging feature coming soon!');
  };

  const handleInviteMember = () => {
    toast.info('Member invitation feature coming soon!');
  };

  const handleNotificationsClick = () => {
    toast.info('Opening notifications...');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-primary-bg"
    >
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Dashboard Header */}
        <DashboardHeader
          familyName={familyData.name}
          balance={familyData.balance}
          unreadNotifications={3}
          memberCount={familyData.memberCount}
          onNotificationsClick={handleNotificationsClick}
        />

        {/* Stats Cards */}
        <StatsCards
          totalGoals={stats.totalGoals}
          activeGoals={stats.activeGoals}
          completedGoals={stats.completedGoals}
          totalContributions={stats.totalContributions}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Section - Takes up 2 columns on large screens */}
          <GoalsSection
            goals={goals || []}
            isLoading={goalsLoading}
            onQuickContribute={handleQuickContribute}
          />

          {/* Sidebar - Takes up 1 column on large screens */}
          <div className="space-y-6">
            {/* Progress Tracking Widget */}
            <ProgressTrackingWidget
              familyId="family-123"
              isLoading={goalsLoading}
            />

            {/* Recent Activity Feed */}
            <ActivityFeed
              activities={activities || []}
              isLoading={activitiesLoading}
            />

            {/* Upcoming Milestones Widget */}
            <MilestonesWidget
              goals={goals || []}
              isLoading={goalsLoading}
            />

            {/* Quick Actions */}
            <QuickActions
              onQuickContribute={() => handleQuickContribute()}
              onAddChore={handleAddChore}
              onInviteMember={handleInviteMember}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}