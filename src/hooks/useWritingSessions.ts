import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface WritingSessionData {
  id: string;
  userId: string;
  title?: string;
  content: string;
  wordCount: number;
  durationSeconds: number;
  topicCategory?: string;
  difficultyMode: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionData {
  userId: string;
  title?: string;
  content: string;
  wordCount: number;
  durationSeconds: number;
  topicCategory?: string;
  difficultyMode: string;
}

export function useWritingSessions(userId: string | undefined) {
  return useQuery({
    queryKey: ['writing-sessions', userId],
    queryFn: async (): Promise<WritingSessionData[]> => {
      if (!userId) throw new Error('User ID is required');
      
      const response = await fetch(`/api/sessions?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch writing sessions');
      }
      return response.json();
    },
    enabled: !!userId,
  });
}

export function useSaveSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (sessionData: CreateSessionData): Promise<WritingSessionData> => {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save writing session');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['writing-sessions', data.userId] });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WritingSessionData> & { id: string }) => {
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update writing session');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['writing-sessions', data.userId] });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete writing session');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['writing-sessions'] });
    },
  });
}