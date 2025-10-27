import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Users, 
  Target, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import type { AdminDashboardStats } from '@/types/admin';

interface AdminStatsCardsProps {
  stats: AdminDashboardStats;
  isLoading?: boolean;
}

const statCards = [
  {
    key: 'total_users' as keyof AdminDashboardStats,
    label: 'Total Users',
    icon: Users,
    color: 'bg-mint-green',
    textColor: 'text-text-primary',
  },
  {
    key: 'active_users_today' as keyof AdminDashboardStats,
    label: 'Active Today',
    icon: TrendingUp,
    color: 'bg-light-mint',
    textColor: 'text-text-primary',
  },
  {
    key: 'total_goals' as keyof AdminDashboardStats,
    label: 'Total Goals',
    icon: Target,
    color: 'bg-pale-lavender',
    textColor: 'text-text-primary',
  },
  {
    key: 'completed_goals' as keyof AdminDashboardStats,
    label: 'Completed Goals',
    icon: Target,
    color: 'bg-light-pink',
    textColor: 'text-text-primary',
  },
  {
    key: 'total_revenue' as keyof AdminDashboardStats,
    label: 'Total Revenue',
    icon: DollarSign,
    color: 'bg-pastel-yellow',
    textColor: 'text-text-primary',
  },
  {
    key: 'pending_moderations' as keyof AdminDashboardStats,
    label: 'Pending Moderation',
    icon: Shield,
    color: 'bg-light-purple',
    textColor: 'text-text-primary',
  },
  {
    key: 'failed_transactions' as keyof AdminDashboardStats,
    label: 'Failed Transactions',
    icon: AlertTriangle,
    color: 'bg-red-100',
    textColor: 'text-red-800',
  },
];

export function AdminStatsCards({ stats, isLoading }: AdminStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 7 }).map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const value = stats[card.key];
        const isRevenue = card.key === 'total_revenue';
        const isFailed = card.key === 'failed_transactions';
        
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-text-secondary">{card.label}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {isRevenue ? `$${value?.toLocaleString()}` : value?.toLocaleString()}
                  </p>
                  {isFailed && value && value > 0 && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      Needs attention
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-2xl ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}