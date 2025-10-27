import { Calendar, DollarSign, Users, Target, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import type { SearchResult } from '@/types/search';

interface SearchResultCardProps {
  result: SearchResult;
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

export function SearchResultCard({ result, onResultClick, className }: SearchResultCardProps) {
  const handleClick = () => {
    onResultClick?.(result);
  };

  const getEntityIcon = () => {
    switch (result.entity_type) {
      case 'goal':
        return <Target className="h-5 w-5 text-mint-green" />;
      case 'activity':
        return <Users className="h-5 w-5 text-pale-lavender" />;
      case 'transaction':
        return <DollarSign className="h-5 w-5 text-light-pink" />;
      case 'member':
        return <Users className="h-5 w-5 text-pastel-yellow" />;
      default:
        return <Target className="h-5 w-5 text-text-tertiary" />;
    }
  };

  const getEntityTypeLabel = () => {
    switch (result.entity_type) {
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

  const getStatusBadge = () => {
    if (result.goal?.status) {
      const status = result.goal.status;
      switch (status) {
        case 'active':
          return <Badge className="bg-mint-green text-text-primary">Active</Badge>;
        case 'completed':
          return <Badge className="bg-pastel-yellow text-text-primary">Completed</Badge>;
        case 'paused':
          return <Badge className="bg-light-pink text-text-primary">Paused</Badge>;
        case 'cancelled':
          return <Badge className="bg-gray-200 text-text-primary">Cancelled</Badge>;
        default:
          return <Badge variant="secondary">{status}</Badge>;
      }
    }
    
    if (result.transaction?.status) {
      const status = result.transaction.status;
      switch (status) {
        case 'completed':
          return <Badge className="bg-mint-green text-text-primary">Completed</Badge>;
        case 'pending':
          return <Badge className="bg-pastel-yellow text-text-primary">Pending</Badge>;
        case 'failed':
          return <Badge className="bg-red-200 text-red-800">Failed</Badge>;
        default:
          return <Badge variant="secondary">{status}</Badge>;
      }
    }
    
    return null;
  };


  const renderGoalContent = () => {
    if (!result.goal) return null;
    
    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary truncate">
              {result.goal.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {result.goal.description}
            </p>
          </div>
          {result.goal.image_url && (
            <img
              src={result.goal.image_url}
              alt={result.goal.title}
              className="w-16 h-16 rounded-lg object-cover ml-3 flex-shrink-0"
            />
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4" />
              <span>
                {result.goal.current_value.toLocaleString()} / {result.goal.target_value.toLocaleString()} {result.goal.currency}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{result.goal.owner.full_name}</span>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-mint-green h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((result.goal.current_value / result.goal.target_value) * 100, 100)}%`
            }}
          />
        </div>
      </div>
    );
  };

  const renderActivityContent = () => {
    if (!result.activity) return null;
    
    return (
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={result.activity.user.avatar_url} />
            <AvatarFallback className="bg-mint-green text-text-primary">
              {result.activity.user.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary">
              {result.activity.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {result.activity.description}
            </p>
            {result.activity.goal && (
              <div className="flex items-center space-x-2 mt-2">
                <Target className="h-4 w-4 text-text-tertiary" />
                <span className="text-sm text-text-tertiary">
                  {result.activity.goal.title}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-sm text-text-secondary">
            <Calendar className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}</span>
          </div>
          <Badge variant="secondary">{result.activity.type.replace('_', ' ')}</Badge>
        </div>
      </div>
    );
  };

  const renderTransactionContent = () => {
    if (!result.transaction) return null;
    
    return (
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary">
              {result.transaction.description || `${result.transaction.type} Transaction`}
            </h3>
            <div className="flex items-center space-x-4 mt-1 text-sm text-text-secondary">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{result.transaction.contributor.full_name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>{result.transaction.goal.title}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-text-primary">
              {result.transaction.amount.toLocaleString()} {result.transaction.currency}
            </div>
            {getStatusBadge()}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-sm text-text-secondary">
          <Calendar className="h-4 w-4" />
          <span>{formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}</span>
        </div>
      </div>
    );
  };

  const renderMemberContent = () => {
    if (!result.member) return null;
    
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={result.member.avatar_url} />
            <AvatarFallback className="bg-pastel-yellow text-text-primary">
              {result.member.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary">
              {result.member.full_name}
            </h3>
            <p className="text-sm text-text-secondary">
              {result.member.email}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {result.member.role}
              </Badge>
              <span className="text-xs text-text-tertiary">
                Joined {formatDistanceToNow(new Date(result.member.joined_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (result.entity_type) {
      case 'goal':
        return renderGoalContent();
      case 'activity':
        return renderActivityContent();
      case 'transaction':
        return renderTransactionContent();
      case 'member':
        return renderMemberContent();
      default:
        return (
          <div>
            <h3 className="font-semibold text-text-primary">{result.title}</h3>
            <p className="text-sm text-text-secondary mt-1">{result.description}</p>
          </div>
        );
    }
  };

  return (
    <Card 
      className={cn(
        "card-hover cursor-pointer group",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getEntityIcon()}
            <Badge variant="outline" className="text-xs">
              {getEntityTypeLabel()}
            </Badge>
          </div>
          <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-text-primary transition-colors" />
        </div>
        
        {renderContent()}
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-text-tertiary">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}</span>
          </div>
          <div className="text-xs text-text-tertiary">
            {Math.round(result.relevance_score * 100)}% match
          </div>
        </div>
      </CardContent>
    </Card>
  );
}