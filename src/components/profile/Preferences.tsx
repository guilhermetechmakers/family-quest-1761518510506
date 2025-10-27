import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Bell, 
  Globe, 
  Mail,
  Smartphone,
  Monitor,
  Save,
  AlertCircle,
  Sun,
  Moon,
  Computer
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
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
  { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
];

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Computer },
];

const notificationTypes = [
  { key: 'email', label: 'Email Notifications', description: 'Receive updates via email', icon: Mail },
  { key: 'push', label: 'Push Notifications', description: 'Receive push notifications on your device', icon: Smartphone },
  { key: 'in_app', label: 'In-App Notifications', description: 'Show notifications within the app', icon: Monitor },
];

export function Preferences() {
  const { data: user, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<any>(null);

  const handlePreferenceChange = async (key: string, value: any) => {
    if (!user) return;

    const newPreferences = {
      ...user.preferences,
      [key]: value,
    };

    setLocalPreferences(newPreferences);
    setHasChanges(true);

    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        preferences: newPreferences,
      });
      setHasChanges(false);
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = async (type: string, enabled: boolean) => {
    if (!user) return;

    const newPreferences = {
      ...user.preferences,
      notifications: {
        ...user.preferences.notifications,
        [type]: enabled,
      },
    };

    setLocalPreferences(newPreferences);
    setHasChanges(true);

    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        preferences: newPreferences,
      });
      setHasChanges(false);
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    if (!user || !localPreferences) return;

    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        preferences: localPreferences,
      });
      setHasChanges(false);
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSaving(false);
    }
  };

  const currentPreferences = localPreferences || user?.preferences;

  if (isLoading) {
    return (
      <Card className="p-8 animate-pulse">
        <div className="space-y-8">
          <div className="h-7 bg-gray-200 rounded w-48"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="w-12 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!user || !currentPreferences) {
    return null;
  }

  return (
    <Card className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint-green/20 rounded-lg">
            <Settings className="h-6 w-6 text-mint-green" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-primary">
              Preferences
            </h3>
            <p className="text-sm text-text-secondary">
              Customize your app experience
            </p>
          </div>
        </div>

        {hasChanges && (
          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {/* Notifications */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pastel-yellow/20 rounded-lg">
              <Bell className="h-5 w-5 text-pastel-yellow" />
            </div>
            <h4 className="text-xl font-semibold text-text-primary">Notifications</h4>
          </div>
          
          <div className="grid gap-4">
            {notificationTypes.map((notification) => {
              const Icon = notification.icon;
              return (
                <div key={notification.key} className="flex items-center justify-between p-6 bg-pale-lavender-bg rounded-2xl hover:bg-mint-tint transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-mint-green/20 rounded-lg">
                      <Icon className="h-5 w-5 text-mint-green" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-text-primary">{notification.label}</h5>
                      <p className="text-sm text-text-secondary">{notification.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={currentPreferences.notifications[notification.key]}
                    onCheckedChange={(checked) => handleNotificationChange(notification.key, checked)}
                    disabled={isSaving}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Language & Currency */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-light-purple/20 rounded-lg">
              <Globe className="h-5 w-5 text-light-purple" />
            </div>
            <h4 className="text-xl font-semibold text-text-primary">Language & Currency</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-pale-lavender-bg rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="h-5 w-5 text-mint-green" />
                <h5 className="font-semibold text-text-primary">Language</h5>
              </div>
              <Select
                value={currentPreferences.language}
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

            <div className="p-6 bg-pale-lavender-bg rounded-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">💰</span>
                <h5 className="font-semibold text-text-primary">Currency</h5>
              </div>
              <Select
                value={currentPreferences.currency}
                onValueChange={(value) => handlePreferenceChange('currency', value)}
                disabled={isSaving}
              >
                <SelectTrigger className="hover:border-mint-green focus:border-mint-green">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      <div className="flex items-center space-x-2">
                        <span>{currency.symbol}</span>
                        <span>{currency.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-light-pink/20 rounded-lg">
              <Monitor className="h-5 w-5 text-light-pink" />
            </div>
            <h4 className="text-xl font-semibold text-text-primary">Appearance</h4>
          </div>
          
          <div className="p-6 bg-pale-lavender-bg rounded-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <Monitor className="h-5 w-5 text-mint-green" />
              <h5 className="font-semibold text-text-primary">Theme</h5>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const Icon = theme.icon;
                const isSelected = currentPreferences.theme === theme.value;
                return (
                  <button
                    key={theme.value}
                    onClick={() => handlePreferenceChange('theme', theme.value)}
                    disabled={isSaving}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-mint-green bg-mint-tint'
                        : 'border-border hover:border-mint-green/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className={`h-6 w-6 ${isSelected ? 'text-mint-green' : 'text-text-secondary'}`} />
                      <span className={`font-medium ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {theme.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        {isSaving && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-mint-green border-t-transparent"></div>
              <span>Saving preferences...</span>
            </div>
          </div>
        )}

        {hasChanges && !isSaving && (
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-2 text-sm text-pastel-yellow">
              <AlertCircle className="h-4 w-4" />
              <span>You have unsaved changes</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}