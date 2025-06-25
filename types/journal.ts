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

export interface EntryType {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export interface JournalStats {
  totalPages: number
  totalWords: number
  totalEntries: number
  progressPercentage: number
}

export type AutoSaveStatus = "saved" | "saving" | "unsaved" 