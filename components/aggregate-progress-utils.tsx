"use client"

// Re-export types for backward compatibility
export type {
  JournalEntry,
  ReadingProgress,
  SALTask,
  VocabularyWord,
  LifeArena,
  Milestone,
  TasksVocabularyWord,
  JournalProgress,
  ReadingProgressData,
  TasksProgress,
  VocabularyProgress,
  LifeArenasProgress,
  JourneyProgress,
  Achievement,
} from "@/types/progress"

// Re-export main functions
export { aggregateProgress } from "@/lib/progress-aggregator"
export { getAchievements } from "@/lib/achievement-system"

// Re-export constants for backward compatibility
export { salBooks, defaultTasks, localStorageKeys } from "@/lib/progress-constants" 