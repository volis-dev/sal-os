import type { VocabularyWord, MasteryLevel, SourceOption } from "@/types/vocabulary"

export interface VocabularyWordListProps {
  words: VocabularyWord[]
  masteryLevels: MasteryLevel[]
  sourceOptions: SourceOption[]
  searchTerm: string
  filterMastery: string
  filterSource: string
  sortBy: string
  onSearchChange: (term: string) => void
  onFilterMasteryChange: (value: string) => void
  onFilterSourceChange: (value: string) => void
  onSortByChange: (value: string) => void
  onNavigateToAdd: () => void
  onNavigateToDashboard: () => void
}

export interface VocabularyWordListHeaderProps {
  onNavigateToAdd: () => void
  onNavigateToDashboard: () => void
}

export interface VocabularyWordListFiltersProps {
  searchTerm: string
  filterMastery: string
  filterSource: string
  sortBy: string
  masteryLevels: MasteryLevel[]
  sourceOptions: SourceOption[]
  onSearchChange: (term: string) => void
  onFilterMasteryChange: (value: string) => void
  onFilterSourceChange: (value: string) => void
  onSortByChange: (value: string) => void
}

export interface VocabularyWordCardProps {
  word: VocabularyWord
  masteryConfig: MasteryLevel | undefined
  sourceConfig: SourceOption | undefined
}

export interface VocabularyWordGridProps {
  words: VocabularyWord[]
  masteryLevels: MasteryLevel[]
  sourceOptions: SourceOption[]
} 