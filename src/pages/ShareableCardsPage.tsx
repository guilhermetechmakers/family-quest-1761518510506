import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Share2,
  Plus,
  BarChart3,
  Eye,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { CardCreationForm } from '@/components/cards/CardCreationForm';
import { CardList } from '@/components/cards/CardList';
import { CardPreviewModal } from '@/components/cards/CardPreviewModal';
import { CardAnalytics } from '@/components/cards/CardAnalytics';
import { useCards, useCardAnalytics } from '@/hooks/useCards';
import type { ShareableCard } from '@/types/card';

// Mock milestones data - in a real app this would come from the goals API
const mockMilestones = [
  {
    id: 'milestone-1',
    title: 'First $500 Saved!',
    goal_id: 'goal-1',
    goal_title: 'Family Vacation Fund',
    achieved_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'milestone-2',
    title: 'Halfway There!',
    goal_id: 'goal-2',
    goal_title: 'New Pet Fund',
    achieved_at: '2024-01-14T15:20:00Z',
  },
  {
    id: 'milestone-3',
    title: 'Kitchen Renovation Complete!',
    goal_id: 'goal-3',
    goal_title: 'Home Improvement',
    achieved_at: '2024-01-12T09:15:00Z',
  },
];

export function ShareableCardsPage() {
  const [activeTab, setActiveTab] = useState('cards');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ShareableCard | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [editingCard, setEditingCard] = useState<ShareableCard | null>(null);

  // Mock family ID - in a real app this would come from auth context
  const familyId = 'family-1';
  
  const { data: cardsData, isLoading: cardsLoading } = useCards(familyId);
  const { data: analyticsData, isLoading: analyticsLoading } = useCardAnalytics('card-1');

  const cards = cardsData?.data || [];
  const analytics = analyticsData?.data;

  const handleCreateCard = () => {
    setShowCreateForm(true);
    setActiveTab('create');
  };

  const handleCardCreated = (cardId: string) => {
    setShowCreateForm(false);
    setActiveTab('cards');
    // In a real app, we might want to show the created card
    console.log('Card created:', cardId);
  };

  const handleCardClick = (card: ShareableCard) => {
    setSelectedCard(card);
    setShowPreview(true);
  };

  const handleEditCard = (card: ShareableCard) => {
    setEditingCard(card);
    setActiveTab('create');
  };

  const handleShareCard = (card: ShareableCard) => {
    setSelectedCard(card);
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedCard(null);
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    setEditingCard(null);
    setActiveTab('cards');
  };

  // Calculate summary stats
  const totalCards = cards.length;
  const publishedCards = cards.filter(card => card.status === 'published').length;
  const totalViews = analytics?.total_views || 0;
  const totalClicks = analytics?.total_clicks || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-lg">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                Shareable Cards
              </h1>
              <p className="text-gray-600 mt-2">
                Create beautiful cards to celebrate your family's achievements and share them with the world
              </p>
            </div>
            <Button
              onClick={handleCreateCard}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Card
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cards</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCards}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Share2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-gray-900">{publishedCards}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              My Cards
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-6">
            <CardList
              cards={cards}
              isLoading={cardsLoading}
              onCardClick={handleCardClick}
              onEditCard={handleEditCard}
              onShareCard={handleShareCard}
              onCreateCard={handleCreateCard}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {analytics ? (
              <CardAnalytics analytics={analytics} isLoading={analyticsLoading} />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">No Analytics Available</h3>
                      <p className="text-gray-600">
                        Create and share some cards to see analytics and performance insights.
                      </p>
                    </div>
                    <Button onClick={handleCreateCard} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Card
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            {showCreateForm || editingCard ? (
              <CardCreationForm
                milestones={mockMilestones}
                onSuccess={handleCardCreated}
                onCancel={handleCloseCreateForm}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Create Your First Card</h3>
                      <p className="text-gray-600">
                        Choose a milestone to celebrate and create a beautiful shareable card.
                      </p>
                    </div>
                    <Button onClick={handleCreateCard} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Card Preview Modal */}
        <CardPreviewModal
          card={selectedCard}
          isOpen={showPreview}
          onClose={handleClosePreview}
          onEdit={() => {
            if (selectedCard) {
              handleEditCard(selectedCard);
              setShowPreview(false);
            }
          }}
        />
      </div>
    </div>
  );
}