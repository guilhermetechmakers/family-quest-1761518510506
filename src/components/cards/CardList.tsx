import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Share2,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Plus,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import type { ShareableCard, CardStatus } from '@/types/card';
import { useDeleteCard } from '@/hooks/useCards';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CardListProps {
  cards: ShareableCard[];
  isLoading?: boolean;
  onCardClick?: (card: ShareableCard) => void;
  onEditCard?: (card: ShareableCard) => void;
  onShareCard?: (card: ShareableCard) => void;
  onCreateCard?: () => void;
}

export function CardList({
  cards,
  isLoading = false,
  onCardClick,
  onEditCard,
  onShareCard,
  onCreateCard,
}: CardListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CardStatus | 'all'>('all');
  const [templateFilter, setTemplateFilter] = useState<string>('all');

  const deleteCardMutation = useDeleteCard();

  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    const matchesTemplate = templateFilter === 'all' || card.template_id === templateFilter;

    return matchesSearch && matchesStatus && matchesTemplate;
  });

  const handleDeleteCard = async (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      try {
        await deleteCardMutation.mutateAsync(cardId);
        toast.success('Card deleted successfully');
      } catch (error) {
        console.error('Failed to delete card:', error);
        toast.error('Failed to delete card. Please try again.');
      }
    }
  };

  const getStatusColor = (status: CardStatus) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case 'celebration':
        return '🎉';
      case 'progress':
        return '📊';
      case 'achievement':
        return '🏆';
      case 'family':
        return '👨‍👩‍👧‍👦';
      default:
        return '📄';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Cards</h2>
          <p className="text-gray-600">
            {filteredCards.length} of {cards.length} cards
          </p>
        </div>
        <Button onClick={onCreateCard} className="bg-gradient-to-r from-primary to-primary/80">
          <Plus className="h-4 w-4 mr-2" />
          Create New Card
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CardStatus | 'all')}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={templateFilter} onValueChange={setTemplateFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                <SelectItem value="celebration">Celebration</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Share2 className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No cards found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' || templateFilter !== 'all'
                    ? 'Try adjusting your filters to see more cards.'
                    : 'Create your first shareable card to celebrate your family\'s achievements.'}
                </p>
              </div>
              {!searchTerm && statusFilter === 'all' && templateFilter === 'all' && (
                <Button onClick={onCreateCard} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Card
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card
              key={card.id}
              className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => onCardClick?.(card)}
            >
              <CardContent className="p-0">
                {/* Card Preview */}
                <div
                  className="h-48 rounded-t-lg flex flex-col items-center justify-center p-4 text-center relative overflow-hidden"
                  style={{
                    backgroundColor: card.color_scheme.background,
                    color: card.color_scheme.text,
                  }}
                >
                  {/* Background Pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      background: `radial-gradient(circle at 20% 80%, ${card.color_scheme.primary} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${card.color_scheme.secondary} 0%, transparent 50%)`,
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-2xl mb-2">
                      {getTemplateIcon(card.template_id)}
                    </div>
                    <h3 className="font-bold text-sm mb-1 line-clamp-2">
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p 
                        className="text-xs mb-2 line-clamp-1"
                        style={{ color: card.color_scheme.text_secondary }}
                      >
                        {card.subtitle}
                      </p>
                    )}
                    <div
                      className="w-8 h-8 rounded-full mx-auto"
                      style={{ backgroundColor: card.color_scheme.primary }}
                    />
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={cn('text-xs', getStatusColor(card.status))}>
                      {card.status}
                    </Badge>
                    <span className="text-xs text-gray-500 capitalize">
                      {card.template_id.replace('_', ' ')}
                    </span>
                  </div>

                  {card.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {card.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(card.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {card.status === 'published' ? 'Shared' : 'Draft'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCardClick?.(card);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShareCard?.(card);
                        }}
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditCard?.(card)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}