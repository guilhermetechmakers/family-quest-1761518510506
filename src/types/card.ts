export type CardTemplateType = 'celebration' | 'milestone' | 'achievement' | 'progress' | 'family' | 'custom';
export type CardStatus = 'draft' | 'published' | 'archived';
export type SharePlatform = 'facebook' | 'twitter' | 'instagram' | 'whatsapp' | 'email' | 'link';

export interface ShareableCard {
  id: string;
  milestone_id: string;
  goal_id: string;
  template_id: CardTemplateType;
  title: string;
  subtitle?: string;
  description?: string;
  custom_text?: string;
  color_scheme: CardColorScheme;
  image_url?: string;
  generated_image_url?: string;
  share_token: string;
  status: CardStatus;
  created_by: string;
  family_id: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface CardColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  text_secondary: string;
}

export interface CardTemplate {
  id: CardTemplateType;
  name: string;
  description: string;
  preview_url: string;
  color_schemes: CardColorScheme[];
  layout: CardLayout;
  is_premium: boolean;
}

export interface CardLayout {
  type: 'vertical' | 'horizontal' | 'square';
  elements: CardElement[];
  dimensions: {
    width: number;
    height: number;
  };
}

export interface CardElement {
  id: string;
  type: 'text' | 'image' | 'progress_bar' | 'milestone_list' | 'family_avatars' | 'achievement_badge';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style: {
    font_size?: number;
    font_weight?: string;
    color?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  content?: string;
  data_source?: string;
}

export interface CardShare {
  id: string;
  card_id: string;
  share_token: string;
  platform?: SharePlatform;
  share_url: string;
  views_count: number;
  clicks_count: number;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface CardAnalytics {
  card_id: string;
  total_views: number;
  total_clicks: number;
  platform_breakdown: {
    platform: SharePlatform;
    views: number;
    clicks: number;
  }[];
  daily_stats: {
    date: string;
    views: number;
    clicks: number;
  }[];
  created_at: string;
  updated_at: string;
}

export interface CreateCardInput {
  milestone_id: string;
  goal_id: string;
  template_id: CardTemplateType;
  title: string;
  subtitle?: string;
  description?: string;
  custom_text?: string;
  color_scheme: CardColorScheme;
  image_url?: string;
}

export interface UpdateCardInput {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  custom_text?: string;
  color_scheme?: CardColorScheme;
  image_url?: string;
  status?: CardStatus;
}

export interface ShareCardInput {
  card_id: string;
  platform?: SharePlatform;
  custom_message?: string;
  expires_in_days?: number;
}

export interface CardGenerationRequest {
  card_id: string;
  template_id: CardTemplateType;
  data: {
    title: string;
    subtitle?: string;
    description?: string;
    custom_text?: string;
    milestone_data: {
      title: string;
      achieved_at: string;
      goal_title: string;
      progress_percentage: number;
    };
    family_data: {
      name: string;
      member_count: number;
      avatars: string[];
    };
    color_scheme: CardColorScheme;
  };
  dimensions: {
    width: number;
    height: number;
  };
}

export interface CardGenerationResponse {
  success: boolean;
  image_url?: string;
  share_token?: string;
  error?: string;
}

// Predefined color schemes following Family Quest design system
export const CARD_COLOR_SCHEMES: Record<string, CardColorScheme> = {
  mint_celebration: {
    primary: '#B9F5D0',
    secondary: '#A7F3D0',
    accent: '#C4B5FD',
    background: '#ECFDF5',
    text: '#121212',
    text_secondary: '#717171',
  },
  lavender_dream: {
    primary: '#E2D7FB',
    secondary: '#C4B5FD',
    accent: '#F7E1F5',
    background: '#F6F6FF',
    text: '#121212',
    text_secondary: '#717171',
  },
  sunny_achievement: {
    primary: '#FFE9A7',
    secondary: '#F7E1F5',
    accent: '#B9F5D0',
    background: '#FFF8E7',
    text: '#121212',
    text_secondary: '#717171',
  },
  family_warmth: {
    primary: '#F7E1F5',
    secondary: '#E2D7FB',
    accent: '#FFE9A7',
    background: '#F7FAFC',
    text: '#121212',
    text_secondary: '#717171',
  },
};

// Predefined card templates
export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'celebration',
    name: 'Milestone Celebration',
    description: 'Perfect for celebrating achieved milestones',
    preview_url: '/templates/celebration-preview.png',
    color_schemes: [
      CARD_COLOR_SCHEMES.mint_celebration,
      CARD_COLOR_SCHEMES.lavender_dream,
      CARD_COLOR_SCHEMES.sunny_achievement,
    ],
    layout: {
      type: 'vertical',
      elements: [
        {
          id: 'title',
          type: 'text',
          position: { x: 20, y: 20, width: 360, height: 60 },
          style: { font_size: 32, font_weight: '600', color: '#121212', alignment: 'center' },
          content: '{{title}}',
        },
        {
          id: 'subtitle',
          type: 'text',
          position: { x: 20, y: 90, width: 360, height: 30 },
          style: { font_size: 18, font_weight: '500', color: '#717171', alignment: 'center' },
          content: '{{subtitle}}',
        },
        {
          id: 'milestone_badge',
          type: 'achievement_badge',
          position: { x: 150, y: 140, width: 100, height: 100 },
          style: {},
        },
        {
          id: 'description',
          type: 'text',
          position: { x: 20, y: 260, width: 360, height: 60 },
          style: { font_size: 16, font_weight: '400', color: '#121212', alignment: 'center' },
          content: '{{description}}',
        },
        {
          id: 'family_avatars',
          type: 'family_avatars',
          position: { x: 20, y: 340, width: 360, height: 40 },
          style: {},
        },
      ],
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
      CARD_COLOR_SCHEMES.mint_celebration,
      CARD_COLOR_SCHEMES.lavender_dream,
      CARD_COLOR_SCHEMES.family_warmth,
    ],
    layout: {
      type: 'horizontal',
      elements: [
        {
          id: 'title',
          type: 'text',
          position: { x: 20, y: 20, width: 280, height: 40 },
          style: { font_size: 24, font_weight: '600', color: '#121212', alignment: 'left' },
          content: '{{title}}',
        },
        {
          id: 'progress_bar',
          type: 'progress_bar',
          position: { x: 20, y: 80, width: 280, height: 20 },
          style: {},
        },
        {
          id: 'milestone_list',
          type: 'milestone_list',
          position: { x: 20, y: 120, width: 280, height: 100 },
          style: {},
        },
        {
          id: 'family_avatars',
          type: 'family_avatars',
          position: { x: 20, y: 240, width: 280, height: 40 },
          style: {},
        },
      ],
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
      CARD_COLOR_SCHEMES.sunny_achievement,
      CARD_COLOR_SCHEMES.mint_celebration,
      CARD_COLOR_SCHEMES.lavender_dream,
    ],
    layout: {
      type: 'square',
      elements: [
        {
          id: 'achievement_badge',
          type: 'achievement_badge',
          position: { x: 100, y: 50, width: 120, height: 120 },
          style: {},
        },
        {
          id: 'title',
          type: 'text',
          position: { x: 20, y: 190, width: 280, height: 40 },
          style: { font_size: 20, font_weight: '600', color: '#121212', alignment: 'center' },
          content: '{{title}}',
        },
        {
          id: 'description',
          type: 'text',
          position: { x: 20, y: 240, width: 280, height: 40 },
          style: { font_size: 14, font_weight: '400', color: '#717171', alignment: 'center' },
          content: '{{description}}',
        },
      ],
      dimensions: { width: 320, height: 320 },
    },
    is_premium: true,
  },
];