"use client"

import type { VocabularyWordGridProps } from "@/types/vocabulary-wordlist"
import { VocabularyWordCard } from "./VocabularyWordCard"

export function VocabularyWordGrid({ words, masteryLevels, sourceOptions }: VocabularyWordGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {words.map((word) => {
        const masteryConfig = masteryLevels.find((m) => m.value === word.masteryLevel)
        const sourceConfig = sourceOptions.find((s) => s.value === word.source)
        return (
          <VocabularyWordCard
            key={word.id}
            word={word}
            masteryConfig={masteryConfig}
            sourceConfig={sourceConfig}
          />
        )
      })}
    </div>
  )
} 