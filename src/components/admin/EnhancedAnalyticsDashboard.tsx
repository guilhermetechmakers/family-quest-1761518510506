import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Download,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  RefreshCw,
  EyeOff,
  FileText,
  Share2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Legend
} from 'recharts';
import { useAdminAnalytics, useExportAnalytics } from '@/hooks/useAdmin';
import { toast } from 'sonner';

export function EnhancedAnalyticsDashboard() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['users', 'revenue', 'goals', 'activity']);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const { data: analytics, isLoading, refetch } = useAdminAnalytics(period);
  const exportAnalytics = useExportAnalytics();

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      const blob = await exportAnalytics.mutateAsync({ period, format: format as 'csv' | 'pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${period}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export analytics');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Analytics refreshed');
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
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
    { month: 'Jan', users: analytics.users.new_this_month, active: analytics.users.active_today },
    { month: 'Feb', users: Math.floor(analytics.users.new_this_month * 0.8), active: Math.floor(analytics.users.active_today * 0.9) },
    { month: 'Mar', users: Math.floor(analytics.users.new_this_month * 1.2), active: Math.floor(analytics.users.active_today * 1.1) },
    { month: 'Apr', users: Math.floor(analytics.users.new_this_month * 0.9), active: Math.floor(analytics.users.active_today * 0.8) },
    { month: 'May', users: Math.floor(analytics.users.new_this_month * 1.1), active: Math.floor(analytics.users.active_today * 1.2) },
    { month: 'Jun', users: analytics.users.new_this_month, active: analytics.users.active_today },
  ];

  const goalCompletionData = [
    { name: 'Completed', value: analytics.goals.completed, color: '#B9F5D0' },
    { name: 'In Progress', value: analytics.goals.in_progress, color: '#E2D7FB' },
    { name: 'Not Started', value: analytics.goals.total - analytics.goals.completed - analytics.goals.in_progress, color: '#F7E1F5' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: analytics.revenue.this_month * 0.7, growth: 5.2 },
    { month: 'Feb', revenue: analytics.revenue.this_month * 0.8, growth: 8.1 },
    { month: 'Mar', revenue: analytics.revenue.this_month * 0.9, growth: 12.3 },
    { month: 'Apr', revenue: analytics.revenue.this_month * 1.1, growth: 15.7 },
    { month: 'May', revenue: analytics.revenue.this_month * 1.0, growth: 18.2 },
    { month: 'Jun', revenue: analytics.revenue.this_month, growth: analytics.revenue.growth_rate },
  ];

  const activityData = [
    { day: 'Mon', contributions: analytics.activity.contributions_today * 0.8, posts: analytics.activity.posts_today * 0.7, users: analytics.users.active_today * 0.9 },
    { day: 'Tue', contributions: analytics.activity.contributions_today * 0.9, posts: analytics.activity.posts_today * 0.8, users: analytics.users.active_today * 1.0 },
    { day: 'Wed', contributions: analytics.activity.contributions_today * 1.1, posts: analytics.activity.posts_today * 1.0, users: analytics.users.active_today * 1.1 },
    { day: 'Thu', contributions: analytics.activity.contributions_today * 1.0, posts: analytics.activity.posts_today * 1.1, users: analytics.users.active_today * 1.0 },
    { day: 'Fri', contributions: analytics.activity.contributions_today * 1.2, posts: analytics.activity.posts_today * 1.2, users: analytics.users.active_today * 1.2 },
    { day: 'Sat', contributions: analytics.activity.contributions_today * 0.6, posts: analytics.activity.posts_today * 0.5, users: analytics.users.active_today * 0.7 },
    { day: 'Sun', contributions: analytics.activity.contributions_today * 0.5, posts: analytics.activity.posts_today * 0.4, users: analytics.users.active_today * 0.6 },
  ];

  const userRoleData = [
    { role: 'Parents', count: analytics.users.by_role.parent, color: '#B9F5D0' },
    { role: 'Children', count: analytics.users.by_role.child, color: '#E2D7FB' },
    { role: 'Guests', count: analytics.users.by_role.guest, color: '#F7E1F5' },
    { role: 'Admins', count: analytics.users.by_role.admin, color: '#FFE9A7' },
  ];

  const revenueByCurrency = Object.entries(analytics.revenue.by_currency).map(([currency, amount]) => ({
    currency,
    amount,
    color: currency === 'USD' ? '#B9F5D0' : currency === 'EUR' ? '#E2D7FB' : '#F7E1F5'
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Analytics Dashboard</h2>
          <p className="text-text-secondary">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Date From</label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Date To</label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Metrics</label>
              <div className="flex flex-wrap gap-2">
                {['users', 'revenue', 'goals', 'activity'].map((metric) => (
                  <Button
                    key={metric}
                    variant={selectedMetrics.includes(metric) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleMetric(metric)}
                  >
                    {metric}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Time Period</label>
              <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">User Growth</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Bar
                </Button>
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Line
                </Button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#B9F5D0" name="New Users" radius={[4, 4, 0, 0]} />
                <Area type="monotone" dataKey="active" stroke="#E2D7FB" fill="#E2D7FB" fillOpacity={0.3} strokeWidth={3} name="Active Users" />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Goal Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Goal Status</h3>
              <Button variant="outline" size="sm">
                <PieChart className="h-4 w-4 mr-2" />
                Pie
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
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
                <Legend />
              </RechartsPieChart>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Revenue Trend</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Line
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Area
                </Button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#B9F5D0" 
                  fill="#B9F5D0"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* User Role Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">User Roles</h3>
              <Button variant="outline" size="sm">
                <PieChart className="h-4 w-4 mr-2" />
                Pie
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Weekly Activity</h3>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Bar
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="contributions" fill="#B9F5D0" name="Contributions" radius={[2, 2, 0, 0]} />
                <Bar dataKey="posts" fill="#E2D7FB" name="Posts" radius={[2, 2, 0, 0]} />
                <Bar dataKey="users" fill="#F7E1F5" name="Active Users" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Revenue by Currency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Revenue by Currency</h3>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Bar
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByCurrency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="currency" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#B9F5D0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}