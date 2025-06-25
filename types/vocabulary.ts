export interface VocabularyWord {
  id: string
  word: string
  partOfSpeech: string
  definition: string
  etymology: string
  pronunciation?: string
  exampleSentences: string[]
  synonyms: string[]
  antonyms: string[]
  source: "reading" | "tasks" | "manual" | "daily"
  bookReference?: string
  dateAdded: string
  lastReviewed: string
  reviewCount: number
  masteryLevel: "new" | "learning" | "familiar" | "mastered"
  tags: string[]
  personalNotes?: string
  nextReviewDate: string
  difficultyRating: number // 1-5, affects spaced repetition
}

export interface StudySession {
  id: string
  date: string
  wordsStudied: string[]
  correctAnswers: number
  totalQuestions: number
  duration: number
  mode: "flashcards" | "quiz" | "review"
}

export interface MasteryLevel {
  value: "new" | "learning" | "familiar" | "mastered"
  label: string
  color: string
  days: number
}

export interface SourceOption {
  value: "reading" | "tasks" | "manual" | "daily"
  label: string
  icon: string
}

export interface NewWordForm {
  word: string
  partOfSpeech: string
  definition: string
  etymology: string
  pronunciation: string
  exampleSentences: string[]
  synonyms: string[]
  antonyms: string[]
  source: "reading" | "tasks" | "manual" | "daily"
  bookReference: string
  tags: string[]
  personalNotes: string
}

export interface VocabularyStats {
  totalWords: number
  masteredWords: number
  learningWords: number
  familiarWords: number
  newWords: number
  totalReviews: number
  masteryPercentage: number
  studyStreak: number
  wordsThisWeek: number
  wordsToReview: number
}

export interface MasteryStats extends MasteryLevel {
  count: number
} 