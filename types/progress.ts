// Data source interfaces (from other modules)
export interface JournalEntry {
  id: string
  title: string
  content: string
  type: string
  date: string
  bookReference?: string
  chapterReference?: string
  wordCount: number
  tags: string[]
}

export interface ReadingProgress {
  bookId: string
  chapterId: string
  position: number
  totalTime: number
  lastRead: string
  completed: boolean
}

export interface SALTask {
  id: number
  title: string
  description: string
  bookSection: string
  category: "foundation" | "knowledge" | "action" | "reflection" | "service" | "creation"
  status: "not-started" | "in-progress" | "completed"
  startedDate?: string
  completedDate?: string
  timeSpent: number
  notes: string
  evidenceUrl?: string
  relatedJournalIds: string[]
  relatedArenaIds: string[]
  estimatedMinutes: number
  isMultiPart: boolean
  subTasks?: string[]
  completedSubTasks?: number
}

export interface VocabularyWord {
  id: string
  word: string
  partOfSpeech: string
  definition: string
  etymology: string
  pronunciation?: string
  exampleSentences: string[]
  synonyms: string[]
  antonyms: string[]
  source: "reading" | "tasks" | "manual" | "daily"
  bookReference?: string
  dateAdded: string
  lastReviewed: string
  reviewCount: number
  masteryLevel: "new" | "learning" | "familiar" | "mastered"
  tags: string[]
  personalNotes?: string
  nextReviewDate: string
  difficultyRating: number
}

export interface LifeArena {
  id: string
  name: string
  description: string
  currentScore: number
  targetScore: number
  gradient: string
  visionStatement: string
  currentActions: string[]
  milestones: Milestone[]
  lastUpdated: string
  salPrinciple: string
  icon: string
}

export interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  completed: boolean
  completedDate?: string
}

export interface TasksVocabularyWord {
  id: string
  word: string
  partOfSpeech: string
  definition: string
  etymology: string
  practiceSentence: string
  dateAdded: string
}

// Progress calculation result interfaces
export interface JournalProgress {
  pagesWritten: number
  targetPages: number
  entriesCount: number
  totalWords: number
  averageWordsPerEntry: number
  lastEntryDate: string | null
  entriesByType: Record<string, number>
}

export interface ReadingProgressData {
  totalBooks: number
  completedBooks: number
  currentBookId: string | null
  chaptersCompleted: number
  totalChapters: number
  totalReadingTime: number
  averageReadingTime: number
  lastReadDate: string | null
  booksInProgress: number
}

export interface TasksProgress {
  completedTasks: number
  totalTasks: number
  inProgressTasks: number
  totalTimeSpent: number
  tasksByCategory: Record<string, number>
  tasksByStatus: Record<string, number>
  averageTimePerTask: number
  lastTaskUpdate: string | null
}

export interface VocabularyProgress {
  tasksVocabulary: number
  libraryVocabulary: number
  totalWords: number
  wordsMastered: number
  wordsLearning: number
  wordsFamiliar: number
  wordsNew: number
  averageReviewCount: number
  lastWordAdded: string | null
}

export interface LifeArenasProgress {
  overallScore: number
  highestArena: string
  lowestArena: string
  totalMilestones: number
  completedMilestones: number
  arenaScores: Record<string, number>
  lastArenaUpdate: string | null
  averageArenaScore: number
}

export interface JourneyProgress {
  overallCompletion: number
  startDate: string
  daysActive: number
  currentStreak: number
  lastActivityDate: string
  booksProgress: ReadingProgressData
  journalProgress: JournalProgress
  tasksProgress: TasksProgress
  vocabularyProgress: VocabularyProgress
  lifeArenasProgress: LifeArenasProgress
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  dateEarned?: string | null
  category: string
} 