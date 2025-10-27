import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { SearchResultsList } from '@/components/search/SearchResultsList';
import { SearchPagination } from '@/components/search/SearchPagination';
import { useSearch, useTrackClick } from '@/hooks/useSearch';
import type { SearchQuery, SearchFilters, SearchResult } from '@/types/search';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sort, setSort] = useState<'relevance' | 'date_newest' | 'date_oldest' | 'amount_high' | 'amount_low'>('relevance');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  const searchQuery: SearchQuery = {
    query,
    filters,
    page,
    sort,
    limit: 20,
  };
  
  const { data: searchData, isLoading, error } = useSearch(searchQuery, query.length > 0);
  const trackClick = useTrackClick();

  // Update URL when search parameters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.entity_types?.length) params.set('types', filters.entity_types.join(','));
    if (filters.date_from) params.set('date_from', filters.date_from);
    if (filters.date_to) params.set('date_to', filters.date_to);
    if (filters.status) params.set('status', filters.status);
    if (filters.type) params.set('type', filters.type);
    if (filters.amount_min !== undefined) params.set('amount_min', filters.amount_min.toString());
    if (filters.amount_max !== undefined) params.set('amount_max', filters.amount_max.toString());
    if (filters.currency) params.set('currency', filters.currency);
    if (sort !== 'relevance') params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());
    
    setSearchParams(params);
  }, [query, filters, sort, page, setSearchParams]);

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlFilters: SearchFilters = {};
    
    const types = searchParams.get('types');
    if (types) {
      urlFilters.entity_types = types.split(',') as any[];
    }
    
    const dateFrom = searchParams.get('date_from');
    if (dateFrom) urlFilters.date_from = dateFrom;
    
    const dateTo = searchParams.get('date_to');
    if (dateTo) urlFilters.date_to = dateTo;
    
    const status = searchParams.get('status');
    if (status) urlFilters.status = status;
    
    const type = searchParams.get('type');
    if (type) urlFilters.type = type;
    
    const amountMin = searchParams.get('amount_min');
    if (amountMin) urlFilters.amount_min = Number(amountMin);
    
    const amountMax = searchParams.get('amount_max');
    if (amountMax) urlFilters.amount_max = Number(amountMax);
    
    const currency = searchParams.get('currency');
    if (currency) urlFilters.currency = currency;
    
    setFilters(urlFilters);
    
    const urlSort = searchParams.get('sort') as any;
    if (urlSort) setSort(urlSort);
    
    const urlPage = searchParams.get('page');
    if (urlPage) setPage(Number(urlPage));
  }, [searchParams]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort as any);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResultClick = async (result: SearchResult) => {
    // Track click for analytics
    trackClick.mutate({
      resultId: result.id,
      query,
      position: 0, // Position would need to be calculated based on current page and result index
    });
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.entity_types?.length) count += filters.entity_types.length;
    if (filters.date_from) count++;
    if (filters.date_to) count++;
    if (filters.status) count++;
    if (filters.type) count++;
    if (filters.amount_min !== undefined) count++;
    if (filters.amount_max !== undefined) count++;
    if (filters.currency) count++;
    return count;
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  const results = searchData?.results || [];
  const total = searchData?.total || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Search Results
          </h1>
          <p className="text-text-secondary">
            {query ? `Searching for "${query}"` : 'Find goals, activities, and more'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            query={query}
            onSearch={handleSearch}
            placeholder="Search goals, activities, transactions..."
            className="max-w-2xl"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Filters */}
          <div className="lg:w-80">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </div>
                {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
              </Button>
            </div>

            {showFilters && (
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClose={() => setShowFilters(false)}
              />
            )}
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-text-secondary">
                  {isLoading ? (
                    'Searching...'
                  ) : (
                    `${total.toLocaleString()} result${total !== 1 ? 's' : ''} found`
                  )}
                </div>
                
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-text-tertiary hover:text-text-primary"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">Sort by:</span>
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date_newest">Newest first</SelectItem>
                    <SelectItem value="date_oldest">Oldest first</SelectItem>
                    <SelectItem value="amount_high">Amount: High to Low</SelectItem>
                    <SelectItem value="amount_low">Amount: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-2">Search failed</div>
                <p className="text-text-secondary">
                  There was an error searching. Please try again.
                </p>
              </div>
            )}

            {/* Results */}
            <SearchResultsList
              results={results}
              isLoading={isLoading}
              onResultClick={handleResultClick}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <SearchPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}