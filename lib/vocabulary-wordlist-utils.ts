import type { VocabularyWord, MasteryLevel } from "@/types/vocabulary"

export function sortVocabularyWords(words: VocabularyWord[], sortBy: string, masteryLevels: MasteryLevel[]): VocabularyWord[] {
  return [...words].sort((a, b) => {
    switch (sortBy) {
      case "word":
        return a.word.localeCompare(b.word)
      case "masteryLevel":
        return (
          masteryLevels.findIndex((m) => m.value === a.masteryLevel) -
          masteryLevels.findIndex((m) => m.value === b.masteryLevel)
        )
      case "dateAdded":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      default:
        return 0
    }
  })
} 