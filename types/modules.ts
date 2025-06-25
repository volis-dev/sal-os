export interface Book {
  id: string
  title: string
  subtitle: string
  totalChapters: number
  completedChapters: number
  currentChapter: number
  lastRead: string | null
  totalPages: number
  pagesRead: number
  color: string
  description: string
  estimatedHours: number
}

export interface Chapter {
  id: string
  bookId: string
  number: number
  title: string
  content: string
  estimatedMinutes: number
  completed: boolean
}

export interface ReadingProgress {
  id: string
  bookId: string
  chapterId: string
  position: number
  totalTime: number
  lastRead: string
  completed: boolean
}

export interface ModulesStats {
  totalBooks: number
  totalPages: number
  pagesRead: number
  totalChapters: number
  completedChapters: number
  estimatedHours: number
  progressPercentage: number
} 