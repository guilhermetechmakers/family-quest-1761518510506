import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  User, 
  Users, 
  Bell, 
  CreditCard, 
  Shield, 
  Palette,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { FamilySettings } from '@/components/settings/FamilySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PaymentSettings } from '@/components/settings/PaymentSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { AppPreferences } from '@/components/settings/AppPreferences';

type SettingsSection = 
  | 'account' 
  | 'family' 
  | 'notifications' 
  | 'payments' 
  | 'privacy' 
  | 'preferences';

const settingsSections = [
  {
    id: 'account' as const,
    title: 'Account Settings',
    description: 'Manage your personal information and security',
    icon: User,
    color: 'bg-mint-green',
    textColor: 'text-text-primary'
  },
  {
    id: 'family' as const,
    title: 'Family Settings',
    description: 'Configure family preferences and member management',
    icon: Users,
    color: 'bg-pale-lavender',
    textColor: 'text-text-primary'
  },
  {
    id: 'notifications' as const,
    title: 'Notifications',
    description: 'Control how and when you receive notifications',
    icon: Bell,
    color: 'bg-light-pink',
    textColor: 'text-text-primary'
  },
  {
    id: 'payments' as const,
    title: 'Payments & Billing',
    description: 'Manage subscription and payment methods',
    icon: CreditCard,
    color: 'bg-pastel-yellow',
    textColor: 'text-text-primary'
  },
  {
    id: 'privacy' as const,
    title: 'Privacy & Data',
    description: 'Control your data and privacy settings',
    icon: Shield,
    color: 'bg-light-purple',
    textColor: 'text-text-primary'
  },
  {
    id: 'preferences' as const,
    title: 'App Preferences',
    description: 'Customize your app experience',
    icon: Palette,
    color: 'bg-cream-yellow',
    textColor: 'text-text-primary'
  }
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'account':
        return <AccountSettings />;
      case 'family':
        return <FamilySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'payments':
        return <PaymentSettings />;
      case 'privacy':
        return <PrivacySettings />;
      case 'preferences':
        return <AppPreferences />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Button variant="ghost" className="mb-4 hover:bg-mint-green/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-mint-green rounded-xl">
              <SettingsIcon className="h-6 w-6 text-text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Settings & Preferences</h1>
              <p className="text-text-secondary">
                Manage your account, family settings, and app preferences
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Settings</h3>
              <nav className="space-y-2">
                {settingsSections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  
                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                        isActive 
                          ? `${section.color} ${section.textColor} shadow-md` 
                          : 'hover:bg-mint-tint hover:text-text-primary'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{section.title}</div>
                        <div className={`text-sm ${
                          isActive ? 'opacity-90' : 'text-text-secondary'
                        }`}>
                          {section.description}
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${
                        isActive ? 'rotate-90' : 'group-hover:translate-x-1'
                      }`} />
                    </motion.button>
                  );
                })}
              </nav>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderActiveSection()}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}