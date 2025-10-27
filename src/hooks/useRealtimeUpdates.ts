import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface RealtimeUpdate {
  type: 'activity_created' | 'activity_updated' | 'activity_deleted' | 'comment_added' | 'reaction_added' | 'reaction_removed';
  data: any;
  timestamp: string;
}

interface UseRealtimeUpdatesProps {
  familyId: string;
  enabled?: boolean;
  onActivityUpdate?: (update: RealtimeUpdate) => void;
  onCommentUpdate?: (update: RealtimeUpdate) => void;
  onReactionUpdate?: (update: RealtimeUpdate) => void;
}

export function useRealtimeUpdates({
  familyId,
  enabled = true,
  onActivityUpdate,
  onCommentUpdate,
  onReactionUpdate,
}: UseRealtimeUpdatesProps) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!enabled || !familyId) return;

    try {
      // In a real app, this would connect to your WebSocket server
      // For now, we'll simulate the connection
      console.log(`Connecting to realtime updates for family: ${familyId}`);
      
      // Simulate WebSocket connection
      const mockWs = {
        readyState: WebSocket.OPEN,
        close: () => console.log('Mock WebSocket closed'),
        send: (data: string) => console.log('Mock WebSocket send:', data),
        addEventListener: (event: string, handler: Function) => {
          if (event === 'message') {
            // Simulate receiving updates every 30 seconds for demo
            const interval = setInterval(() => {
              const mockUpdate: RealtimeUpdate = {
                type: 'activity_created',
                data: {
                  id: `activity-${Date.now()}`,
                  family_id: familyId,
                  user_id: 'user-1',
                  type: 'contribution',
                  title: 'New contribution added!',
                  description: 'Someone just made a contribution to a family goal.',
                  created_at: new Date().toISOString(),
                  user: {
                    id: 'user-1',
                    full_name: 'Sarah Johnson',
                    avatar_url: undefined
                  }
                },
                timestamp: new Date().toISOString()
              };
              handler({ data: JSON.stringify(mockUpdate) });
            }, 30000);
            
            // Store interval for cleanup
            (mockWs as any).interval = interval;
          }
        },
        removeEventListener: () => {
          if ((mockWs as any).interval) {
            clearInterval((mockWs as any).interval);
          }
        }
      };

      wsRef.current = mockWs as any;

      // Handle incoming messages
      const handleMessage = (event: MessageEvent) => {
        try {
          const update: RealtimeUpdate = JSON.parse(event.data);
          handleRealtimeUpdate(update);
        } catch (error) {
          console.error('Error parsing realtime update:', error);
        }
      };

      // Handle connection close
      const handleClose = () => {
        console.log('WebSocket connection closed');
        wsRef.current = null;
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
            connect();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
          toast.error('Connection lost. Please refresh the page.');
        }
      };

      // Handle connection open
      const handleOpen = () => {
        console.log('WebSocket connection established');
        reconnectAttempts.current = 0;
        toast.success('Real-time updates connected');
      };

      // Add event listeners
      mockWs.addEventListener('message', handleMessage);
      mockWs.addEventListener('close', handleClose);
      mockWs.addEventListener('open', handleOpen);

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      toast.error('Failed to connect to real-time updates');
    }
  }, [enabled, familyId]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    reconnectAttempts.current = 0;
  }, []);

  const handleRealtimeUpdate = useCallback((update: RealtimeUpdate) => {
    console.log('Received realtime update:', update);

    // Invalidate relevant queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['activities', 'feed'] });
    queryClient.invalidateQueries({ queryKey: ['activities', familyId] });

    // Handle specific update types
    switch (update.type) {
      case 'activity_created':
        onActivityUpdate?.(update);
        toast.success('New activity posted!', {
          description: update.data.title,
          duration: 5000,
        });
        break;
        
      case 'comment_added':
        onCommentUpdate?.(update);
        toast.info('New comment added', {
          description: 'Someone commented on an activity',
          duration: 3000,
        });
        break;
        
      case 'reaction_added':
        onReactionUpdate?.(update);
        toast.info('New reaction added', {
          description: 'Someone reacted to an activity',
          duration: 2000,
        });
        break;
        
      case 'activity_updated':
        onActivityUpdate?.(update);
        break;
        
      case 'activity_deleted':
        onActivityUpdate?.(update);
        break;
        
      case 'reaction_removed':
        onReactionUpdate?.(update);
        break;
        
      default:
        console.log('Unknown update type:', update.type);
    }
  }, [queryClient, familyId, onActivityUpdate, onCommentUpdate, onReactionUpdate]);

  // Connect on mount and when dependencies change
  useEffect(() => {
    if (enabled && familyId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, familyId, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    connect,
    disconnect,
  };
}

// Hook for activity-specific real-time updates
export function useActivityRealtimeUpdates(activityId: string, enabled = true) {
  const queryClient = useQueryClient();

  const handleActivityUpdate = useCallback((update: RealtimeUpdate) => {
    if (update.data.activity_id === activityId || update.data.id === activityId) {
      // Invalidate activity-specific queries
      queryClient.invalidateQueries({ queryKey: ['activities', activityId] });
      queryClient.invalidateQueries({ queryKey: ['activities', 'feed'] });
    }
  }, [queryClient, activityId]);

  return useRealtimeUpdates({
    familyId: 'family-123', // This would come from context in a real app
    enabled,
    onActivityUpdate: handleActivityUpdate,
  });
}

// Hook for family-wide real-time updates
export function useFamilyRealtimeUpdates(familyId: string, enabled = true) {
  const queryClient = useQueryClient();

  const handleFamilyUpdate = useCallback((_update: RealtimeUpdate) => {
    // Invalidate all family-related queries
    queryClient.invalidateQueries({ queryKey: ['activities', 'feed'] });
    queryClient.invalidateQueries({ queryKey: ['activities', familyId] });
    queryClient.invalidateQueries({ queryKey: ['goals', familyId] });
    queryClient.invalidateQueries({ queryKey: ['families', familyId] });
  }, [queryClient, familyId]);

  return useRealtimeUpdates({
    familyId,
    enabled,
    onActivityUpdate: handleFamilyUpdate,
  });
}