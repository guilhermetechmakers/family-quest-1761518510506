import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Cookie, 
  Shield, 
  BarChart3, 
  User, 
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  Download,
  RotateCcw
} from 'lucide-react';
import { useCookiePolicy, useCookiePreferences, useUpdateCookiePreferences, useResetCookiePreferences } from '@/hooks/useCookies';

export function CookiePolicyPage() {
  const [preferences, setPreferences] = useState({
    analytics_consent: false,
    personalization_consent: false,
    marketing_consent: false,
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Hooks
  const { isLoading: policyLoading, error: policyError } = useCookiePolicy();
  const { data: userPreferences, isLoading: prefsLoading } = useCookiePreferences();
  const updatePreferencesMutation = useUpdateCookiePreferences();
  const resetPreferencesMutation = useResetCookiePreferences();

  // Initialize preferences when user data loads
  useEffect(() => {
    if (userPreferences) {
      setPreferences({
        analytics_consent: userPreferences.analytics_consent,
        personalization_consent: userPreferences.personalization_consent,
        marketing_consent: userPreferences.marketing_consent,
      });
    }
  }, [userPreferences]);

  // Check for changes
  useEffect(() => {
    if (userPreferences) {
      const hasChanges = 
        preferences.analytics_consent !== userPreferences.analytics_consent ||
        preferences.personalization_consent !== userPreferences.personalization_consent ||
        preferences.marketing_consent !== userPreferences.marketing_consent;
      setHasChanges(hasChanges);
    }
  }, [preferences, userPreferences]);

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePreferences = () => {
    updatePreferencesMutation.mutate(preferences);
  };

  const handleResetPreferences = () => {
    resetPreferencesMutation.mutate();
  };

  // Mock data for development - in production this would come from the API
  const mockCookieTypes = [
    {
      id: 'essential-1',
      name: 'Session Cookies',
      purpose: 'Essential for app functionality',
      description: 'These cookies are necessary for the app to function properly. They enable basic features like page navigation, access to secure areas, and user authentication.',
      category: 'essential' as const,
      duration: 'Session',
      third_party: false
    },
    {
      id: 'essential-2',
      name: 'Security Cookies',
      purpose: 'Protect against security threats',
      description: 'These cookies help protect your account from unauthorized access and detect suspicious activity.',
      category: 'essential' as const,
      duration: '1 year',
      third_party: false
    },
    {
      id: 'analytics-1',
      name: 'Google Analytics',
      purpose: 'Understand app usage and performance',
      description: 'These cookies help us understand how users interact with our app, which features are most popular, and how we can improve the user experience.',
      category: 'analytics' as const,
      duration: '2 years',
      third_party: true
    },
    {
      id: 'analytics-2',
      name: 'Performance Monitoring',
      purpose: 'Monitor app performance and errors',
      description: 'These cookies help us identify and fix technical issues, ensuring the app runs smoothly for all users.',
      category: 'analytics' as const,
      duration: '1 year',
      third_party: false
    },
    {
      id: 'personalization-1',
      name: 'User Preferences',
      purpose: 'Remember your settings and choices',
      description: 'These cookies remember your preferences, such as theme selection, language settings, and display options.',
      category: 'personalization' as const,
      duration: '1 year',
      third_party: false
    },
    {
      id: 'personalization-2',
      name: 'Goal Recommendations',
      purpose: 'Provide personalized goal suggestions',
      description: 'These cookies help us suggest relevant goals and features based on your family\'s interests and past activities.',
      category: 'personalization' as const,
      duration: '6 months',
      third_party: false
    },
    {
      id: 'marketing-1',
      name: 'Marketing Campaigns',
      purpose: 'Deliver relevant promotional content',
      description: 'These cookies help us show you relevant offers, new features, and family-friendly activities that might interest you.',
      category: 'marketing' as const,
      duration: '1 year',
      third_party: false
    },
    {
      id: 'marketing-2',
      name: 'Social Media Integration',
      purpose: 'Enable social sharing features',
      description: 'These cookies enable you to share milestone achievements and family progress on social media platforms.',
      category: 'marketing' as const,
      duration: '6 months',
      third_party: true
    }
  ];

  const cookieCategories = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'Required for basic app functionality',
      icon: Shield,
      color: 'bg-mint-green',
      textColor: 'text-text-primary',
      required: true
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'Help us understand app usage and improve performance',
      icon: BarChart3,
      color: 'bg-pale-lavender',
      textColor: 'text-text-primary',
      required: false
    },
    {
      id: 'personalization',
      name: 'Personalization Cookies',
      description: 'Remember your preferences and provide customized content',
      icon: User,
      color: 'bg-light-pink',
      textColor: 'text-text-primary',
      required: false
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'Enable personalized marketing and social sharing',
      icon: Target,
      color: 'bg-pastel-yellow',
      textColor: 'text-text-primary',
      required: false
    }
  ];

  if (policyLoading || prefsLoading) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-mint-green rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Cookie className="h-8 w-8 text-text-primary" />
          </div>
          <p className="text-text-secondary">Loading Cookie Policy...</p>
        </div>
      </div>
    );
  }

  if (policyError) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">Error Loading Cookie Policy</h2>
          <p className="text-text-secondary mb-4">Unable to load the cookie policy at this time.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Settings
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold text-text-primary">Cookie Policy</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.print()}
              >
                <Download className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-mint-green rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Cookie className="h-8 w-8 text-text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-text-secondary mb-6">
            Last updated: December 15, 2024
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-text-tertiary">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-1" />
              Version 1.0
            </div>
            <div className="h-4 w-px bg-border" />
            <div>Effective December 15, 2024</div>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6 bg-mint-tint border-mint-green/20">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-mint-green rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="h-6 w-6 text-text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-3">
                  What Are Cookies?
                </h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Cookies are small text files that are stored on your device when you visit our app. 
                  They help us provide you with a better experience by remembering your preferences, 
                  understanding how you use our app, and enabling certain features to work properly.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  You have control over which cookies you accept. Essential cookies are required for 
                  the app to function, but you can choose whether to allow analytics, personalization, 
                  and marketing cookies.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Cookie Categories and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="h-6 w-6 text-text-primary" />
              <h2 className="text-xl font-semibold text-text-primary">Cookie Preferences</h2>
            </div>
            
            <div className="space-y-6">
              {cookieCategories.map((category, index) => {
                const Icon = category.icon;
                const isEssential = category.required;
                const preferenceKey = category.id as keyof typeof preferences;
                const isEnabled = isEssential ? true : preferences[preferenceKey];

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 rounded-xl border border-border hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${category.textColor}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">
                            {category.name}
                            {isEssential && (
                              <span className="ml-2 text-sm text-mint-green font-medium">(Required)</span>
                            )}
                          </h3>
                          <p className="text-text-secondary">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {isEssential ? (
                          <div className="flex items-center space-x-2 text-mint-green">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Always Active</span>
                          </div>
                        ) : (
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) => handlePreferenceChange(preferenceKey, checked)}
                            disabled={updatePreferencesMutation.isPending}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border">
              <Button 
                onClick={handleSavePreferences}
                disabled={!hasChanges || updatePreferencesMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
              </Button>
              <Button 
                variant="outline"
                onClick={handleResetPreferences}
                disabled={resetPreferencesMutation.isPending}
                className="w-full sm:w-auto"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {resetPreferencesMutation.isPending ? 'Resetting...' : 'Reset to Default'}
              </Button>
            </div>

            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-pastel-yellow/20 border border-pastel-yellow/30 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-pastel-yellow" />
                  <span className="text-sm text-text-primary font-medium">
                    You have unsaved changes. Don't forget to save your preferences!
                  </span>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Detailed Cookie Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Cookie Details</h2>
            
            <div className="space-y-6">
              {cookieCategories.map((category) => {
                const categoryCookies = mockCookieTypes.filter(cookie => cookie.category === category.id);
                
                return (
                  <div key={category.id} className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                        <category.icon className={`h-4 w-4 ${category.textColor}`} />
                      </div>
                      {category.name}
                    </h3>
                    
                    <div className="space-y-3">
                      {categoryCookies.map((cookie) => (
                        <div key={cookie.id} className="p-4 rounded-lg bg-mint-tint/30 border border-mint-green/10">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-text-primary">{cookie.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-text-tertiary">
                              <span>{cookie.duration}</span>
                              {cookie.third_party && (
                                <span className="px-2 py-1 bg-pale-lavender text-text-primary rounded-full text-xs">
                                  Third Party
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-text-secondary mb-2">
                            <strong>Purpose:</strong> {cookie.purpose}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {cookie.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Your Rights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="p-6 bg-mint-tint border-mint-green/20">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-mint-green rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Your Cookie Rights
                </h2>
                <div className="space-y-3 text-text-secondary">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-mint-green flex-shrink-0 mt-0.5" />
                    <p>You can change your cookie preferences at any time using the controls above.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-mint-green flex-shrink-0 mt-0.5" />
                    <p>Essential cookies cannot be disabled as they are necessary for the app to function.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-mint-green flex-shrink-0 mt-0.5" />
                    <p>You can also manage cookies through your browser settings.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-mint-green flex-shrink-0 mt-0.5" />
                    <p>Disabling certain cookies may affect app functionality and your user experience.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Questions About Cookies?
            </h2>
            <p className="text-text-secondary mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, 
              please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/help">
                <Button variant="outline" className="w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
              <Link to="/privacy">
                <Button variant="outline" className="w-full sm:w-auto">
                  Privacy Policy
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-text-secondary">
              <Link to="/privacy" className="hover:text-mint-green transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-mint-green transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/help" className="hover:text-mint-green transition-colors duration-200">
                Help Center
              </Link>
            </div>
            <div className="text-sm text-text-tertiary">
              © 2024 Family Quest Inc. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}