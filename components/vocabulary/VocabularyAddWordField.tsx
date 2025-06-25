"use client"

import type { VocabularyAddWordFieldProps } from "@/types/vocabulary-addword"

export function VocabularyAddWordField({ label, required = false, children }: VocabularyAddWordFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-2 block">
        {label} {required && "*"}
      </label>
      {children}
    </div>
  )
} 