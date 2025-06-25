import { useState, useEffect, useMemo, useCallback } from 'react';
import type { UseSearchReturn } from '@/types/sal-os';

export function useSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  debounceMs: number = 300
): UseSearchReturn<T> {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search term
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsLoading(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return items;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value == null) return false;
        
        const stringValue = String(value).toLowerCase();
        return stringValue.includes(searchLower);
      });
    });
  }, [items, debouncedSearchTerm, searchFields]);

  // Update search term
  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    searchTerm,
    setSearchTerm: updateSearchTerm,
    filteredItems,
    isLoading
  };
}

// Specialized search hooks for common data types
export function useJournalSearch(entries: any[]) {
  return useSearch(entries, ['content', 'tags'], 300);
}

export function useVocabularySearch(words: any[]) {
  return useSearch(words, ['word', 'definition', 'context'], 300);
}

export function useTaskSearch(tasks: any[]) {
  return useSearch(tasks, ['title', 'description'], 300);
} 