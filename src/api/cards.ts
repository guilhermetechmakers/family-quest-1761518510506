import { api } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/api';
import type {
  ShareableCard,
  CardShare,
  CardAnalytics,
  CreateCardInput,
  UpdateCardInput,
  ShareCardInput,
  CardGenerationRequest,
  CardGenerationResponse,
  CardTemplate,
} from '@/types/card';

// Card CRUD operations
export const cardsApi = {
  // Get all cards for a family
  getCards: (familyId: string, page = 1, limit = 20) =>
    api.get(`/cards?family_id=${familyId}&page=${page}&limit=${limit}`) as Promise<PaginatedResponse<ShareableCard>>,

  // Get a specific card
  getCard: (cardId: string) =>
    api.get(`/cards/${cardId}`) as Promise<ApiResponse<ShareableCard>>,

  // Create a new card
  createCard: (data: CreateCardInput) =>
    api.post('/cards', data) as Promise<ApiResponse<ShareableCard>>,

  // Update a card
  updateCard: (data: UpdateCardInput) =>
    api.put(`/cards/${data.id}`, data) as Promise<ApiResponse<ShareableCard>>,

  // Delete a card
  deleteCard: (cardId: string) =>
    api.delete(`/cards/${cardId}`) as Promise<ApiResponse<void>>,

  // Get card templates
  getTemplates: () =>
    api.get('/cards/templates') as Promise<ApiResponse<CardTemplate[]>>,

  // Generate card image
  generateCardImage: (data: CardGenerationRequest) =>
    api.post('/cards/generate', data) as Promise<CardGenerationResponse>,

  // Share a card
  shareCard: (data: ShareCardInput) =>
    api.post('/cards/share', data) as Promise<ApiResponse<CardShare>>,

  // Get card shares
  getCardShares: (cardId: string) =>
    api.get(`/cards/${cardId}/shares`) as Promise<ApiResponse<CardShare[]>>,

  // Get card analytics
  getCardAnalytics: (cardId: string) =>
    api.get(`/cards/${cardId}/analytics`) as Promise<ApiResponse<CardAnalytics>>,

  // Get public card by share token
  getPublicCard: (shareToken: string) =>
    api.get(`/cards/public/${shareToken}`) as Promise<ApiResponse<ShareableCard>>,

  // Revoke card share
  revokeCardShare: (shareId: string) =>
    api.delete(`/cards/shares/${shareId}`) as Promise<ApiResponse<void>>,

  // Update card share
  updateCardShare: (shareId: string, data: Partial<CardShare>) =>
    api.patch(`/cards/shares/${shareId}`, data) as Promise<ApiResponse<CardShare>>,
};

