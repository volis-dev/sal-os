import type {
  JournalEntry,
  ReadingProgress,
  SALTask,
  TasksVocabularyWord,
  VocabularyWord,
  LifeArena,
  JourneyProgress,
} from "@/types/progress"
import { localStorageKeys } from "./progress-constants"
import {
  calculateJournalProgress,
  calculateReadingProgress,
  calculateTasksProgress,
  calculateVocabularyProgress,
  calculateLifeArenasProgress,
  calculateStreakAndActivity,
  calculateOverallCompletion,
} from "./progress-calculators"

export function aggregateProgress(): JourneyProgress {
  // Load all localStorage data using actual keys
  const journalEntries: JournalEntry[] = JSON.parse(localStorage.getItem(localStorageKeys.journalEntries) || "[]")
  const readingProgress: Record<string, ReadingProgress> = JSON.parse(
    localStorage.getItem(localStorageKeys.readingProgress) || "{}",
  )
  const tasks: SALTask[] = JSON.parse(localStorage.getItem(localStorageKeys.tasks) || "[]")
  const tasksVocabulary: TasksVocabularyWord[] = JSON.parse(localStorage.getItem(localStorageKeys.tasksVocabulary) || "[]")
  const libraryVocabulary: VocabularyWord[] = JSON.parse(localStorage.getItem(localStorageKeys.libraryVocabulary) || "[]")
  const lifeArenas: LifeArena[] = JSON.parse(localStorage.getItem(localStorageKeys.lifeArenas) || "[]")

  // Calculate individual progress metrics
  const journalProgress = calculateJournalProgress(journalEntries)
  const readingProgressData = calculateReadingProgress(readingProgress)
  const tasksProgress = calculateTasksProgress(tasks)
  const vocabularyProgress = calculateVocabularyProgress(tasksVocabulary, libraryVocabulary)
  const lifeArenasProgress = calculateLifeArenasProgress(lifeArenas)

  // Calculate streak and activity data
  const { startDate, lastActivityDate, daysActive, currentStreak } = calculateStreakAndActivity(
    journalEntries,
    readingProgress,
    tasks,
    tasksVocabulary,
    libraryVocabulary,
    lifeArenas,
  )

  // Calculate overall completion
  const overallCompletion = calculateOverallCompletion(
    journalProgress,
    readingProgressData,
    tasksProgress,
    vocabularyProgress,
    lifeArenasProgress,
  )

  return {
    overallCompletion,
    startDate,
    daysActive,
    currentStreak,
    lastActivityDate,
    booksProgress: readingProgressData,
    journalProgress,
    tasksProgress,
    vocabularyProgress,
    lifeArenasProgress,
  }
} 