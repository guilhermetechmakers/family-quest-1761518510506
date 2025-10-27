import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Cloud, 
  HardDrive,
  Shield,
  Activity
} from 'lucide-react';
import { useCacheSettings, useUpdateCacheSettings, useCDNConfig, useUpdateCDNConfig } from '@/hooks/useCache';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const cacheSettingsSchema = z.object({
  max_size: z.number().min(1).max(10000),
  default_ttl: z.number().min(60).max(86400),
  enable_compression: z.boolean(),
  enable_cdn: z.boolean(),
  cdn_provider: z.enum(['cloudflare', 'aws', 'azure', 'custom']),
  compression_level: z.number().min(1).max(9),
  auto_clear_threshold: z.number().min(0).max(100),
});

const cdnConfigSchema = z.object({
  provider: z.enum(['cloudflare', 'aws', 'azure', 'custom']),
  endpoint: z.string().url(),
  api_key: z.string().min(1),
  zone_id: z.string().optional(),
  enabled: z.boolean(),
  cache_ttl: z.number().min(60).max(86400),
  compression_enabled: z.boolean(),
});

type CacheSettingsForm = z.infer<typeof cacheSettingsSchema>;
type CDNConfigForm = z.infer<typeof cdnConfigSchema>;

export function PerformanceSettingsForm() {
  const [activeTab, setActiveTab] = useState<'cache' | 'cdn' | 'monitoring'>('cache');

  const { data: cacheSettings } = useCacheSettings();
  const { data: cdnConfig } = useCDNConfig();
  
  const updateCacheSettingsMutation = useUpdateCacheSettings();
  const updateCDNConfigMutation = useUpdateCDNConfig();

  const cacheForm = useForm<CacheSettingsForm>({
    resolver: zodResolver(cacheSettingsSchema),
    defaultValues: {
      max_size: 1000,
      default_ttl: 300,
      enable_compression: true,
      enable_cdn: false,
      cdn_provider: 'cloudflare',
      compression_level: 6,
      auto_clear_threshold: 80,
    },
  });

  const cdnForm = useForm<CDNConfigForm>({
    resolver: zodResolver(cdnConfigSchema),
    defaultValues: {
      provider: 'cloudflare',
      endpoint: '',
      api_key: '',
      zone_id: '',
      enabled: false,
      cache_ttl: 3600,
      compression_enabled: true,
    },
  });

  // Update form values when data loads
  useState(() => {
    if (cacheSettings?.data) {
      cacheForm.reset(cacheSettings.data);
    }
  });

  useState(() => {
    if (cdnConfig?.data) {
      cdnForm.reset(cdnConfig.data);
    }
  });

  const onCacheSubmit = (data: CacheSettingsForm) => {
    updateCacheSettingsMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Cache settings updated successfully');
      },
      onError: (error) => {
        toast.error(`Failed to update cache settings: ${error.message}`);
      },
    });
  };

  const onCDNSubmit = (data: CDNConfigForm) => {
    updateCDNConfigMutation.mutate(data, {
      onSuccess: () => {
        toast.success('CDN configuration updated successfully');
      },
      onError: (error) => {
        toast.error(`Failed to update CDN configuration: ${error.message}`);
      },
    });
  };

  const getPerformanceImpact = (level: number) => {
    if (level <= 3) return { label: 'Fast', color: 'bg-mint-green' };
    if (level <= 6) return { label: 'Balanced', color: 'bg-pastel-yellow' };
    return { label: 'High Compression', color: 'bg-light-pink' };
  };

  const compressionLevel = cacheForm.watch('compression_level');
  const performanceImpact = getPerformanceImpact(compressionLevel);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-mint-green" />
        <h2 className="text-xl font-semibold text-text-primary">Performance Settings</h2>
      </div>

      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('cache')}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === 'cache'
              ? "bg-card text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          Cache Settings
        </button>
        <button
          onClick={() => setActiveTab('cdn')}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === 'cdn'
              ? "bg-card text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          CDN Configuration
        </button>
        <button
          onClick={() => setActiveTab('monitoring')}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === 'monitoring'
              ? "bg-card text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          Monitoring
        </button>
      </div>

      {activeTab === 'cache' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={cacheForm.handleSubmit(onCacheSubmit)} className="space-y-6">
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Cache Configuration
                </CardTitle>
                <CardDescription>
                  Configure cache size, TTL, and optimization settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="max_size">Maximum Cache Entries</Label>
                    <Input
                      id="max_size"
                      type="number"
                      {...cacheForm.register('max_size', { valueAsNumber: true })}
                      placeholder="1000"
                    />
                    <p className="text-xs text-text-tertiary">
                      Maximum number of cache entries to store
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default_ttl">Default TTL (seconds)</Label>
                    <Input
                      id="default_ttl"
                      type="number"
                      {...cacheForm.register('default_ttl', { valueAsNumber: true })}
                      placeholder="300"
                    />
                    <p className="text-xs text-text-tertiary">
                      Time-to-live for cache entries in seconds
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="enable_compression">Enable Compression</Label>
                      <p className="text-sm text-text-tertiary">
                        Compress cache data to reduce memory usage
                      </p>
                    </div>
                    <Switch
                      id="enable_compression"
                      checked={cacheForm.watch('enable_compression')}
                      onCheckedChange={(checked) => cacheForm.setValue('enable_compression', checked)}
                    />
                  </div>

                  {cacheForm.watch('enable_compression') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pl-4 border-l-2 border-mint-green"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="compression_level">Compression Level</Label>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="1"
                            max="9"
                            step="1"
                            {...cacheForm.register('compression_level', { valueAsNumber: true })}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-text-tertiary">
                            <span>Fast</span>
                            <span>Balanced</span>
                            <span>High Compression</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn("text-xs", performanceImpact.color)}>
                              {performanceImpact.label}
                            </Badge>
                            <span className="text-sm text-text-secondary">
                              Level {compressionLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="enable_cdn">Enable CDN</Label>
                      <p className="text-sm text-text-tertiary">
                        Use Content Delivery Network for better performance
                      </p>
                    </div>
                    <Switch
                      id="enable_cdn"
                      checked={cacheForm.watch('enable_cdn')}
                      onCheckedChange={(checked) => cacheForm.setValue('enable_cdn', checked)}
                    />
                  </div>

                  {cacheForm.watch('enable_cdn') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pl-4 border-l-2 border-pale-lavender"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="cdn_provider">CDN Provider</Label>
                        <Select
                          value={cacheForm.watch('cdn_provider')}
                          onValueChange={(value) => cacheForm.setValue('cdn_provider', value as any)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cloudflare">Cloudflare</SelectItem>
                            <SelectItem value="aws">AWS CloudFront</SelectItem>
                            <SelectItem value="azure">Azure CDN</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="auto_clear_threshold">Auto Clear Threshold (%)</Label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      {...cacheForm.register('auto_clear_threshold', { valueAsNumber: true })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-text-tertiary">
                      <span>Never</span>
                      <span>50%</span>
                      <span>Always</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-light-pink text-text-primary">
                        {cacheForm.watch('auto_clear_threshold')}% threshold
                      </Badge>
                      <span className="text-sm text-text-secondary">
                        Automatically clear cache when usage exceeds this percentage
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => cacheForm.reset()}
                disabled={updateCacheSettingsMutation.isPending}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={updateCacheSettingsMutation.isPending}
                className="btn-primary"
              >
                {updateCacheSettingsMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Cache Settings
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {activeTab === 'cdn' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={cdnForm.handleSubmit(onCDNSubmit)} className="space-y-6">
            <Card className="card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  CDN Configuration
                </CardTitle>
                <CardDescription>
                  Configure Content Delivery Network settings for optimal performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="enabled">Enable CDN</Label>
                      <p className="text-sm text-text-tertiary">
                        Activate CDN for static asset delivery
                      </p>
                    </div>
                    <Switch
                      id="enabled"
                      checked={cdnForm.watch('enabled')}
                      onCheckedChange={(checked) => cdnForm.setValue('enabled', checked)}
                    />
                  </div>

                  {cdnForm.watch('enabled') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pl-4 border-l-2 border-pale-lavender"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="provider">CDN Provider</Label>
                          <Select
                            value={cdnForm.watch('provider')}
                            onValueChange={(value) => cdnForm.setValue('provider', value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cloudflare">Cloudflare</SelectItem>
                              <SelectItem value="aws">AWS CloudFront</SelectItem>
                              <SelectItem value="azure">Azure CDN</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cache_ttl">Cache TTL (seconds)</Label>
                          <Input
                            id="cache_ttl"
                            type="number"
                            {...cdnForm.register('cache_ttl', { valueAsNumber: true })}
                            placeholder="3600"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endpoint">CDN Endpoint</Label>
                        <Input
                          id="endpoint"
                          {...cdnForm.register('endpoint')}
                          placeholder="https://cdn.example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="api_key">API Key</Label>
                        <Input
                          id="api_key"
                          type="password"
                          {...cdnForm.register('api_key')}
                          placeholder="Your CDN API key"
                        />
                      </div>

                      {cdnForm.watch('provider') === 'cloudflare' && (
                        <div className="space-y-2">
                          <Label htmlFor="zone_id">Zone ID (Cloudflare)</Label>
                          <Input
                            id="zone_id"
                            {...cdnForm.register('zone_id')}
                            placeholder="Your Cloudflare Zone ID"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="compression_enabled">Enable Compression</Label>
                          <p className="text-sm text-text-tertiary">
                            Compress assets before CDN delivery
                          </p>
                        </div>
                        <Switch
                          id="compression_enabled"
                          checked={cdnForm.watch('compression_enabled')}
                          onCheckedChange={(checked) => cdnForm.setValue('compression_enabled', checked)}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => cdnForm.reset()}
                disabled={updateCDNConfigMutation.isPending}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={updateCDNConfigMutation.isPending}
                className="btn-primary"
              >
                {updateCDNConfigMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save CDN Configuration
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {activeTab === 'monitoring' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Performance Monitoring
              </CardTitle>
              <CardDescription>
                Monitor cache performance and system health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <p className="text-text-secondary">Monitoring configuration will be available here</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}