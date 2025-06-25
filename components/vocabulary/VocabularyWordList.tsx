"use client"

import type { VocabularyWordListProps } from "@/types/vocabulary-wordlist"
import { VocabularyWordListHeader } from "./VocabularyWordListHeader"
import { VocabularyWordListFilters } from "./VocabularyWordListFilters"
import { VocabularyWordGrid } from "./VocabularyWordGrid"
import { sortVocabularyWords } from "@/lib/vocabulary-wordlist-utils"

export function VocabularyWordList({
  words,
  masteryLevels,
  sourceOptions,
  searchTerm,
  filterMastery,
  filterSource,
  sortBy,
  onSearchChange,
  onFilterMasteryChange,
  onFilterSourceChange,
  onSortByChange,
  onNavigateToAdd,
  onNavigateToDashboard,
}: VocabularyWordListProps) {
  const sortedWords = sortVocabularyWords(words, sortBy, masteryLevels)

  return (
    <>
      <VocabularyWordListHeader
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToAdd={onNavigateToAdd}
      />
      <VocabularyWordListFilters
        searchTerm={searchTerm}
        filterMastery={filterMastery}
        filterSource={filterSource}
        sortBy={sortBy}
        masteryLevels={masteryLevels}
        sourceOptions={sourceOptions}
        onSearchChange={onSearchChange}
        onFilterMasteryChange={onFilterMasteryChange}
        onFilterSourceChange={onFilterSourceChange}
        onSortByChange={onSortByChange}
      />
      <VocabularyWordGrid
        words={sortedWords}
        masteryLevels={masteryLevels}
        sourceOptions={sourceOptions}
      />
    </>
  )
} 