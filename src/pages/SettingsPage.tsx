import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary mt-2">
            Manage your account settings, family preferences, and app configuration.
          </p>
        </div>

        <Card className="p-8">
          <div className="text-center">
            <Settings className="h-16 w-16 text-mint-green mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              Settings & Preferences
            </h2>
            <p className="text-text-secondary mb-8">
              This feature is coming soon! You'll be able to manage all your settings and preferences.
            </p>
            <Button asChild>
              <a href="/dashboard">Back to Dashboard</a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}