import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Eye,
  MousePointer,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Mail,
} from 'lucide-react';
import type { CardAnalytics as CardAnalyticsType } from '@/types/card';

interface CardAnalyticsProps {
  analytics: CardAnalyticsType;
  isLoading?: boolean;
}

const platformIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  whatsapp: MessageCircle,
  email: Mail,
};

const platformColors = {
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  whatsapp: '#25D366',
  email: '#6B7280',
};

export function CardAnalytics({ analytics, isLoading = false }: CardAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalViews = analytics.total_views;
  const totalClicks = analytics.total_clicks;
  const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

  // Prepare data for charts
  const platformData = analytics.platform_breakdown.map(platform => ({
    platform: platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1),
    views: platform.views,
    clicks: platform.clicks,
    ctr: platform.views > 0 ? (platform.clicks / platform.views) * 100 : 0,
  }));

  const dailyData = analytics.daily_stats.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: day.views,
    clicks: day.clicks,
  }));

  const pieData = analytics.platform_breakdown.map(platform => ({
    name: platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1),
    value: platform.views,
    color: platformColors[platform.platform as keyof typeof platformColors] || '#6B7280',
  }));

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <MousePointer className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click-Through Rate</p>
                <p className="text-2xl font-bold text-gray-900">{clickThroughRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platforms</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.platform_breakdown.length}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Share2 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>
            Views and clicks breakdown by sharing platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.platform_breakdown.map((platform) => {
              const Icon = platformIcons[platform.platform as keyof typeof platformIcons] || Share2;
              const color = platformColors[platform.platform as keyof typeof platformColors] || '#6B7280';
              const ctr = platform.views > 0 ? (platform.clicks / platform.views) * 100 : 0;

              return (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" style={{ color }} />
                      <span className="font-medium capitalize">{platform.platform}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{platform.views} views</span>
                      <span>{platform.clicks} clicks</span>
                      <span className="font-medium">{ctr.toFixed(1)}% CTR</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Views</span>
                      <span>{platform.views}</span>
                    </div>
                    <Progress 
                      value={(platform.views / Math.max(...analytics.platform_breakdown.map(p => p.views))) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Daily Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Performance</CardTitle>
          <CardDescription>
            Views and clicks over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Views"
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Clicks"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Views by Platform</CardTitle>
            <CardDescription>
              Distribution of views across sharing platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Comparison</CardTitle>
            <CardDescription>
              Side-by-side comparison of platform performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#3B82F6" name="Views" />
                  <Bar dataKey="clicks" fill="#10B981" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key metrics and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Top Performing Platform</h4>
              {analytics.platform_breakdown.length > 0 && (
                <div className="flex items-center gap-2">
                  {(() => {
                    const topPlatform = analytics.platform_breakdown.reduce((prev, current) => 
                      prev.views > current.views ? prev : current
                    );
                    const Icon = platformIcons[topPlatform.platform as keyof typeof platformIcons] || Share2;
                    const color = platformColors[topPlatform.platform as keyof typeof platformColors] || '#6B7280';
                    
                    return (
                      <>
                        <Icon className="h-5 w-5" style={{ color }} />
                        <span className="capitalize font-medium">{topPlatform.platform}</span>
                        <Badge variant="secondary">
                          {topPlatform.views} views
                        </Badge>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Recommendations</h4>
              <div className="space-y-2 text-sm text-gray-600">
                {clickThroughRate > 5 && (
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Great engagement! Your card is performing well.
                  </p>
                )}
                {clickThroughRate < 2 && (
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Consider updating your card content to improve engagement.
                  </p>
                )}
                {analytics.platform_breakdown.length < 3 && (
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Try sharing on more platforms to reach a wider audience.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}