"use client"

import type { VocabularyAddWordProps } from "@/types/vocabulary-addword"
import { VocabularyAddWordHeader } from "./VocabularyAddWordHeader"
import { VocabularyAddWordForm } from "./VocabularyAddWordForm"
import { VocabularyAddWordActions } from "./VocabularyAddWordActions"
import { validateNewWordForm } from "@/lib/vocabulary-addword-utils"

export function VocabularyAddWord({
  newWord,
  partOfSpeechOptions,
  sourceOptions,
  onNewWordChange,
  onAddWord,
  onCancel,
}: VocabularyAddWordProps) {
  const isValid = validateNewWordForm(newWord)

  return (
    <>
      <VocabularyAddWordHeader onCancel={onCancel} />
      <VocabularyAddWordForm
        newWord={newWord}
        partOfSpeechOptions={partOfSpeechOptions}
        sourceOptions={sourceOptions}
        onNewWordChange={onNewWordChange}
      />
      <div className="max-w-2xl mx-auto mt-6">
        <VocabularyAddWordActions isValid={isValid} onAddWord={onAddWord} onCancel={onCancel} />
      </div>
    </>
  )
} 