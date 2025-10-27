import { SearchResultCard } from './SearchResultCard';
import { SearchResultSkeleton } from './SearchResultSkeleton';
import { EmptySearchState } from './EmptySearchState';
import { cn } from '@/lib/utils';
import type { SearchResult } from '@/types/search';

interface SearchResultsListProps {
  results: SearchResult[];
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export function SearchResultsList({ 
  results, 
  isLoading = false, 
  onResultClick, 
  className 
}: SearchResultsListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <SearchResultSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return <EmptySearchState className={className} />;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {results.map((result) => (
        <SearchResultCard
          key={result.id}
          result={result}
          onResultClick={onResultClick}
        />
      ))}
    </div>
  );
}