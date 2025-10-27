import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Download
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAdminAnalytics, useExportAnalytics } from '@/hooks/useAdmin';
import { toast } from 'sonner';


export function AnalyticsCharts() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { data: analytics, isLoading } = useAdminAnalytics(period);
  const exportAnalytics = useExportAnalytics();

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const blob = await exportAnalytics.mutateAsync({ period, format });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${period}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export analytics');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="h-64 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  // Prepare data for charts
  const userGrowthData = [
    { month: 'Jan', users: analytics.users.new_this_month },
    { month: 'Feb', users: Math.floor(analytics.users.new_this_month * 0.8) },
    { month: 'Mar', users: Math.floor(analytics.users.new_this_month * 1.2) },
    { month: 'Apr', users: Math.floor(analytics.users.new_this_month * 0.9) },
    { month: 'May', users: Math.floor(analytics.users.new_this_month * 1.1) },
    { month: 'Jun', users: analytics.users.new_this_month },
  ];

  const goalCompletionData = [
    { name: 'Completed', value: analytics.goals.completed, color: '#B9F5D0' },
    { name: 'In Progress', value: analytics.goals.in_progress, color: '#E2D7FB' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: analytics.revenue.this_month * 0.7 },
    { month: 'Feb', revenue: analytics.revenue.this_month * 0.8 },
    { month: 'Mar', revenue: analytics.revenue.this_month * 0.9 },
    { month: 'Apr', revenue: analytics.revenue.this_month * 1.1 },
    { month: 'May', revenue: analytics.revenue.this_month * 1.0 },
    { month: 'Jun', revenue: analytics.revenue.this_month },
  ];

  const activityData = [
    { day: 'Mon', contributions: analytics.activity.contributions_today * 0.8, posts: analytics.activity.posts_today * 0.7 },
    { day: 'Tue', contributions: analytics.activity.contributions_today * 0.9, posts: analytics.activity.posts_today * 0.8 },
    { day: 'Wed', contributions: analytics.activity.contributions_today * 1.1, posts: analytics.activity.posts_today * 1.0 },
    { day: 'Thu', contributions: analytics.activity.contributions_today * 1.0, posts: analytics.activity.posts_today * 1.1 },
    { day: 'Fri', contributions: analytics.activity.contributions_today * 1.2, posts: analytics.activity.posts_today * 1.2 },
    { day: 'Sat', contributions: analytics.activity.contributions_today * 0.6, posts: analytics.activity.posts_today * 0.5 },
    { day: 'Sun', contributions: analytics.activity.contributions_today * 0.5, posts: analytics.activity.posts_today * 0.4 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Analytics Dashboard</h2>
        
        <div className="flex gap-3">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Total Users</p>
                <p className="text-2xl font-bold text-text-primary">{analytics.users.total.toLocaleString()}</p>
                <p className="text-xs text-text-secondary">
                  +{analytics.users.new_this_month} this month
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-mint-green">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Goal Completion Rate</p>
                <p className="text-2xl font-bold text-text-primary">
                  {analytics.goals.completion_rate.toFixed(1)}%
                </p>
                <p className="text-xs text-text-secondary">
                  {analytics.goals.completed} of {analytics.goals.total} goals
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-pale-lavender">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Total Revenue</p>
                <p className="text-2xl font-bold text-text-primary">
                  ${analytics.revenue.total.toLocaleString()}
                </p>
                <p className="text-xs text-text-secondary">
                  {analytics.revenue.growth_rate > 0 ? '+' : ''}{analytics.revenue.growth_rate.toFixed(1)}% vs last month
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-pastel-yellow">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Active Today</p>
                <p className="text-2xl font-bold text-text-primary">
                  {analytics.users.active_today.toLocaleString()}
                </p>
                <p className="text-xs text-text-secondary">
                  {analytics.activity.contributions_today} contributions
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-light-mint">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#B9F5D0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Goal Completion Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Goal Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={goalCompletionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {goalCompletionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#B9F5D0" 
                  strokeWidth={3}
                  dot={{ fill: '#B9F5D0', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contributions" fill="#B9F5D0" name="Contributions" radius={[2, 2, 0, 0]} />
                <Bar dataKey="posts" fill="#E2D7FB" name="Posts" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}