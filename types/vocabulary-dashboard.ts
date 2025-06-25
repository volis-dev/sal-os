import type { VocabularyStats, MasteryStats, VocabularyWord, StudySession } from "@/types/vocabulary"

export interface VocabularyDashboardProps {
  stats: VocabularyStats
  masteryStats: MasteryStats[]
  todaysWord: VocabularyWord | null
  recentWords: VocabularyWord[]
  studySessions: StudySession[]
  onStartStudy: (mode: "flashcards" | "quiz" | "review") => void
  onNavigateToAdd: () => void
  onNavigateToWordList: () => void
}

export interface StatsDashboardProps {
  stats: VocabularyStats
}

export interface MasteryBreakdownProps {
  masteryStats: MasteryStats[]
  totalWords: number
}

export interface StudyModesProps {
  onStartStudy: (mode: "flashcards" | "quiz" | "review") => void
}

export interface QuickActionsProps {
  onNavigateToAdd: () => void
  onNavigateToWordList: () => void
}

export interface WordOfTheDayProps {
  todaysWord: VocabularyWord
}

export interface RecentActivityProps {
  recentWords: VocabularyWord[]
  masteryStats: MasteryStats[]
}

export interface StudyStatsProps {
  studySessions: StudySession[]
} 