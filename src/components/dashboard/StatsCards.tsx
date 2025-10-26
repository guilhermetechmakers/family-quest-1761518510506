import { Target, TrendingUp, Star, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface StatsCardsProps {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalContributions: number;
}

export function StatsCards({ 
  totalGoals, 
  activeGoals, 
  completedGoals, 
  totalContributions 
}: StatsCardsProps) {
  const stats = [
    {
      id: 'total',
      label: 'Total Goals',
      value: totalGoals,
      icon: Target,
      bgColor: 'bg-mint-tint',
      iconColor: 'text-mint-green',
      delay: 0.1
    },
    {
      id: 'active',
      label: 'Active Goals',
      value: activeGoals,
      icon: TrendingUp,
      bgColor: 'bg-pale-lavender-bg',
      iconColor: 'text-pale-lavender',
      delay: 0.2
    },
    {
      id: 'completed',
      label: 'Completed',
      value: completedGoals,
      icon: Star,
      bgColor: 'bg-pastel-yellow bg-opacity-30',
      iconColor: 'text-pastel-yellow',
      delay: 0.3
    },
    {
      id: 'contributions',
      label: 'Total Raised',
      value: `$${totalContributions.toLocaleString()}`,
      icon: DollarSign,
      bgColor: 'bg-light-pink bg-opacity-30',
      iconColor: 'text-light-pink',
      delay: 0.4
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: stat.delay,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          <Card className={`p-6 ${stat.bgColor} border-0 shadow-card hover:shadow-card-hover transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.iconColor.replace('text-', 'bg-').replace('-green', '-green').replace('-lavender', '-lavender').replace('-yellow', '-yellow').replace('-pink', '-pink')} bg-opacity-20 rounded-full flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}