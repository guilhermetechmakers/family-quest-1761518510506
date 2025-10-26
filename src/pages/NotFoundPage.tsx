import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-4">
      <Card className="p-8 text-center max-w-md w-full">
        <div className="text-6xl font-bold text-mint-green mb-4">404</div>
        <h1 className="text-2xl font-bold text-text-primary mb-4">Page Not Found</h1>
        <p className="text-text-secondary mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-text-tertiary mb-4">Need help finding something?</p>
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search the site
          </Button>
        </div>
      </Card>
    </div>
  );
}