// Mock data for development
export const mockCardsApi = {
  getCards: async (familyId: string, page = 1, limit = 20): Promise<PaginatedResponse<ShareableCard>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockCards: ShareableCard[] = [
      {
        id: '1',
        milestone_id: 'milestone-1',
        goal_id: 'goal-1',
        template_id: 'celebration',
        title: 'First Milestone Achieved!',
        subtitle: 'Family Vacation Fund',
        description: 'We\'ve reached our first milestone towards our dream vacation!',
        custom_text: 'So proud of our family teamwork!',
        color_scheme: {
          primary: '#B9F5D0',
          secondary: '#A7F3D0',
          accent: '#C4B5FD',
          background: '#ECFDF5',
          text: '#121212',
          text_secondary: '#717171',
        },
        image_url: '/images/vacation-goal.jpg',
        generated_image_url: '/generated/card-1.png',
        share_token: 'share-token-1',
        status: 'published',
        created_by: 'user-1',
        family_id: familyId,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        published_at: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        milestone_id: 'milestone-2',
        goal_id: 'goal-2',
        template_id: 'progress',
        title: 'New Pet Fund Progress',
        subtitle: '50% Complete!',
        description: 'Halfway to bringing home our new family member',
        color_scheme: {
          primary: '#E2D7FB',
          secondary: '#C4B5FD',
          accent: '#F7E1F5',
          background: '#F6F6FF',
          text: '#121212',
          text_secondary: '#717171',
        },
        share_token: 'share-token-2',
        status: 'published',
        created_by: 'user-1',
        family_id: familyId,
        created_at: '2024-01-14T15:20:00Z',
        updated_at: '2024-01-14T15:20:00Z',
        published_at: '2024-01-14T15:20:00Z',
      },
    ];

    return {
      data: mockCards.slice((page - 1) * limit, page * limit),
      count: mockCards.length,
      page,
      limit,
    };
  },

  getCard: async (cardId: string): Promise<ApiResponse<ShareableCard>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockCard: ShareableCard = {
      id: cardId,
      milestone_id: 'milestone-1',
      goal_id: 'goal-1',
      template_id: 'celebration',
      title: 'First Milestone Achieved!',
      subtitle: 'Family Vacation Fund',
      description: 'We\'ve reached our first milestone towards our dream vacation!',
      custom_text: 'So proud of our family teamwork!',
      color_scheme: {
        primary: '#B9F5D0',
        secondary: '#A7F3D0',
        accent: '#C4B5FD',
        background: '#ECFDF5',
        text: '#121212',
        text_secondary: '#717171',
      },
      image_url: '/images/vacation-goal.jpg',
      generated_image_url: '/generated/card-1.png',
      share_token: 'share-token-1',
      status: 'published',
      created_by: 'user-1',
      family_id: 'family-1',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      published_at: '2024-01-15T10:30:00Z',
    };

    return { data: mockCard, error: null };
  },

  createCard: async (data: CreateCardInput): Promise<ApiResponse<ShareableCard>> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newCard: ShareableCard = {
      id: `card-${Date.now()}`,
      milestone_id: data.milestone_id,
      goal_id: data.goal_id,
      template_id: data.template_id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      custom_text: data.custom_text,
      color_scheme: data.color_scheme,
      image_url: data.image_url,
      share_token: `share-token-${Date.now()}`,
      status: 'draft',
      created_by: 'user-1',
      family_id: 'family-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return { data: newCard, error: null };
  },

  updateCard: async (data: UpdateCardInput): Promise<ApiResponse<ShareableCard>> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const updatedCard: ShareableCard = {
      id: data.id,
      milestone_id: 'milestone-1',
      goal_id: 'goal-1',
      template_id: 'celebration',
      title: data.title || 'Updated Card Title',
      subtitle: data.subtitle,
      description: data.description,
      custom_text: data.custom_text,
      color_scheme: data.color_scheme || {
        primary: '#B9F5D0',
        secondary: '#A7F3D0',
        accent: '#C4B5FD',
        background: '#ECFDF5',
        text: '#121212',
        text_secondary: '#717171',
      },
      image_url: data.image_url,
      share_token: 'share-token-1',
      status: data.status || 'published',
      created_by: 'user-1',
      family_id: 'family-1',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: new Date().toISOString(),
      published_at: data.status === 'published' ? new Date().toISOString() : undefined,
    };

    return { data: updatedCard, error: null };
  },

  deleteCard: async (_cardId: string): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { data: null, error: null };
  },

  getTemplates: async (): Promise<ApiResponse<CardTemplate[]>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const templates: CardTemplate[] = [
      {
        id: 'celebration',
        name: 'Milestone Celebration',
        description: 'Perfect for celebrating achieved milestones',
        preview_url: '/templates/celebration-preview.png',
        color_schemes: [
          {
            primary: '#B9F5D0',
            secondary: '#A7F3D0',
            accent: '#C4B5FD',
            background: '#ECFDF5',
            text: '#121212',
            text_secondary: '#717171',
          },
          {
            primary: '#E2D7FB',
            secondary: '#C4B5FD',
            accent: '#F7E1F5',
            background: '#F6F6FF',
            text: '#121212',
            text_secondary: '#717171',
          },
          {
            primary: '#FFE9A7',
            secondary: '#F7E1F5',
            accent: '#B9F5D0',
            background: '#FFF8E7',
            text: '#121212',
            text_secondary: '#717171',
          },
        ],
        layout: {
          type: 'vertical',
          elements: [],
          dimensions: { width: 400, height: 400 },
        },
        is_premium: false,
      },
      {
        id: 'progress',
        name: 'Progress Update',
        description: 'Show off your family\'s progress towards a goal',
        preview_url: '/templates/progress-preview.png',
        color_schemes: [
          {
            primary: '#B9F5D0',
            secondary: '#A7F3D0',
            accent: '#C4B5FD',
            background: '#ECFDF5',
            text: '#121212',
            text_secondary: '#717171',
          },
          {
            primary: '#E2D7FB',
            secondary: '#C4B5FD',
            accent: '#F7E1F5',
            background: '#F6F6FF',
            text: '#121212',
            text_secondary: '#717171',
          },
          {
            primary: '#F7E1F5',
            secondary: '#E2D7FB',
            accent: '#FFE9A7',
            background: '#F7FAFC',
            text: '#121212',
            text_secondary: '#717171',
          },
        ],
        layout: {
          type: 'horizontal',
          elements: [],
          dimensions: { width: 320, height: 300 },
        },
        is_premium: false,
      },
      {
        id: 'achievement',
        name: 'Achievement Unlocked',
        description: 'Gamified achievement card for major milestones',
        preview_url: '/templates/achievement-preview.png',
        color_schemes: [
          {
            primary: '#FFE9A7',
            secondary: '#F7E1F5',
            accent: '#B9F5D0',
            background: '#FFF8E7',
            text: '#121212',
            text_secondary: '#717171',
          },
          {
            primary: '#B9F5D0',
            secondary: '#A7F3D0',
            accent: '#C4B5FD',
            background: '#ECFDF5',
            text: '#121212',
            text_secondary: '#717171',
          },
          {
            primary: '#E2D7FB',
            secondary: '#C4B5FD',
            accent: '#F7E1F5',
            background: '#F6F6FF',
            text: '#121212',
            text_secondary: '#717171',
          },
        ],
        layout: {
          type: 'square',
          elements: [],
          dimensions: { width: 320, height: 320 },
        },
        is_premium: true,
      },
    ];

    return { data: templates, error: null };
  },

  generateCardImage: async (_data: CardGenerationRequest): Promise<CardGenerationResponse> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate image generation time
    
    return {
      success: true,
      image_url: `/generated/card-${Date.now()}.png`,
      share_token: `share-token-${Date.now()}`,
    };
  },

  shareCard: async (data: ShareCardInput): Promise<ApiResponse<CardShare>> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const share: CardShare = {
      id: `share-${Date.now()}`,
      card_id: data.card_id,
      share_token: `share-token-${Date.now()}`,
      platform: data.platform,
      share_url: `https://familyquest.app/share/${data.card_id}`,
      views_count: 0,
      clicks_count: 0,
      created_at: new Date().toISOString(),
      expires_at: data.expires_in_days ? 
        new Date(Date.now() + data.expires_in_days * 24 * 60 * 60 * 1000).toISOString() : 
        undefined,
      is_active: true,
    };

    return { data: share, error: null };
  },

  getCardShares: async (_cardId: string): Promise<ApiResponse<CardShare[]>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const shares: CardShare[] = [
      {
        id: 'share-1',
        card_id: 'card-1',
        share_token: 'share-token-1',
        platform: 'facebook',
        share_url: 'https://familyquest.app/share/card-1',
        views_count: 42,
        clicks_count: 8,
        created_at: '2024-01-15T10:30:00Z',
        is_active: true,
      },
      {
        id: 'share-2',
        card_id: 'card-1',
        share_token: 'share-token-2',
        platform: 'twitter',
        share_url: 'https://familyquest.app/share/card-1',
        views_count: 28,
        clicks_count: 5,
        created_at: '2024-01-15T11:00:00Z',
        is_active: true,
      },
    ];

    return { data: shares, error: null };
  },

  getCardAnalytics: async (cardId: string): Promise<ApiResponse<CardAnalytics>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const analytics: CardAnalytics = {
      card_id: cardId,
      total_views: 150,
      total_clicks: 25,
      platform_breakdown: [
        { platform: 'facebook', views: 80, clicks: 12 },
        { platform: 'twitter', views: 45, clicks: 8 },
        { platform: 'instagram', views: 25, clicks: 5 },
      ],
      daily_stats: [
        { date: '2024-01-15', views: 50, clicks: 8 },
        { date: '2024-01-16', views: 75, clicks: 12 },
        { date: '2024-01-17', views: 25, clicks: 5 },
      ],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-17T15:20:00Z',
    };

    return { data: analytics, error: null };
  },

  getPublicCard: async (_shareToken: string): Promise<ApiResponse<ShareableCard>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const publicCard: ShareableCard = {
      id: 'public-card-1',
      milestone_id: 'milestone-1',
      goal_id: 'goal-1',
      template_id: 'celebration',
      title: 'First Milestone Achieved!',
      subtitle: 'Family Vacation Fund',
      description: 'We\'ve reached our first milestone towards our dream vacation!',
      custom_text: 'So proud of our family teamwork!',
      color_scheme: {
        primary: '#B9F5D0',
        secondary: '#A7F3D0',
        accent: '#C4B5FD',
        background: '#ECFDF5',
        text: '#121212',
        text_secondary: '#717171',
      },
      image_url: '/images/vacation-goal.jpg',
      generated_image_url: '/generated/card-1.png',
      share_token: 'share-token-1',
      status: 'published',
      created_by: 'user-1',
      family_id: 'family-1',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
      published_at: '2024-01-15T10:30:00Z',
    };

    return { data: publicCard, error: null };
  },

  revokeCardShare: async (_shareId: string): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: null, error: null };
  },

  updateCardShare: async (shareId: string, data: Partial<CardShare>): Promise<ApiResponse<CardShare>> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const updatedShare: CardShare = {
      id: shareId,
      card_id: 'card-1',
      share_token: 'share-token-1',
      platform: data.platform || 'facebook',
      share_url: 'https://familyquest.app/share/card-1',
      views_count: data.views_count || 42,
      clicks_count: data.clicks_count || 8,
      created_at: '2024-01-15T10:30:00Z',
      expires_at: data.expires_at,
      is_active: data.is_active !== undefined ? data.is_active : true,
    };

    return { data: updatedShare, error: null };
  },
};