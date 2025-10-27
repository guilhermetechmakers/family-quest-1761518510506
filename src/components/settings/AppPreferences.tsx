import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Globe, 
  Monitor, 
  Moon, 
  Sun,
  Smartphone,
} from 'lucide-react';
import { useUpdatePreferences } from '@/hooks/useSettings';

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().min(1, 'Language is required'),
  currency: z.string().min(1, 'Currency is required'),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    in_app: z.boolean(),
  }),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

const languages = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'pt', label: 'Português', flag: '🇵🇹' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
  { value: 'ko', label: '한국어', flag: '🇰🇷' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
];

const currencies = [
  { value: 'USD', label: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { value: 'EUR', label: 'Euro', symbol: '€', flag: '🇪🇺' },
  { value: 'GBP', label: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { value: 'AUD', label: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { value: 'CHF', label: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { value: 'CNY', label: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
];

export function AppPreferences() {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');

  const updatePreferences = useUpdatePreferences();

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: 'system',
      language: 'en',
      currency: 'USD',
      notifications: {
        email: true,
        push: true,
        in_app: true,
      },
    },
  });

  const onSubmit = (data: PreferencesFormData) => {
    updatePreferences.mutate(data);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
    form.setValue('theme', theme);
    
    // Apply theme immediately
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mint-green rounded-lg">
                <Palette className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Theme & Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of your app
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">Choose Theme</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.button
                      type="button"
                      onClick={() => handleThemeChange('light')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentTheme === 'light'
                          ? 'border-mint-green bg-mint-tint'
                          : 'border-border bg-card hover:bg-mint-tint/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Sun className="h-5 w-5 text-pastel-yellow" />
                        <span className="font-medium">Light</span>
                      </div>
                      <p className="text-sm text-text-secondary text-left">
                        Clean and bright interface
                      </p>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => handleThemeChange('dark')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentTheme === 'dark'
                          ? 'border-mint-green bg-mint-tint'
                          : 'border-border bg-card hover:bg-mint-tint/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Moon className="h-5 w-5 text-light-purple" />
                        <span className="font-medium">Dark</span>
                      </div>
                      <p className="text-sm text-text-secondary text-left">
                        Easy on the eyes
                      </p>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => handleThemeChange('system')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        currentTheme === 'system'
                          ? 'border-mint-green bg-mint-tint'
                          : 'border-border bg-card hover:bg-mint-tint/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Monitor className="h-5 w-5 text-text-primary" />
                        <span className="font-medium">System</span>
                      </div>
                      <p className="text-sm text-text-secondary text-left">
                        Follows device setting
                      </p>
                    </motion.button>
                  </div>
                </div>

                <Separator />

              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updatePreferences.isPending}
                  className="btn-primary"
                >
                  {updatePreferences.isPending ? 'Saving...' : 'Save Theme'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Language & Region */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pale-lavender rounded-lg">
                <Globe className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>
                  Set your preferred language and currency
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={form.watch('language')}
                    onValueChange={(value) => form.setValue('language', value)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.language && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.language.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={form.watch('currency')}
                    onValueChange={(value) => form.setValue('currency', value)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span>{currency.label} ({currency.symbol})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.currency && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.currency.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updatePreferences.isPending}
                  className="btn-primary"
                >
                  {updatePreferences.isPending ? 'Saving...' : 'Save Language & Currency'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Accessibility & Sounds */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-light-pink rounded-lg">
                <Smartphone className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Accessibility & Sounds</CardTitle>
                <CardDescription>
                  Customize your app experience for better accessibility
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">

              </div>

              <div className="p-4 bg-mint-tint rounded-xl">
                <h4 className="font-medium text-text-primary mb-2">Accessibility Features</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• High contrast mode for better visibility</li>
                  <li>• Large text options for easier reading</li>
                  <li>• Voice-over support for screen readers</li>
                  <li>• Keyboard navigation support</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updatePreferences.isPending}
                  className="btn-primary"
                >
                  {updatePreferences.isPending ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* App Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-light-purple rounded-lg">
                <Smartphone className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>App Information</CardTitle>
                <CardDescription>
                  Version and app details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-mint-tint rounded-xl">
                <div>
                  <h4 className="font-medium text-text-primary">Family Quest</h4>
                  <p className="text-sm text-text-secondary">Version 1.0.0</p>
                </div>
                <Badge className="bg-mint-green text-text-primary">Latest</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Build:</span>
                    <span className="text-text-primary">2024.01.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Platform:</span>
                    <span className="text-text-primary">Web</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Last Updated:</span>
                    <span className="text-text-primary">Today</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Storage Used:</span>
                    <span className="text-text-primary">12.5 MB</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="btn-outline">
                  Check for Updates
                </Button>
                <Button variant="outline" className="btn-outline">
                  App Store
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}