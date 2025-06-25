export interface StorageData {
  [key: string]: any;
}

export const safeLocalStorage = {
  getItem: (key: string, defaultValue: any = null): any => {
    try {
      if (typeof window === 'undefined') {
        return defaultValue;
      }
      
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      
      const parsed = JSON.parse(item);
      return parsed;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  setItem: (key: string, value: any): boolean => {
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error writing localStorage key "${key}":`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Utility function to get all data with error handling
  getAllData: (): StorageData => {
    try {
      if (typeof window === 'undefined') {
        return {};
      }
      
      const data: StorageData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = safeLocalStorage.getItem(key);
        }
      }
      return data;
    } catch (error) {
      console.error('Error getting all localStorage data:', error);
      return {};
    }
  },

  // Utility function to check if localStorage is available
  isAvailable: (): boolean => {
    try {
      if (typeof window === 'undefined') {
        return false;
      }
      
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
};

// Storage keys constants
export const STORAGE_KEYS = {
  JOURNAL_ENTRIES: 'sal_journal_entries',
  VOCABULARY_WORDS: 'sal_vocabulary_words',
  TASKS: 'sal_tasks',
  MODULES_PROGRESS: 'sal_modules_progress',
  LIFE_ARENAS: 'sal_life_arenas',
  GROWTH_ENGINE: 'sal_growth_engine',
  REFLECTIONS: 'sal_reflections',
  SETTINGS: 'sal_settings',
  JOURNEY_MAP: 'sal_journey_map',
  USER_PROGRESS: 'sal_user_progress'
} as const; 