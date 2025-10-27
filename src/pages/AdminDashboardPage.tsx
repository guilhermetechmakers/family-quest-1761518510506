import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { ModerationQueue } from '@/components/admin/ModerationQueue';
import { TransactionManagement } from '@/components/admin/TransactionManagement';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { useAdminDashboardStats } from '@/hooks/useAdmin';
import { Card } from '@/components/ui/card';
import { 
  Activity, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

export function AdminDashboardPage() {
  const [currentPage, setCurrentPage] = useState('overview');
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();

  const renderPageContent = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage stats={stats} isLoading={statsLoading} />;
      case 'users':
        return <UserManagementTable />;
      case 'moderation':
        return <ModerationQueue />;
      case 'transactions':
        return <TransactionManagement />;
      case 'analytics':
        return <AnalyticsCharts />;
      case 'broadcast':
        return <BroadcastMessagesPage />;
      case 'settings':
        return <SystemSettingsPage />;
      default:
        return <OverviewPage stats={stats} isLoading={statsLoading} />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPageContent()}
    </AdminLayout>
  );
}

function OverviewPage({ stats, isLoading }: { stats: any; isLoading: boolean }) {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
          <p className="text-text-secondary">
            Monitor and manage your Family Quest platform
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <AdminStatsCards stats={stats} isLoading={isLoading} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              icon={Users}
              title="User Management"
              description="Manage users and permissions"
              color="bg-mint-green"
              onClick={() => {}}
            />
            <QuickActionCard
              icon={Target}
              title="Content Moderation"
              description="Review flagged content"
              color="bg-pale-lavender"
              onClick={() => {}}
            />
            <QuickActionCard
              icon={Activity}
              title="Analytics"
              description="View platform insights"
              color="bg-light-pink"
              onClick={() => {}}
            />
            <QuickActionCard
              icon={AlertTriangle}
              title="System Health"
              description="Monitor system status"
              color="bg-pastel-yellow"
              onClick={() => {}}
            />
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              icon={Users}
              title="New user registered"
              description="John Doe joined the platform"
              time="2 minutes ago"
              color="bg-mint-green"
            />
            <ActivityItem
              icon={Target}
              title="Goal completed"
              description="Family vacation goal reached"
              time="15 minutes ago"
              color="bg-pale-lavender"
            />
            <ActivityItem
              icon={CheckCircle}
              title="Payment processed"
              description="$500 contribution received"
              time="1 hour ago"
              color="bg-light-mint"
            />
            <ActivityItem
              icon={AlertTriangle}
              title="Content flagged"
              description="Post requires moderation"
              time="2 hours ago"
              color="bg-pastel-yellow"
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  onClick 
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="p-4 bg-pale-lavender-bg rounded-2xl hover:bg-mint-tint transition-all duration-200 text-left"
    >
      <div className={`p-3 rounded-2xl ${color} w-fit mb-3`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </motion.button>
  );
}

function ActivityItem({ 
  icon: Icon, 
  title, 
  description, 
  time, 
  color 
}: {
  icon: any;
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-text-primary">{title}</h4>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      <span className="text-xs text-text-tertiary">{time}</span>
    </div>
  );
}

function BroadcastMessagesPage() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-6">Broadcast Messages</h2>
      <div className="text-center py-12">
        <div className="text-text-secondary">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">Broadcast Messages</p>
          <p className="text-sm">Send announcements to users</p>
        </div>
      </div>
    </Card>
  );
}

function SystemSettingsPage() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-6">System Settings</h2>
      <div className="text-center py-12">
        <div className="text-text-secondary">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">System Settings</p>
          <p className="text-sm">Configure platform settings</p>
        </div>
      </div>
    </Card>
  );
}