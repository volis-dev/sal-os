"use client"

import { Button } from "@/components/ui/button"
import type { VocabularyAddWordHeaderProps } from "@/types/vocabulary-addword"

export function VocabularyAddWordHeader({ onCancel }: VocabularyAddWordHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={onCancel}
        className="hover:glass-card rounded-xl transition-all duration-300"
      >
        ← Back to Library
      </Button>
    </div>
  )
} 