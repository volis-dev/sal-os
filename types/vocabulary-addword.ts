import type { NewWordForm, SourceOption } from "@/types/vocabulary"

export interface VocabularyAddWordProps {
  newWord: NewWordForm
  partOfSpeechOptions: string[]
  sourceOptions: SourceOption[]
  onNewWordChange: (field: keyof NewWordForm, value: any) => void
  onAddWord: () => void
  onCancel: () => void
}

export interface VocabularyAddWordHeaderProps {
  onCancel: () => void
}

export interface VocabularyAddWordFormProps {
  newWord: NewWordForm
  partOfSpeechOptions: string[]
  sourceOptions: SourceOption[]
  onNewWordChange: (field: keyof NewWordForm, value: any) => void
}

export interface VocabularyAddWordActionsProps {
  isValid: boolean
  onAddWord: () => void
  onCancel: () => void
}

export interface VocabularyAddWordFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
} 