import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  HardDrive, 
  Zap, 
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { usePerformanceDashboard, useSystemHealth, useOptimizationSuggestions } from '@/hooks/useCache';
import { cn } from '@/lib/utils';

export function PerformanceDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'optimization'>('overview');
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = usePerformanceDashboard();
  const { data: systemHealth, isLoading: healthLoading, refetch: refetchHealth } = useSystemHealth();
  const { isLoading: optimizationsLoading } = useOptimizationSuggestions();

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      refetchDashboard();
      refetchHealth();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refetchDashboard, refetchHealth]);

  const getHealthStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return { status: 'critical', color: 'text-red-500', icon: XCircle };
    if (value >= thresholds.warning) return { status: 'warning', color: 'text-yellow-500', icon: AlertTriangle };
    return { status: 'healthy', color: 'text-green-500', icon: CheckCircle };
  };

  const memoryStatus = getHealthStatus(systemHealth?.data?.memory_usage || 0, { warning: 70, critical: 90 });
  const cpuStatus = getHealthStatus(systemHealth?.data?.cpu_usage || 0, { warning: 70, critical: 90 });

  // Mock data for charts (in real app, this would come from the API)
  const responseTimeData = [
    { time: '00:00', responseTime: 120, cacheHits: 85 },
    { time: '04:00', responseTime: 95, cacheHits: 92 },
    { time: '08:00', responseTime: 150, cacheHits: 78 },
    { time: '12:00', responseTime: 180, cacheHits: 65 },
    { time: '16:00', responseTime: 140, cacheHits: 82 },
    { time: '20:00', responseTime: 110, cacheHits: 88 },
  ];

  const cacheDistributionData = [
    { name: 'API Responses', value: 45, color: '#B9F5D0' },
    { name: 'Static Assets', value: 25, color: '#E2D7FB' },
    { name: 'User Data', value: 20, color: '#F7E1F5' },
    { name: 'Configuration', value: 10, color: '#FFE9A7' },
  ];

  const optimizationData = [
    { name: 'Enable Compression', impact: 'High', effort: 'Low', improvement: 25 },
    { name: 'CDN Integration', impact: 'High', effort: 'Medium', improvement: 40 },
    { name: 'Cache Warming', impact: 'Medium', effort: 'Low', improvement: 15 },
    { name: 'Memory Optimization', impact: 'Medium', effort: 'High', improvement: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-mint-green" />
          <h2 className="text-xl font-semibold text-text-primary">Performance Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchDashboard();
              refetchHealth();
            }}
            disabled={dashboardLoading || healthLoading}
          >
            <RefreshCw className={cn("h-4 w-4", (dashboardLoading || healthLoading) && "animate-spin")} />
            Refresh
          </Button>
          <Badge variant="secondary" className="bg-mint-tint text-text-primary">
            Live
          </Badge>
        </div>
      </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'metrics' | 'optimization')} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Avg Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-primary">
                  {dashboardLoading ? '...' : `${dashboardData?.data?.cache_performance?.average_response_time?.toFixed(0) || 0}ms`}
                </div>
                <div className="flex items-center gap-1 text-xs text-text-tertiary">
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span>12% faster than yesterday</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Cache Hit Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-mint-green">
                  {dashboardLoading ? '...' : `${((dashboardData?.data?.cache_performance?.hit_rate || 0) * 100).toFixed(1)}%`}
                </div>
                <div className="flex items-center gap-1 text-xs text-text-tertiary">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span>+5% from last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-primary">
                  {healthLoading ? '...' : `${(systemHealth?.data?.memory_usage || 0).toFixed(1)}%`}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <memoryStatus.icon className={cn("h-3 w-3", memoryStatus.color)} />
                  <span className={memoryStatus.color}>
                    {memoryStatus.status === 'healthy' ? 'Healthy' : 
                     memoryStatus.status === 'warning' ? 'Warning' : 'Critical'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text-primary">
                  {healthLoading ? '...' : `${(systemHealth?.data?.cpu_usage || 0).toFixed(1)}%`}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <cpuStatus.icon className={cn("h-3 w-3", cpuStatus.color)} />
                  <span className={cpuStatus.color}>
                    {cpuStatus.status === 'healthy' ? 'Healthy' : 
                     cpuStatus.status === 'warning' ? 'Warning' : 'Critical'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card">
              <CardHeader>
                <CardTitle>Response Time Trend</CardTitle>
                <CardDescription>Average response time over the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--text-tertiary))" />
                    <YAxis stroke="hsl(var(--text-tertiary))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#B9F5D0" 
                      strokeWidth={2}
                      dot={{ fill: '#B9F5D0', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card">
              <CardHeader>
                <CardTitle>Cache Distribution</CardTitle>
                <CardDescription>Cache usage by data type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={cacheDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {cacheDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card className="card">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Memory Usage</span>
                    <span className="text-text-primary">{systemHealth?.data?.memory_usage?.toFixed(1) || 0}%</span>
                  </div>
                  <Progress 
                    value={systemHealth?.data?.memory_usage || 0} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">CPU Usage</span>
                    <span className="text-text-primary">{systemHealth?.data?.cpu_usage?.toFixed(1) || 0}%</span>
                  </div>
                  <Progress 
                    value={systemHealth?.data?.cpu_usage || 0} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Disk Usage</span>
                    <span className="text-text-primary">{systemHealth?.data?.disk_usage?.toFixed(1) || 0}%</span>
                  </div>
                  <Progress 
                    value={systemHealth?.data?.disk_usage || 0} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Network Latency</span>
                    <span className="text-text-primary">{systemHealth?.data?.network_latency?.toFixed(0) || 0}ms</span>
                  </div>
                  <Progress 
                    value={Math.min((systemHealth?.data?.network_latency || 0) / 10, 100)} 
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card className="card">
            <CardHeader>
              <CardTitle>Real-time Metrics</CardTitle>
              <CardDescription>Live performance data and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary">Detailed metrics visualization will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card className="card">
            <CardHeader>
              <CardTitle>Optimization Suggestions</CardTitle>
              <CardDescription>Recommended improvements for better performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationsLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-muted rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  optimizationData.map((optimization, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                    >
                      <Card className="card">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium text-text-primary">{optimization.name}</h4>
                              <p className="text-sm text-text-secondary">
                                Estimated improvement: {optimization.improvement}%
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="secondary" 
                                className={cn(
                                  "text-xs",
                                  optimization.impact === 'High' ? "bg-mint-green text-text-primary" :
                                  optimization.impact === 'Medium' ? "bg-pastel-yellow text-text-primary" :
                                  "bg-light-pink text-text-primary"
                                )}
                              >
                                {optimization.impact} Impact
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                {optimization.effort} Effort
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}