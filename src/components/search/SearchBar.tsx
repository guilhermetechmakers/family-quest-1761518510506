import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuickSearch, useSearchSuggestions, useTrackClick } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';
import type { QuickSearchResult } from '@/types/search';

interface SearchBarProps {
  query?: string;
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  onResultClick?: (result: QuickSearchResult) => void;
}

export function SearchBar({
  query: initialQuery = '',
  placeholder = "Search goals, activities...",
  className,
  onSearch,
  onResultClick,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const { data: quickSearchData, isLoading } = useQuickSearch(query, query.length > 0);
  const { suggestions } = useSearchSuggestions(query);
  const trackClick = useTrackClick();

  // Update query when prop changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = quickSearchData?.results || [];
  const allSuggestions = [
    ...(query.length > 0 ? results : []),
    ...(query.length === 0 ? suggestions.map(s => ({ text: s, type: 'suggestion' as const })) : [])
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < allSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : allSuggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
            handleResultClick(allSuggestions[selectedIndex]);
          } else if (query.trim()) {
            handleSearch();
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allSuggestions, query]);

  useEffect(() => {
    if (query.length > 0) {
      setIsOpen(true);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    if (query.length > 0 || suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay to allow click events to fire
    setTimeout(() => setIsOpen(false), 150);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = async (result: QuickSearchResult | { text: string; type: 'suggestion' }) => {
    if ('type' in result && result.type === 'suggestion') {
      setQuery(result.text);
      handleSearch();
    } else {
      onResultClick?.(result as QuickSearchResult);
      
      // Track click for analytics
      if ('id' in result) {
        trackClick.mutate({
          resultId: result.id,
          query,
          position: selectedIndex,
        });
      }
      
      // Navigate to result
      if ('url' in result) {
        navigate(result.url);
      }
      
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getResultIcon = (result: QuickSearchResult | { text: string; type: 'suggestion' }) => {
    if ('type' in result && result.type === 'suggestion') {
      return <TrendingUp className="h-4 w-4 text-text-tertiary" />;
    }
    
    const quickResult = result as QuickSearchResult;
    switch (quickResult.type) {
      case 'goal':
        return <div className="w-2 h-2 rounded-full bg-mint-green" />;
      case 'activity':
        return <div className="w-2 h-2 rounded-full bg-pale-lavender" />;
      case 'transaction':
        return <div className="w-2 h-2 rounded-full bg-light-pink" />;
      case 'member':
        return <div className="w-2 h-2 rounded-full bg-pastel-yellow" />;
      default:
        return <Search className="h-4 w-4 text-text-tertiary" />;
    }
  };

  const getResultTypeLabel = (result: QuickSearchResult | { text: string; type: 'suggestion' }) => {
    if ('type' in result && result.type === 'suggestion') {
      return 'Popular';
    }
    
    const quickResult = result as QuickSearchResult;
    switch (quickResult.type) {
      case 'goal':
        return 'Goal';
      case 'activity':
        return 'Activity';
      case 'transaction':
        return 'Transaction';
      case 'member':
        return 'Member';
      default:
        return 'Result';
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="pl-10 pr-10 h-10 rounded-xl border-gray-300 focus:ring-2 focus:ring-mint-green focus:border-transparent"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearQuery}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-text-tertiary hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (allSuggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-card border border-gray-200 z-50 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-text-tertiary">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-mint-green mx-auto mb-2"></div>
              Searching...
            </div>
          ) : (
            <>
              {allSuggestions.length > 0 ? (
                <div className="py-2">
                  {allSuggestions.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3",
                        selectedIndex === index && "bg-mint-green/10"
                      )}
                    >
                      {getResultIcon(result)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-text-primary truncate">
                          {'title' in result ? result.title : result.text}
                        </div>
                        {'subtitle' in result && (
                          <div className="text-sm text-text-secondary truncate">
                            {result.subtitle}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {getResultTypeLabel(result)}
                      </Badge>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-text-tertiary">
                  No results found
                </div>
              )}
              
              {query && (
                <div className="border-t border-gray-200 p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSearch}
                    className="w-full justify-start text-text-secondary hover:text-text-primary"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search for "{query}"
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}