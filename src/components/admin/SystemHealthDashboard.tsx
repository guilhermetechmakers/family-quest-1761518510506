import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Server, 
  Database, 
  CreditCard, 
  Mail, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useSystemHealth } from '@/hooks/useAdmin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SystemHealthDashboard() {
  const [refreshInterval, setRefreshInterval] = useState<'30s' | '1m' | '5m' | '10m'>('1m');
  const [showDetails, setShowDetails] = useState(false);

  const { data: health, isLoading, refetch } = useSystemHealth();

  const handleRefresh = () => {
    refetch();
    toast.success('System health refreshed');
  };

  const getStatusIcon = (status: 'up' | 'down') => {
    return status === 'up' ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getStatusColor = (status: 'up' | 'down') => {
    return status === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getOverallStatusColor = (status: 'healthy' | 'degraded' | 'down') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'down':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getOverallStatusIcon = (status: 'healthy' | 'degraded' | 'down') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5" />;
      case 'down':
        return <XCircle className="h-5 w-5" />;
    }
  };

  const getTrendIcon = (value: number, threshold: number) => {
    if (value > threshold) return <TrendingUp className="h-4 w-4 text-red-600" />;
    if (value < threshold * 0.5) return <TrendingDown className="h-4 w-4 text-green-600" />;
    return <Minus className="h-4 w-4 text-yellow-600" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="h-32 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!health) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">System Health</h2>
          <p className="text-text-secondary">Monitor system performance and service status</p>
        </div>
        <div className="flex gap-2">
          <Select value={refreshInterval} onValueChange={(value: any) => setRefreshInterval(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30s">30 seconds</SelectItem>
              <SelectItem value="1m">1 minute</SelectItem>
              <SelectItem value="5m">5 minutes</SelectItem>
              <SelectItem value="10m">10 minutes</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showDetails ? 'Hide' : 'Show'} Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Configure Alerts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Overall System Status</h3>
          <Badge className={cn("flex items-center gap-1 w-fit", getOverallStatusColor(health.status))}>
            {getOverallStatusIcon(health.status)}
            {health.status.toUpperCase()}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-mint-tint rounded-lg">
            <div className="text-2xl font-bold text-text-primary">
              {health.metrics.uptime_percentage.toFixed(1)}%
            </div>
            <div className="text-sm text-text-secondary">Uptime</div>
          </div>
          <div className="text-center p-4 bg-pale-lavender-bg rounded-lg">
            <div className="text-2xl font-bold text-text-primary">
              {health.metrics.response_time_ms}ms
            </div>
            <div className="text-sm text-text-secondary">Response Time</div>
          </div>
          <div className="text-center p-4 bg-light-pink rounded-lg">
            <div className="text-2xl font-bold text-text-primary">
              {health.metrics.error_rate.toFixed(2)}%
            </div>
            <div className="text-sm text-text-secondary">Error Rate</div>
          </div>
        </div>
      </Card>

      {/* Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-text-secondary" />
                <span className="font-medium text-text-primary">Database</span>
              </div>
              {getStatusIcon(health.services.database)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Status</span>
                <Badge className={getStatusColor(health.services.database)}>
                  {health.services.database}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Response Time</span>
                <span className="text-sm text-text-primary">45ms</span>
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-text-secondary" />
                <span className="font-medium text-text-primary">Redis Cache</span>
              </div>
              {getStatusIcon(health.services.redis)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Status</span>
                <Badge className={getStatusColor(health.services.redis)}>
                  {health.services.redis}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Memory Usage</span>
                <span className="text-sm text-text-primary">78%</span>
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-text-secondary" />
                <span className="font-medium text-text-primary">Payment Gateway</span>
              </div>
              {getStatusIcon(health.services.payment_gateway)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Status</span>
                <Badge className={getStatusColor(health.services.payment_gateway)}>
                  {health.services.payment_gateway}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Success Rate</span>
                <span className="text-sm text-text-primary">99.8%</span>
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-text-secondary" />
                <span className="font-medium text-text-primary">Email Service</span>
              </div>
              {getStatusIcon(health.services.email_service)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Status</span>
                <Badge className={getStatusColor(health.services.email_service)}>
                  {health.services.email_service}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Queue Size</span>
                <span className="text-sm text-text-primary">12</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">Response Time</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(health.metrics.response_time_ms, 1000)}
                <span className="text-sm text-text-primary">{health.metrics.response_time_ms}ms</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-mint-green h-2 rounded-full" 
                style={{ width: `${Math.min((health.metrics.response_time_ms / 1000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-text-secondary">
              Target: &lt;1000ms
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">Error Rate</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(health.metrics.error_rate, 1)}
                <span className="text-sm text-text-primary">{health.metrics.error_rate.toFixed(2)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${Math.min(health.metrics.error_rate * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-text-secondary">
              Target: &lt;1%
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">Uptime</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(health.metrics.uptime_percentage, 99)}
                <span className="text-sm text-text-primary">{health.metrics.uptime_percentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${health.metrics.uptime_percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-text-secondary">
              Target: &gt;99%
            </p>
          </div>
        </div>
      </Card>

      {/* Detailed Metrics */}
      {showDetails && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Detailed Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">System Resources</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">CPU Usage</span>
                  <span className="text-sm text-text-primary">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Memory Usage</span>
                  <span className="text-sm text-text-primary">67%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Disk Usage</span>
                  <span className="text-sm text-text-primary">23%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Network I/O</span>
                  <span className="text-sm text-text-primary">125 MB/s</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-text-primary">Application Metrics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Active Users</span>
                  <span className="text-sm text-text-primary">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Requests/min</span>
                  <span className="text-sm text-text-primary">2,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Cache Hit Rate</span>
                  <span className="text-sm text-text-primary">94.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Queue Length</span>
                  <span className="text-sm text-text-primary">8</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Alerts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">High Response Time</p>
              <p className="text-xs text-text-secondary">Response time exceeded 1000ms threshold</p>
            </div>
            <span className="text-xs text-text-secondary">2 minutes ago</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Service Restored</p>
              <p className="text-xs text-text-secondary">Email service is back online</p>
            </div>
            <span className="text-xs text-text-secondary">15 minutes ago</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Clock className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Scheduled Maintenance</p>
              <p className="text-xs text-text-secondary">Database maintenance completed successfully</p>
            </div>
            <span className="text-xs text-text-secondary">1 hour ago</span>
          </div>
        </div>
      </Card>
    </div>
  );
}