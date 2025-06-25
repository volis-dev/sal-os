import { useState, useEffect, useCallback } from 'react';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import type { UseLocalStorageReturn } from '@/types/sal-os';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial value
  useEffect(() => {
    try {
      const storedValue = safeLocalStorage.getItem(key, defaultValue);
      setValue(storedValue);
      setError(null);
    } catch (err) {
      setError(`Failed to load data for key "${key}": ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('useLocalStorage load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  // Update localStorage when value changes
  const updateValue = useCallback((newValue: T) => {
    try {
      setValue(newValue);
      const success = safeLocalStorage.setItem(key, newValue);
      if (!success) {
        setError(`Failed to save data for key "${key}"`);
      } else {
        setError(null);
      }
    } catch (err) {
      setError(`Failed to save data for key "${key}": ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('useLocalStorage save error:', err);
    }
  }, [key]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setValue(defaultValue);
      const success = safeLocalStorage.removeItem(key);
      if (!success) {
        setError(`Failed to remove data for key "${key}"`);
      } else {
        setError(null);
      }
    } catch (err) {
      setError(`Failed to remove data for key "${key}": ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('useLocalStorage remove error:', err);
    }
  }, [key, defaultValue]);

  return {
    value,
    setValue: updateValue,
    removeValue,
    isLoading,
    error
  };
}

// Specialized hooks for common data types
export function useJournalEntries() {
  return useLocalStorage('sal_journal_entries', []);
}

export function useVocabularyWords() {
  return useLocalStorage('sal_vocabulary_words', []);
}

export function useTasks() {
  return useLocalStorage('sal_tasks', []);
}

export function useModulesProgress() {
  return useLocalStorage('sal_modules_progress', []);
}

export function useLifeArenas() {
  return useLocalStorage('sal_life_arenas', []);
}

export function useUserProgress() {
  return useLocalStorage('sal_user_progress', {
    totalTasksCompleted: 0,
    totalVocabularyMastered: 0,
    totalModulesCompleted: 0,
    totalJournalEntries: 0,
    currentLevel: 1,
    totalTimeSpent: 0,
    streakDays: 0,
    lastActive: new Date().toISOString()
  });
} 