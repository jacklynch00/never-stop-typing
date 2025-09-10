import { useQuery } from '@tanstack/react-query';

export interface WritingPromptData {
  id: string;
  category: string;
  promptText: string;
  difficultyLevel: number;
  createdAt: string;
}

export function useWritingPrompts(category?: string, limit: number = 10) {
  return useQuery({
    queryKey: ['writing-prompts', category, limit],
    queryFn: async (): Promise<WritingPromptData[]> => {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      params.set('limit', limit.toString());
      
      const response = await fetch(`/api/prompts?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch writing prompts');
      }
      return response.json();
    },
  });
}