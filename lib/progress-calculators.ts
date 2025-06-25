import type {
  JournalEntry,
  ReadingProgress,
  SALTask,
  TasksVocabularyWord,
  VocabularyWord,
  LifeArena,
  JournalProgress,
  ReadingProgressData,
  TasksProgress,
  VocabularyProgress,
  LifeArenasProgress,
} from "@/types/progress"
import { salBooks, defaultTasks, localStorageKeys } from "./progress-constants"

export function calculateJournalProgress(journalEntries: JournalEntry[]): JournalProgress {
  const totalWords = journalEntries.reduce((sum, entry) => sum + entry.wordCount, 0)
  const journalPages = Math.ceil(totalWords / 250)
  const entriesByType = journalEntries.reduce(
    (acc, entry) => {
      acc[entry.type] = (acc[entry.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    pagesWritten: journalPages,
    targetPages: 200,
    entriesCount: journalEntries.length,
    totalWords,
    averageWordsPerEntry: journalEntries.length > 0 ? Math.round(totalWords / journalEntries.length) : 0,
    lastEntryDate:
      journalEntries.length > 0
        ? journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
        : null,
    entriesByType,
  }
}

export function calculateReadingProgress(readingProgress: Record<string, ReadingProgress>): ReadingProgressData {
  const progressEntries = Object.values(readingProgress)
  const completedChapters = progressEntries.filter((p) => p.completed).length
  const totalReadingTime = progressEntries.reduce((sum, p) => sum + p.totalTime, 0)
  const totalChapters = salBooks.reduce((sum, book) => sum + book.totalChapters, 0)

  // Find current book (most recently read)
  const lastRead = progressEntries
    .filter((p) => p.lastRead)
    .sort((a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime())[0]

  const booksInProgress = new Set(progressEntries.filter((p) => !p.completed && p.totalTime > 0).map((p) => p.bookId))
    .size
  const completedBooks = salBooks.filter((book) => {
    const bookProgress = progressEntries.filter((p) => p.bookId === book.id && p.completed)
    return bookProgress.length === book.totalChapters
  }).length

  return {
    totalBooks: salBooks.length,
    completedBooks,
    currentBookId: lastRead?.bookId || null,
    chaptersCompleted: completedChapters,
    totalChapters,
    totalReadingTime,
    averageReadingTime: progressEntries.length > 0 ? Math.round(totalReadingTime / progressEntries.length) : 0,
    lastReadDate: lastRead?.lastRead || null,
    booksInProgress,
  }
}

export function calculateTasksProgress(tasks: SALTask[]): TasksProgress {
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length
  const taskTime = tasks.reduce((sum, t) => sum + t.timeSpent, 0)

  const tasksByCategory = tasks.reduce(
    (acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const lastTaskUpdate = tasks
    .filter((t) => t.completedDate || t.startedDate)
    .sort((a, b) => {
      const dateA = new Date(a.completedDate || a.startedDate || 0).getTime()
      const dateB = new Date(b.completedDate || b.startedDate || 0).getTime()
      return dateB - dateA
    })[0]

  return {
    completedTasks,
    totalTasks: defaultTasks,
    inProgressTasks,
    totalTimeSpent: taskTime,
    tasksByCategory,
    tasksByStatus,
    averageTimePerTask: tasks.length > 0 ? Math.round(taskTime / tasks.length) : 0,
    lastTaskUpdate: lastTaskUpdate ? lastTaskUpdate.completedDate || lastTaskUpdate.startedDate || null : null,
  }
}

export function calculateVocabularyProgress(
  tasksVocabulary: TasksVocabularyWord[],
  libraryVocabulary: VocabularyWord[],
): VocabularyProgress {
  const libraryMastered = libraryVocabulary.filter((w) => w.masteryLevel === "mastered").length
  const libraryLearning = libraryVocabulary.filter((w) => w.masteryLevel === "learning").length
  const libraryFamiliar = libraryVocabulary.filter((w) => w.masteryLevel === "familiar").length
  const libraryNew = libraryVocabulary.filter((w) => w.masteryLevel === "new").length

  const totalVocabWords = tasksVocabulary.length + libraryVocabulary.length
  const averageReviewCount =
    libraryVocabulary.length > 0
      ? Math.round(libraryVocabulary.reduce((sum, w) => sum + w.reviewCount, 0) / libraryVocabulary.length)
      : 0

  const lastWordAdded =
    [...tasksVocabulary, ...libraryVocabulary].sort(
      (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
    )[0]?.dateAdded || null

  return {
    tasksVocabulary: tasksVocabulary.length,
    libraryVocabulary: libraryVocabulary.length,
    totalWords: totalVocabWords,
    wordsMastered: libraryMastered,
    wordsLearning: libraryLearning,
    wordsFamiliar: libraryFamiliar,
    wordsNew: libraryNew,
    averageReviewCount,
    lastWordAdded,
  }
}

export function calculateLifeArenasProgress(lifeArenas: LifeArena[]): LifeArenasProgress {
  const arenaScores = lifeArenas.reduce(
    (acc, arena) => {
      acc[arena.name] = arena.currentScore
      return acc
    },
    {} as Record<string, number>,
  )

  const overallArenaScore =
    lifeArenas.length > 0
      ? Math.round((lifeArenas.reduce((sum, arena) => sum + arena.currentScore, 0) / lifeArenas.length) * 10) / 10
      : 0

  const sortedArenas = lifeArenas.sort((a, b) => b.currentScore - a.currentScore)
  const highestArena = sortedArenas[0]?.name || "None"
  const lowestArena = sortedArenas[sortedArenas.length - 1]?.name || "None"

  const totalMilestones = lifeArenas.reduce((sum, arena) => sum + arena.milestones.length, 0)
  const completedMilestones = lifeArenas.reduce(
    (sum, arena) => sum + arena.milestones.filter((m) => m.completed).length,
    0,
  )

  const lastArenaUpdate =
    lifeArenas.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())[0]?.lastUpdated ||
    null

  return {
    overallScore: overallArenaScore,
    highestArena,
    lowestArena,
    totalMilestones,
    completedMilestones,
    arenaScores,
    lastArenaUpdate,
    averageArenaScore: overallArenaScore,
  }
}

export function calculateStreakAndActivity(
  journalEntries: JournalEntry[],
  readingProgress: Record<string, ReadingProgress>,
  tasks: SALTask[],
  tasksVocabulary: TasksVocabularyWord[],
  libraryVocabulary: VocabularyWord[],
  lifeArenas: LifeArena[],
): { startDate: string; lastActivityDate: string; daysActive: number; currentStreak: number } {
  // Find all dates for streak calculation
  const allDates = [
    ...journalEntries.map((e) => e.date),
    ...Object.values(readingProgress).filter((p) => p.lastRead).map((p) => p.lastRead),
    ...tasks.filter((t) => t.startedDate).map((t) => t.startedDate!),
    ...tasksVocabulary.map((w) => w.dateAdded),
    ...libraryVocabulary.map((w) => w.dateAdded),
    ...lifeArenas.map((a) => a.lastUpdated),
  ]
    .filter(Boolean)
    .map((date) => new Date(date).toDateString())

  const uniqueDates = [...new Set(allDates)].sort()
  const startDate = uniqueDates[0] || new Date().toISOString()
  const lastActivityDate = uniqueDates[uniqueDates.length - 1] || new Date().toISOString()

  // Calculate current streak (consecutive days with activity)
  let currentStreak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

  if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
    const sortedDates = uniqueDates.reverse()
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i])
      const expectedDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toDateString()
      if (date.toDateString() === expectedDate) {
        currentStreak++
      } else {
        break
      }
    }
  }

  return {
    startDate,
    lastActivityDate,
    daysActive: uniqueDates.length,
    currentStreak,
  }
}

export function calculateOverallCompletion(
  journalProgress: JournalProgress,
  readingProgress: ReadingProgressData,
  tasksProgress: TasksProgress,
  vocabularyProgress: VocabularyProgress,
  lifeArenasProgress: LifeArenasProgress,
): number {
  const journalPercent = Math.min((journalProgress.pagesWritten / 200) * 100, 100)
  const booksPercent = (readingProgress.chaptersCompleted / readingProgress.totalChapters) * 100
  const tasksPercent = (tasksProgress.completedTasks / defaultTasks) * 100
  const vocabPercent = Math.min((vocabularyProgress.totalWords / 100) * 100, 100)
  const arenasPercent = (lifeArenasProgress.overallScore / 10) * 100

  return Math.round((journalPercent + booksPercent + tasksPercent + vocabPercent + arenasPercent) / 5)
} 