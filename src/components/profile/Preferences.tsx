import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Bell, 
  Globe, 
  Mail,
  Smartphone,
  Monitor
} from 'lucide-react';
import { useUserProfile, useUpdateProfile } from '@/hooks/useProfile';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
];

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
];

export function Preferences() {
  const { data: user, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const [isSaving, setIsSaving] = useState(false);

  const handlePreferenceChange = async (key: string, value: any) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        preferences: {
          ...user.preferences,
          [key]: value,
        },
      });
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (type: string, enabled: boolean) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        preferences: {
          ...user.preferences,
          notifications: {
            ...user.preferences.notifications,
            [type]: enabled,
          },
        },
      });
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="space-y-6">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="h-6 w-6 text-mint-green" />
        <h3 className="text-xl font-semibold text-text-primary">
          Preferences
        </h3>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-mint-green" />
            <h4 className="text-lg font-medium text-text-primary">Notifications</h4>
          </div>
          
          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-text-secondary" />
                  <span className="font-medium text-text-primary">Email Notifications</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Receive updates via email
                </p>
              </div>
              <Switch
                checked={user.preferences.notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-text-secondary" />
                  <span className="font-medium text-text-primary">Push Notifications</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Receive push notifications on your device
                </p>
              </div>
              <Switch
                checked={user.preferences.notifications.push}
                onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-text-secondary" />
                  <span className="font-medium text-text-primary">In-App Notifications</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Show notifications within the app
                </p>
              </div>
              <Switch
                checked={user.preferences.notifications.in_app}
                onCheckedChange={(checked) => handleNotificationChange('in_app', checked)}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        {/* Language & Currency */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="h-5 w-5 text-mint-green" />
            <h4 className="text-lg font-medium text-text-primary">Language & Currency</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Language</label>
              <Select
                value={user.preferences.language}
                onValueChange={(value) => handlePreferenceChange('language', value)}
                disabled={isSaving}
              >
                <SelectTrigger className="hover:border-mint-green focus:border-mint-green">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Currency</label>
              <Select
                value={user.preferences.currency}
                onValueChange={(value) => handlePreferenceChange('currency', value)}
                disabled={isSaving}
              >
                <SelectTrigger className="hover:border-mint-green focus:border-mint-green">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Monitor className="h-5 w-5 text-mint-green" />
            <h4 className="text-lg font-medium text-text-primary">Appearance</h4>
          </div>
          
          <div className="pl-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Theme</label>
              <Select
                value={user.preferences.theme}
                onValueChange={(value) => handlePreferenceChange('theme', value)}
                disabled={isSaving}
              >
                <SelectTrigger className="hover:border-mint-green focus:border-mint-green">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isSaving && (
          <div className="flex items-center justify-center py-2">
            <div className="text-sm text-text-secondary">Saving preferences...</div>
          </div>
        )}
      </div>
    </Card>
  );
}