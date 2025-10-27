import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mockCardsApi } from '@/api/cards';
import type {
  CardShare,
  CreateCardInput,
  UpdateCardInput,
  ShareCardInput,
  CardGenerationRequest,
} from '@/types/card';

// Query keys
export const cardKeys = {
  all: ['cards'] as const,
  lists: () => [...cardKeys.all, 'list'] as const,
  list: (familyId: string, page: number, limit: number) => 
    [...cardKeys.lists(), { familyId, page, limit }] as const,
  details: () => [...cardKeys.all, 'detail'] as const,
  detail: (id: string) => [...cardKeys.details(), id] as const,
  templates: () => [...cardKeys.all, 'templates'] as const,
  shares: (cardId: string) => [...cardKeys.all, 'shares', cardId] as const,
  analytics: (cardId: string) => [...cardKeys.all, 'analytics', cardId] as const,
  public: (shareToken: string) => [...cardKeys.all, 'public', shareToken] as const,
};

// Get cards for a family
export const useCards = (familyId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: cardKeys.list(familyId, page, limit),
    queryFn: () => mockCardsApi.getCards(familyId, page, limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get a specific card
export const useCard = (cardId: string) => {
  return useQuery({
    queryKey: cardKeys.detail(cardId),
    queryFn: () => mockCardsApi.getCard(cardId),
    enabled: !!cardId,
  });
};

// Get card templates
export const useCardTemplates = () => {
  return useQuery({
    queryKey: cardKeys.templates(),
    queryFn: () => mockCardsApi.getTemplates(),
    staleTime: 1000 * 60 * 30, // 30 minutes - templates don't change often
  });
};

// Get card shares
export const useCardShares = (cardId: string) => {
  return useQuery({
    queryKey: cardKeys.shares(cardId),
    queryFn: () => mockCardsApi.getCardShares(cardId),
    enabled: !!cardId,
  });
};

// Get card analytics
export const useCardAnalytics = (cardId: string) => {
  return useQuery({
    queryKey: cardKeys.analytics(cardId),
    queryFn: () => mockCardsApi.getCardAnalytics(cardId),
    enabled: !!cardId,
  });
};

// Get public card by share token
export const usePublicCard = (shareToken: string) => {
  return useQuery({
    queryKey: cardKeys.public(shareToken),
    queryFn: () => mockCardsApi.getPublicCard(shareToken),
    enabled: !!shareToken,
  });
};

// Create card mutation
export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCardInput) => mockCardsApi.createCard(data),
    onSuccess: (response) => {
      if (response.data) {
        // Invalidate cards list to refetch
        queryClient.invalidateQueries({ queryKey: cardKeys.lists() });
        toast.success('Card created successfully!');
      }
    },
    onError: (error) => {
      console.error('Failed to create card:', error);
      toast.error('Failed to create card. Please try again.');
    },
  });
};

// Update card mutation
export const useUpdateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCardInput) => mockCardsApi.updateCard(data),
    onSuccess: (response, variables) => {
      if (response.data) {
        // Update the specific card in cache
        queryClient.setQueryData(cardKeys.detail(variables.id), response);
        // Invalidate cards list to refetch
        queryClient.invalidateQueries({ queryKey: cardKeys.lists() });
        toast.success('Card updated successfully!');
      }
    },
    onError: (error) => {
      console.error('Failed to update card:', error);
      toast.error('Failed to update card. Please try again.');
    },
  });
};

// Delete card mutation
export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardId: string) => mockCardsApi.deleteCard(cardId),
    onSuccess: (_, cardId) => {
      // Remove the card from cache
      queryClient.removeQueries({ queryKey: cardKeys.detail(cardId) });
      // Invalidate cards list to refetch
      queryClient.invalidateQueries({ queryKey: cardKeys.lists() });
      toast.success('Card deleted successfully!');
    },
    onError: (error) => {
      console.error('Failed to delete card:', error);
      toast.error('Failed to delete card. Please try again.');
    },
  });
};

// Generate card image mutation
export const useGenerateCardImage = () => {
  return useMutation({
    mutationFn: (data: CardGenerationRequest) => mockCardsApi.generateCardImage(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Card image generated successfully!');
      } else {
        toast.error('Failed to generate card image. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Failed to generate card image:', error);
      toast.error('Failed to generate card image. Please try again.');
    },
  });
};

// Share card mutation
export const useShareCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ShareCardInput) => mockCardsApi.shareCard(data),
    onSuccess: (response, variables) => {
      if (response.data) {
        // Invalidate shares for this card
        queryClient.invalidateQueries({ queryKey: cardKeys.shares(variables.card_id) });
        toast.success('Card shared successfully!');
      }
    },
    onError: (error) => {
      console.error('Failed to share card:', error);
      toast.error('Failed to share card. Please try again.');
    },
  });
};

// Revoke card share mutation
export const useRevokeCardShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shareId: string) => mockCardsApi.revokeCardShare(shareId),
    onSuccess: (_, shareId) => {
      // Find and remove the share from all card shares caches
      queryClient.setQueriesData(
        { queryKey: cardKeys.shares('') },
        (oldData: any) => {
          if (oldData?.data) {
            return {
              ...oldData,
              data: oldData.data.filter((share: CardShare) => share.id !== shareId),
            };
          }
          return oldData;
        }
      );
      toast.success('Share revoked successfully!');
    },
    onError: (error) => {
      console.error('Failed to revoke share:', error);
      toast.error('Failed to revoke share. Please try again.');
    },
  });
};

// Update card share mutation
export const useUpdateCardShare = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shareId, data }: { shareId: string; data: Partial<CardShare> }) =>
      mockCardsApi.updateCardShare(shareId, data),
    onSuccess: (response, { shareId }) => {
      if (response.data) {
        // Update the share in all card shares caches
        queryClient.setQueriesData(
          { queryKey: cardKeys.shares('') },
          (oldData: any) => {
            if (oldData?.data) {
              return {
                ...oldData,
                data: oldData.data.map((share: CardShare) =>
                  share.id === shareId ? response.data : share
                ),
              };
            }
            return oldData;
          }
        );
        toast.success('Share updated successfully!');
      }
    },
    onError: (error) => {
      console.error('Failed to update share:', error);
      toast.error('Failed to update share. Please try again.');
    },
  });
};