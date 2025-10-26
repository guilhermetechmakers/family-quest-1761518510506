import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  Users,
  Settings,
  DollarSign,
  Target,
  UserPlus,
  CheckSquare,
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickActionsProps {
  onQuickContribute: () => void;
  onAddChore: () => void;
  onInviteMember: () => void;
}

export function QuickActions({ 
  onQuickContribute, 
  onAddChore, 
  onInviteMember 
}: QuickActionsProps) {
  const actions = [
    {
      id: 'create-goal',
      label: 'Create New Goal',
      description: 'Start a new family goal',
      icon: Plus,
      color: 'bg-mint-green',
      hoverColor: 'hover:bg-light-mint',
      link: '/goals/create',
      isLink: true
    },
    {
      id: 'quick-contribute',
      label: 'Quick Contribute',
      description: 'Add money to a goal',
      icon: DollarSign,
      color: 'bg-pale-lavender',
      hoverColor: 'hover:bg-light-purple',
      onClick: onQuickContribute,
      isLink: false
    },
    {
      id: 'add-chore',
      label: 'Add Chore',
      description: 'Log completed chores',
      icon: CheckSquare,
      color: 'bg-pastel-yellow',
      hoverColor: 'hover:bg-pastel-yellow hover:bg-opacity-80',
      onClick: onAddChore,
      isLink: false
    },
    {
      id: 'invite-member',
      label: 'Invite Member',
      description: 'Add family members',
      icon: UserPlus,
      color: 'bg-light-pink',
      hoverColor: 'hover:bg-light-pink hover:bg-opacity-80',
      onClick: onInviteMember,
      isLink: false
    },
    {
      id: 'family-settings',
      label: 'Family Settings',
      description: 'Manage family preferences',
      icon: Settings,
      color: 'bg-light-purple',
      hoverColor: 'hover:bg-light-purple hover:bg-opacity-80',
      link: '/settings',
      isLink: true
    },
    {
      id: 'share-progress',
      label: 'Share Progress',
      description: 'Share milestone cards',
      icon: Share2,
      color: 'bg-light-mint',
      hoverColor: 'hover:bg-mint-green',
      link: '/activity',
      isLink: true
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="p-6 border-0 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
          <div className="w-8 h-8 bg-pale-lavender-bg rounded-full flex items-center justify-center">
            <Target className="h-4 w-4 text-pale-lavender" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            
            const buttonContent = (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`w-full p-4 rounded-2xl ${action.color} ${action.hoverColor} transition-all duration-200 group cursor-pointer`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="h-5 w-5 text-text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-text-primary truncate">
                      {action.label}
                    </h4>
                    <p className="text-xs text-text-primary text-opacity-80 truncate">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );

            if (action.isLink && action.link) {
              return (
                <Link key={action.id} to={action.link}>
                  {buttonContent}
                </Link>
              );
            }

            return (
              <div key={action.id} onClick={action.onClick}>
                {buttonContent}
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-mint-tint rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-mint-green rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                Need help getting started?
              </p>
              <p className="text-xs text-text-secondary">
                Check out our guide to creating your first family goal
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-mint-green hover:text-text-primary hover:bg-white hover:bg-opacity-30"
            >
              Learn More
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}