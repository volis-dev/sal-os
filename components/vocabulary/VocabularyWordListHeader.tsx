"use client"

import { Button } from "@/components/ui/button"
import type { VocabularyWordListHeaderProps } from "@/types/vocabulary-wordlist"

export function VocabularyWordListHeader({ onNavigateToDashboard, onNavigateToAdd }: VocabularyWordListHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={onNavigateToDashboard}
        className="hover:glass-card rounded-xl transition-all duration-300"
      >
        ← Back to Library
      </Button>
      <Button
        onClick={onNavigateToAdd}
        className="bg-gradient-to-r from-purple-400 to-blue-500 text-white"
      >
        + Add Word
      </Button>
    </div>
  )
} 