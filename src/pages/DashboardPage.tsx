import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGoals } from '@/hooks/useGoals';
import { useCurrentUser } from '@/hooks/useAuth';
import { 
  Plus, 
  Target, 
  Users, 
  TrendingUp, 
  Settings,
  DollarSign,
  Calendar,
  Star,
  ArrowRight,
  Search
} from 'lucide-react';
import { formatCurrency, calculateProgress } from '@/lib/utils';

export function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  
  const { data: user } = useCurrentUser();
  const { data: goals, isLoading } = useGoals();

  const filteredGoals = goals?.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || goal.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  const stats = {
    totalGoals: goals?.length || 0,
    activeGoals: goals?.filter(g => g.status === 'active').length || 0,
    completedGoals: goals?.filter(g => g.status === 'completed').length || 0,
    totalContributions: goals?.reduce((sum, goal) => sum + goal.current_value, 0) || 0,
  };

  const recentActivities = [
    {
      id: '1',
      type: 'contribution',
      user: 'Sarah Johnson',
      action: 'contributed $50 to',
      goal: 'Family Vacation Fund',
      time: '2 hours ago',
      amount: 50
    },
    {
      id: '2',
      type: 'milestone',
      user: 'Mike Chen',
      action: 'reached 50% of',
      goal: 'New Car Fund',
      time: '1 day ago',
      amount: null
    },
    {
      id: '3',
      type: 'goal',
      user: 'Emily Rodriguez',
      action: 'created a new goal:',
      goal: 'Home Renovation',
      time: '3 days ago',
      amount: null
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Family'}! 👋
          </h2>
          <p className="text-text-secondary">
            Ready to continue your family's journey? Let's check on your goals.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-mint-tint">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Total Goals</p>
                <p className="text-2xl font-bold text-text-primary">{stats.totalGoals}</p>
              </div>
              <Target className="h-8 w-8 text-mint-green" />
            </div>
          </Card>

          <Card className="p-6 bg-pale-lavender-bg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Active Goals</p>
                <p className="text-2xl font-bold text-text-primary">{stats.activeGoals}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-pale-lavender" />
            </div>
          </Card>

          <Card className="p-6 bg-pastel-yellow bg-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Completed</p>
                <p className="text-2xl font-bold text-text-primary">{stats.completedGoals}</p>
              </div>
              <Star className="h-8 w-8 text-pastel-yellow" />
            </div>
          </Card>

          <Card className="p-6 bg-light-pink bg-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Total Raised</p>
                <p className="text-2xl font-bold text-text-primary">
                  {formatCurrency(stats.totalContributions)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-light-pink" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">Your Goals</h3>
              <Link to="/goals/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              </Link>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search goals..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-mint-green focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                {['all', 'active', 'completed'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status as any)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Goals List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                    </Card>
                  ))}
                </div>
              ) : filteredGoals.length === 0 ? (
                <Card className="p-8 text-center">
                  <Target className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {searchQuery ? 'No goals found' : 'No goals yet'}
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms'
                      : 'Create your first family goal to get started!'
                    }
                  </p>
                  {!searchQuery && (
                    <Link to="/goals/create">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Goal
                      </Button>
                    </Link>
                  )}
                </Card>
              ) : (
                filteredGoals.map((goal) => (
                  <Card key={goal.id} className="p-6 hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-text-primary mb-2">
                          {goal.title}
                        </h4>
                        <p className="text-text-secondary text-sm mb-3">
                          {goal.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-text-tertiary">
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatCurrency(goal.current_value)} / {formatCurrency(goal.target_value)}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {goal.estimated_completion ? new Date(goal.estimated_completion).toLocaleDateString() : 'No deadline'}
                          </span>
                        </div>
                      </div>
                      <span className={`status-tag ${
                        goal.status === 'completed' ? 'status-completed' :
                        goal.status === 'active' ? 'status-in-progress' :
                        'status-upcoming'
                      }`}>
                        {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-text-secondary mb-2">
                        <span>{calculateProgress(goal.current_value, goal.target_value).toFixed(1)}% complete</span>
                        <span>{goal.contributors?.length || 0} contributors</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-mint-green h-3 rounded-full transition-all duration-500"
                          style={{ width: `${calculateProgress(goal.current_value, goal.target_value)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {goal.contributors?.slice(0, 3).map((contributor, index) => (
                            <div 
                              key={index}
                              className="w-8 h-8 bg-pale-lavender rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold"
                            >
                              {contributor.user?.full_name?.charAt(0) || 'U'}
                            </div>
                          ))}
                        </div>
                        {goal.contributors && goal.contributors.length > 3 && (
                          <span className="text-sm text-text-tertiary">
                            +{goal.contributors.length - 3} more
                          </span>
                        )}
                      </div>
                      <Link to={`/goals/${goal.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-mint-green rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-text-primary">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action}{' '}
                        <span className="font-medium">{activity.goal}</span>
                        {activity.amount && (
                          <span className="text-mint-green font-semibold"> ${activity.amount}</span>
                        )}
                      </p>
                      <p className="text-xs text-text-tertiary">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/activity" className="block mt-4 text-center">
                <Button variant="ghost" size="sm">
                  View All Activity
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/goals/create" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Goal
                  </Button>
                </Link>
                <Link to="/activity" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Invite Family Member
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Family Settings
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
}