import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  Download, 
  Settings,
  BarChart3,
  Clock,
  HardDrive,
  Zap
} from 'lucide-react';
import { useCacheMetadata, useCacheStats, useClearCache, useBulkCacheOperation } from '@/hooks/useCache';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CacheManagementDialogProps {
  children: React.ReactNode;
}

export function CacheManagementDialog({ children }: CacheManagementDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: cacheStats, isLoading: statsLoading } = useCacheStats();
  const { data: cacheMetadata, isLoading: metadataLoading } = useCacheMetadata();
  const clearCacheMutation = useClearCache();
  const bulkOperationMutation = useBulkCacheOperation();

  const handleClearCache = () => {
    clearCacheMutation.mutate(undefined, {
      onSuccess: () => {
        setSelectedKeys([]);
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedKeys.length === 0) return;
    
    bulkOperationMutation.mutate({
      operation: 'delete',
      keys: selectedKeys
    }, {
      onSuccess: () => {
        setSelectedKeys([]);
      }
    });
  };

  const handleBulkInvalidate = () => {
    if (selectedKeys.length === 0) return;
    
    bulkOperationMutation.mutate({
      operation: 'invalidate',
      keys: selectedKeys
    }, {
      onSuccess: () => {
        setSelectedKeys([]);
      }
    });
  };

  const filteredMetadata = cacheMetadata?.data?.filter(item =>
    item.cache_key.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-mint-green" />
            Cache Management
          </DialogTitle>
          <DialogDescription>
            Monitor and manage your application's cache performance and storage.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="entries">Cache Entries</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-text-secondary">
                    Total Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-text-primary">
                    {statsLoading ? '...' : cacheStats?.data?.total_entries || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-text-secondary">
                    Cache Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-text-primary">
                    {statsLoading ? '...' : `${((cacheStats?.data?.total_size || 0) / 1024 / 1024).toFixed(1)} MB`}
                  </div>
                </CardContent>
              </Card>

              <Card className="card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-text-secondary">
                    Hit Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-mint-green">
                    {statsLoading ? '...' : `${((cacheStats?.data?.hit_rate || 0) * 100).toFixed(1)}%`}
                  </div>
                </CardContent>
              </Card>

              <Card className="card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-text-secondary">
                    Avg Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-text-primary">
                    {statsLoading ? '...' : `${(cacheStats?.data?.average_response_time || 0).toFixed(0)}ms`}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Cache Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Memory Usage</span>
                    <Badge variant="secondary" className="bg-mint-tint text-text-primary">
                      {statsLoading ? '...' : `${((cacheStats?.data?.memory_usage || 0) / 1024 / 1024).toFixed(1)} MB`}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Last Cleared</span>
                    <span className="text-sm text-text-tertiary">
                      {statsLoading ? '...' : formatDistanceToNow(new Date(cacheStats?.data?.last_cleared || Date.now()), { addSuffix: true })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    onClick={handleClearCache}
                    disabled={clearCacheMutation.isPending}
                    className="w-full btn-primary"
                  >
                    {clearCacheMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Clear All Cache
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full btn-outline"
                    disabled={bulkOperationMutation.isPending}
                  >
                    <Download className="h-4 w-4" />
                    Export Cache Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="entries" className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <Input
                  placeholder="Search cache entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">
                  {filteredMetadata.length} entries
                </span>
                {selectedKeys.length > 0 && (
                  <Badge variant="secondary" className="bg-light-pink text-text-primary">
                    {selectedKeys.length} selected
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkInvalidate}
                  disabled={selectedKeys.length === 0 || bulkOperationMutation.isPending}
                >
                  <RefreshCw className="h-4 w-4" />
                  Invalidate Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={selectedKeys.length === 0 || bulkOperationMutation.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>

            <div className="h-96 overflow-y-auto">
              <div className="space-y-2">
                {metadataLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Card key={i} className="card animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredMetadata.length === 0 ? (
                  <Card className="card">
                    <CardContent className="p-8 text-center">
                      <HardDrive className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                      <p className="text-text-secondary">No cache entries found</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredMetadata.map((entry) => (
                    <motion.div
                      key={entry.cache_key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className={cn(
                        "card card-hover cursor-pointer",
                        selectedKeys.includes(entry.cache_key) && "ring-2 ring-mint-green"
                      )}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <input
                                  type="checkbox"
                                  checked={selectedKeys.includes(entry.cache_key)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedKeys([...selectedKeys, entry.cache_key]);
                                    } else {
                                      setSelectedKeys(selectedKeys.filter(key => key !== entry.cache_key));
                                    }
                                  }}
                                  className="rounded border-border"
                                />
                                <code className="text-sm font-mono text-text-primary truncate">
                                  {entry.cache_key}
                                </code>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-text-tertiary">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(new Date(entry.last_accessed), { addSuffix: true })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <HardDrive className="h-3 w-3" />
                                  {(entry.data_size / 1024).toFixed(1)} KB
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {entry.hit_count} hits
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="secondary" 
                                className={cn(
                                  "text-xs",
                                  new Date(entry.expiration_time) > new Date() 
                                    ? "bg-mint-tint text-text-primary" 
                                    : "bg-pastel-yellow text-text-primary"
                                )}
                              >
                                {new Date(entry.expiration_time) > new Date() ? 'Active' : 'Expired'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="card">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Real-time performance monitoring and optimization suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                  <p className="text-text-secondary">Performance charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="card">
              <CardHeader>
                <CardTitle>Cache Settings</CardTitle>
                <CardDescription>
                  Configure cache behavior and optimization settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                  <p className="text-text-secondary">Settings configuration will be available here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}