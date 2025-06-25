import type { NewWordForm } from "@/types/vocabulary"

export function validateNewWordForm(newWord: NewWordForm): boolean {
  return newWord.word.trim() !== "" && newWord.definition.trim() !== ""
} 