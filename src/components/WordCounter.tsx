'use client';

import { cn } from '@/lib/utils';

interface WordCounterProps {
  wordCount: number;
  className?: string;
}

export function WordCounter({ wordCount, className }: WordCounterProps) {
  return (
    <div className={cn("text-2xl font-bold text-gray-700", className)}>
      <span className="text-sm text-gray-500 mr-2">Words:</span>
      {wordCount.toLocaleString()}
    </div>
  );
}