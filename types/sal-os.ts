// Core interfaces for SAL OS
export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  context?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed: string;
  nextReview: string;
  reviewCount: number;
  mastered: boolean;
  source?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  timeSpent: number; // in minutes
  vocabularyWords: string[]; // IDs of vocabulary words
  createdAt: string;
  completedAt?: string;
}

export interface ModuleProgress {
  id: string;
  name: string;
  currentPage: number;
  totalPages: number;
  timeSpent: number; // in minutes
  completed: boolean;
  lastAccessed: string;
  notes?: string;
}

export interface LifeArena {
  id: string;
  name: string;
  score: number; // 0-100
  description: string;
  goals: string[];
  lastUpdated: string;
}

export interface GrowthLevel {
  level: number;
  title: string;
  description: string;
  requirements: {
    tasksCompleted: number;
    vocabularyMastered: number;
    modulesCompleted: number;
    journalEntries: number;
  };
  rewards: string[];
  unlocked: boolean;
  completed: boolean;
}

export interface Reflection {
  id: string;
  template: string;
  responses: Record<string, string>;
  date: string;
  insights: string[];
  createdAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoSave: boolean;
  language: string;
  timezone: string;
  exportFormat: 'json' | 'csv';
}

export interface JourneyMapNode {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'challenge' | 'achievement';
  date: string;
  completed: boolean;
  impact: number; // 1-10
  lessons: string[];
}

export interface UserProgress {
  totalTasksCompleted: number;
  totalVocabularyMastered: number;
  totalModulesCompleted: number;
  totalJournalEntries: number;
  currentLevel: number;
  totalTimeSpent: number; // in minutes
  streakDays: number;
  lastActive: string;
}

// Component Props
export interface ProgressCardProps {
  title: string;
  value: number;
  maxValue?: number;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface ModuleCardProps {
  module: ModuleProgress;
  onUpdate: (module: ModuleProgress) => void;
}

export interface VocabularyCardProps {
  word: VocabularyWord;
  onReview: (wordId: string, mastered: boolean) => void;
  onEdit: (word: VocabularyWord) => void;
}

export interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export interface JournalCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
}

// Hook return types
export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface UseTimerReturn {
  time: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  save: () => void;
}

export interface UseSearchReturn<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: T[];
  isLoading: boolean;
}

// Service interfaces
export interface VocabularyService {
  getWords: () => VocabularyWord[];
  addWord: (word: Omit<VocabularyWord, 'id' | 'createdAt'>) => void;
  updateWord: (word: VocabularyWord) => void;
  deleteWord: (wordId: string) => void;
  getWordsForReview: () => VocabularyWord[];
  markAsReviewed: (wordId: string, mastered: boolean) => void;
  syncWithTasks: () => void;
}

export interface ProgressService {
  calculateOverallProgress: () => number;
  getModuleProgress: (moduleId: string) => ModuleProgress | null;
  updateModuleProgress: (moduleId: string, progress: Partial<ModuleProgress>) => void;
  getLifeArenaScores: () => LifeArena[];
  updateLifeArenaScore: (arenaId: string, score: number) => void;
  getGrowthLevel: () => GrowthLevel;
  checkLevelUp: () => GrowthLevel | null;
}

// Error types
export interface AppError {
  id: string;
  message: string;
  component: string;
  timestamp: string;
  stack?: string;
  userAction?: string;
}

// Event types
export interface AppEvent {
  type: 'task_completed' | 'word_mastered' | 'module_completed' | 'level_up' | 'streak_broken';
  data: any;
  timestamp: string;
}

// Export/Import types
export interface ExportData {
  version: string;
  timestamp: string;
  data: {
    journalEntries: JournalEntry[];
    vocabularyWords: VocabularyWord[];
    tasks: Task[];
    modulesProgress: ModuleProgress[];
    lifeArenas: LifeArena[];
    growthEngine: GrowthLevel[];
    reflections: Reflection[];
    settings: UserSettings;
    journeyMap: JourneyMapNode[];
    userProgress: UserProgress;
  };
} 