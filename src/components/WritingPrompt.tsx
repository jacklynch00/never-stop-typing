'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, X } from 'lucide-react';
import { WRITING_PROMPTS, WritingPrompt as PromptType, getRandomPrompt, getCategoryById } from '@/data/writingPrompts';

interface WritingPromptProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onPromptChange: (prompt: PromptType) => void;
  onHide?: () => void;
}

export function WritingPrompt({ selectedCategory, onCategoryChange, onPromptChange, onHide }: WritingPromptProps) {
  const [currentPrompt, setCurrentPrompt] = useState<PromptType | null>(null);

  // Initialize with random prompt from selected category
  useEffect(() => {
    const prompt = getRandomPrompt(selectedCategory === 'random' ? undefined : selectedCategory);
    setCurrentPrompt(prompt);
    onPromptChange(prompt);
  }, [selectedCategory, onPromptChange]);

  const handleRefreshPrompt = () => {
    const newPrompt = getRandomPrompt(selectedCategory === 'random' ? undefined : selectedCategory);
    setCurrentPrompt(newPrompt);
    onPromptChange(newPrompt);
  };

  const handleCategoryChange = (newCategory: string) => {
    onCategoryChange(newCategory);
    // Don't immediately change prompt here, let useEffect handle it
  };

  const selectedCategoryData = selectedCategory === 'random' 
    ? null 
    : getCategoryById(selectedCategory);

  return (
    <div className='w-full max-w-3xl mx-auto mb-4'>
      <div className='border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0'>
          <div className='flex-1 sm:pr-4'>
            <p className='text-sm sm:text-base text-gray-700 font-light'>
              {currentPrompt ? `"${currentPrompt.text}"` : 'Loading prompt...'}
            </p>
          </div>
          <div className='flex items-center gap-2 flex-shrink-0'>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className='w-32 sm:w-40 h-8 text-xs'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='random'>Random</SelectItem>
                {WRITING_PROMPTS.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant='ghost'
              size='sm'
              onClick={handleRefreshPrompt}
              className='h-8 px-2'
              disabled={!currentPrompt}
            >
              <RefreshCw className='w-3 h-3' />
            </Button>
            
            {onHide && (
              <Button
                variant='ghost'
                size='sm'
                onClick={onHide}
                className='h-8 px-2'
              >
                <X className='w-3 h-3' />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}