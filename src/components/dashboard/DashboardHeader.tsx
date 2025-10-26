import { Bell, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  familyName: string;
  balance: number;
  unreadNotifications: number;
  memberCount: number;
  onNotificationsClick: () => void;
}

export function DashboardHeader({ 
  familyName, 
  balance, 
  unreadNotifications, 
  memberCount,
  onNotificationsClick 
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Family Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Welcome back, {familyName}! 👋
          </h1>
          <p className="text-text-secondary text-lg">
            Ready to continue your family's journey? Let's check on your goals.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          {/* Balance Card */}
          <Card className="p-4 bg-mint-tint border-0 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-mint-green rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">Family Balance</p>
                <p className="text-xl font-bold text-text-primary">
                  ${balance.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Members Count */}
          <Card className="p-4 bg-pale-lavender-bg border-0 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pale-lavender rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-secondary">Members</p>
                <p className="text-xl font-bold text-text-primary">{memberCount}</p>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="lg"
            className="relative p-3 hover:bg-mint-tint transition-colors duration-200"
            onClick={onNotificationsClick}
          >
            <Bell className="h-6 w-6 text-text-primary" />
            {unreadNotifications > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 bg-light-pink text-text-primary border-0 min-w-[20px] h-5 flex items-center justify-center text-xs font-semibold"
              >
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}