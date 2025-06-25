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

export interface SalBook {
  id: string
  title: string
  subtitle: string
  totalChapters: number
  color: string
  position: { x: number; y: number }
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  achieved: boolean
  dateAchieved?: string
}

// Journey Map Core Types
export interface JourneyMap {
  id: string
  title: string
  description: string
  currentNodeId: string | null
  completedNodes: number
  totalNodes: number
  theme: string
}

export interface JourneyNode {
  id: string
  journeyMapId: string
  title: string
  description: string
  type: 'milestone' | 'challenge' | 'achievement' | 'checkpoint'
  positionX: number
  positionY: number
  completed: boolean
  completionDate: string | null
  metadata: Record<string, any>
}

export interface JourneyConnection {
  id: string
  journeyMapId: string
  sourceNodeId: string
  targetNodeId: string
  type: 'linear' | 'conditional' | 'parallel'
  label: string
  metadata: Record<string, any>
}

export interface JourneyStats {
  totalMaps: number
  totalNodes: number
  completedNodes: number
  progressPercentage: number
} 