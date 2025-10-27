import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home, Search, ArrowLeft, HelpCircle, Sparkles, Target, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  title: string;
  type: 'goal' | 'page' | 'help';
  url: string;
  description?: string;
}

export function NotFoundPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const navigate = useNavigate();

  // Mock search function - in a real app this would call the search API
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setSelectedResultIndex(-1);
      return;
    }

    setIsSearching(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Family Dashboard',
          type: 'page' as const,
          url: '/dashboard',
          description: 'View your family goals and progress'
        },
        {
          id: '2',
          title: 'Create New Goal',
          type: 'page' as const,
          url: '/goals/create',
          description: 'Start a new family goal together'
        },
        {
          id: '3',
          title: 'Activity Feed',
          type: 'page' as const,
          url: '/activity',
          description: 'See what your family has been up to'
        },
        {
          id: '4',
          title: 'How to Create Goals',
          type: 'help' as const,
          url: '/help#create-goals',
          description: 'Learn how to set up family goals'
        }
      ].filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description?.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
      setShowSearchResults(true);
      setSelectedResultIndex(-1);
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleResultClick = (url: string) => {
    navigate(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
          handleResultClick(searchResults[selectedResultIndex].url);
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSelectedResultIndex(-1);
        break;
    }
  };

  // Log 404 error for analytics
  useEffect(() => {
    // In a real app, this would send analytics data
    console.log('404 Error - Page not found:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Main 404 Card */}
        <Card className="p-8 md:p-12 text-center mb-8 animate-fade-in-up" role="main" aria-labelledby="error-title">
          {/* 404 Number with Animation */}
          <div className="relative mb-6" aria-hidden="true">
            <div className="text-8xl md:text-9xl font-bold text-mint-green mb-2 animate-bounce-in">
              404
            </div>
            <div className="absolute -top-2 -right-2 animate-pulse">
              <Sparkles className="h-8 w-8 text-pastel-yellow" />
            </div>
          </div>

          {/* Error Message */}
          <h1 id="error-title" className="text-3xl md:text-4xl font-bold text-text-primary mb-4 animate-fade-in-up">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto animate-fade-in-up">
            The page you're looking for seems to have wandered off on its own adventure! 
            Don't worry, let's help you find your way back to your family goals.
          </p>

          {/* Search Section */}
          <div className="mb-8 animate-fade-in-up">
            <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto" role="search">
              <label htmlFor="search-input" className="sr-only">
                Search for goals, pages, or help
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" aria-hidden="true" />
                <Input
                  id="search-input"
                  type="text"
                  placeholder="Search for goals, pages, or help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-12 pr-4 py-3 text-base rounded-2xl border-2 focus:border-mint-green focus:ring-2 focus:ring-mint-green/20"
                  aria-describedby="search-help"
                  autoComplete="off"
                />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2" aria-hidden="true">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-mint-green border-t-transparent"></div>
                  </div>
                )}
              </div>
              <div id="search-help" className="sr-only">
                Search for goals, pages, or help content. Results will appear below as you type.
              </div>
            </form>

            {/* Search Results */}
            {showSearchResults && (
              <div className="mt-4 max-w-md mx-auto" role="region" aria-live="polite" aria-label="Search results">
                {searchResults.length > 0 ? (
                  <div className="space-y-2 animate-fade-in-up" role="list">
                    {searchResults.map((result, index) => (
                      <div
                        key={result.id}
                        className={`p-3 bg-card rounded-xl border transition-all duration-200 cursor-pointer animate-fade-in-up ${
                          selectedResultIndex === index
                            ? 'border-mint-green shadow-card-hover bg-mint-green/5'
                            : 'border-border hover:border-mint-green hover:shadow-card-hover'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleResultClick(result.url)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleResultClick(result.url);
                          }
                        }}
                        role="listitem"
                        tabIndex={selectedResultIndex === index ? 0 : -1}
                        aria-label={`${result.title}: ${result.description}`}
                        aria-selected={selectedResultIndex === index}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0" aria-hidden="true">
                            {result.type === 'goal' && <Target className="h-5 w-5 text-mint-green" />}
                            {result.type === 'page' && <Home className="h-5 w-5 text-pale-lavender" />}
                            {result.type === 'help' && <HelpCircle className="h-5 w-5 text-pastel-yellow" />}
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="font-medium text-text-primary">{result.title}</h3>
                            <p className="text-sm text-text-secondary">{result.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-mint-tint rounded-xl border border-mint-green/20 animate-fade-in-up" role="status">
                    <p className="text-text-secondary">No results found. Try a different search term.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 animate-fade-in-up" role="navigation" aria-label="Main navigation">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/dashboard" aria-label="Go to family dashboard">
                  <Home className="h-5 w-5 mr-2" aria-hidden="true" />
                  Go to Dashboard
                </Link>
              </Button>
              
              <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
                <Link to="/" aria-label="Return to home page">
                  <ArrowLeft className="h-5 w-5 mr-2" aria-hidden="true" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" role="complementary" aria-label="Quick links">
          <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-mint-green/20 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <Target className="h-6 w-6 text-mint-green" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Create Goals</h3>
            <p className="text-sm text-text-secondary mb-4">Start a new family adventure together</p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/goals/create" aria-label="Create a new family goal">Get Started</Link>
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-pale-lavender/20 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <Users className="h-6 w-6 text-pale-lavender" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Family Activity</h3>
            <p className="text-sm text-text-secondary mb-4">See what everyone's been up to</p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/activity" aria-label="View family activity feed">View Feed</Link>
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-pastel-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <TrendingUp className="h-6 w-6 text-pastel-yellow" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Get Help</h3>
            <p className="text-sm text-text-secondary mb-4">Find answers and support</p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/help" aria-label="Get help and support">Learn More</Link>
            </Button>
          </Card>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8 animate-fade-in-up">
          <p className="text-text-tertiary text-sm">
            Still can't find what you're looking for?{' '}
            <Link to="/help" className="text-mint-green hover:underline font-medium">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}