import { Search, Filter, Target, Users, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptySearchStateProps {
  className?: string;
  onClearFilters?: () => void;
  hasFilters?: boolean;
}

export function EmptySearchState({ 
  className, 
  onClearFilters, 
  hasFilters = false 
}: EmptySearchStateProps) {
  const suggestions = [
    {
      icon: <Target className="h-5 w-5 text-mint-green" />,
      title: "Search for goals",
      description: "Find vacation plans, home upgrades, or family purchases",
      example: "Try 'vacation' or 'new car'"
    },
    {
      icon: <Users className="h-5 w-5 text-pale-lavender" />,
      title: "Find activities",
      description: "Look for family activities and milestones",
      example: "Try 'chore completed' or 'milestone'"
    },
    {
      icon: <DollarSign className="h-5 w-5 text-light-pink" />,
      title: "Search transactions",
      description: "Find contributions and payment history",
      example: "Try 'contribution' or 'payment'"
    }
  ];

  return (
    <Card className={cn("card", className)}>
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-text-tertiary" />
        </div>
        
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {hasFilters ? 'No results match your filters' : 'No search results found'}
        </h3>
        
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          {hasFilters 
            ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
            : 'Try different keywords or check your spelling to find what you\'re looking for.'
          }
        </p>

        {hasFilters && onClearFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="mb-6"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear all filters
          </Button>
        )}

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-text-primary">
            Search suggestions:
          </h4>
          
          <div className="grid gap-3 max-w-lg mx-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg text-left"
              >
                {suggestion.icon}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary">
                    {suggestion.title}
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    {suggestion.description}
                  </div>
                  <div className="text-xs text-text-tertiary mt-1 font-mono">
                    {suggestion.example}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}