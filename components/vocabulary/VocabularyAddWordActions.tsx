"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { VocabularyAddWordActionsProps } from "@/types/vocabulary-addword"

export function VocabularyAddWordActions({ isValid, onAddWord, onCancel }: VocabularyAddWordActionsProps) {
  return (
    <div className="flex gap-4">
      <Button
        onClick={onAddWord}
        className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold"
        disabled={!isValid}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Word
      </Button>
      <Button variant="outline" onClick={onCancel} className="glass-card border-0">
        Cancel
      </Button>
    </div>
  )
} 