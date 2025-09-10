'use client';

import { formatDuration } from '@/utils/wordCount';
import { cn } from '@/lib/utils';

interface TimerProps {
  duration: number;
  sessionDuration: number;
  isActive: boolean;
  className?: string;
}

export function Timer({ duration, sessionDuration, isActive, className }: TimerProps) {
  const remainingTime = Math.max(0, sessionDuration - duration);
  const isNearEnd = remainingTime <= 60; // Last minute
  
  return (
    <div className={cn(
      "text-2xl font-bold transition-colors",
      isActive ? "text-green-600" : "text-gray-500",
      isNearEnd && isActive && "text-red-500 animate-pulse",
      className
    )}>
      <div className="text-sm text-gray-500 mb-1">
        {isActive ? "Time Remaining" : "Duration"}
      </div>
      <div className="font-mono">
        {isActive ? formatDuration(remainingTime) : formatDuration(duration)}
      </div>
    </div>
  );
}