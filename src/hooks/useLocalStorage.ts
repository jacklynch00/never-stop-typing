import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

export interface LocalWritingSession {
  id: string;
  title?: string;
  content: string;
  wordCount: number;
  duration: number;
  topic?: string;
  difficulty: 'easy' | 'hard';
  timestamp: number;
  completed: boolean;
}

export interface LocalStorageData {
  sessions: LocalWritingSession[];
  preferences: {
    defaultDifficulty: 'easy' | 'hard';
    defaultDuration: number;
  };
  hasSeenWelcome: boolean;
}

export const DEFAULT_LOCAL_STORAGE_DATA: LocalStorageData = {
  sessions: [],
  preferences: {
    defaultDifficulty: 'easy',
    defaultDuration: 600, // 10 minutes
  },
  hasSeenWelcome: false,
};