import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity } from 'lucide-react';

export function ActivityFeedPage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-text-primary">Family Activity Feed</h1>
          <p className="text-text-secondary mt-2">
            See all the latest activity from your family members.
          </p>
        </div>

        <Card className="p-8">
          <div className="text-center">
            <Activity className="h-16 w-16 text-mint-green mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-text-primary mb-4">
              Activity Feed
            </h2>
            <p className="text-text-secondary mb-8">
              This feature is coming soon! You'll be able to see all family activity, comments, and reactions.
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