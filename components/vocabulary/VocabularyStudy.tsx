"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { VocabularyWord } from "@/types/vocabulary"

interface VocabularyStudyProps {
  studyWords: VocabularyWord[]
  currentWordIndex: number
  showAnswer: boolean
  studyMode: "flashcards" | "quiz" | "review"
  onShowAnswer: () => void
  onMarkDifficulty: (difficulty: number) => void
  onPreviousWord: () => void
  onNextWord: () => void
  onEndSession: () => void
}

export function VocabularyStudy({
  studyWords,
  currentWordIndex,
  showAnswer,
  studyMode,
  onShowAnswer,
  onMarkDifficulty,
  onPreviousWord,
  onNextWord,
  onEndSession,
}: VocabularyStudyProps) {
  if (studyWords.length === 0) {
    return null
  }

  const currentWord = studyWords[currentWordIndex]
  const isLastWord = currentWordIndex === studyWords.length - 1

  return (
    <>
      {/* Study Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onEndSession}
          className="hover:glass-card rounded-xl transition-all duration-300"
        >
          ← End Session
        </Button>
        <div className="flex items-center gap-4">
          <Badge className="glass-card font-semibold px-3 py-1">
            {currentWordIndex + 1} / {studyWords.length}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {studyMode}
          </Badge>
        </div>
      </div>

      {/* Flashcard */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-2xl glass-card min-h-[400px]">
          <CardContent className="p-8 flex flex-col justify-center items-center text-center space-y-6">
            {!showAnswer ? (
              <>
                <h2 className="text-4xl font-bold text-slate-800 mb-4">{currentWord.word}</h2>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {currentWord.partOfSpeech}
                </Badge>
                <Button
                  onClick={onShowAnswer}
                  className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-lg px-8 py-3"
                >
                  Show Definition
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">{currentWord.word}</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-4">{currentWord.definition}</p>
                {currentWord.etymology && (
                  <p className="text-sm text-slate-500 italic mb-6">{currentWord.etymology}</p>
                )}
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 mb-4">How difficult was this word?</p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => onMarkDifficulty(1)} className="bg-green-500 text-white px-6 py-2">
                      Easy
                    </Button>
                    <Button onClick={() => onMarkDifficulty(3)} className="bg-yellow-500 text-white px-6 py-2">
                      Medium
                    </Button>
                    <Button onClick={() => onMarkDifficulty(5)} className="bg-red-500 text-white px-6 py-2">
                      Hard
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={onPreviousWord}
            disabled={currentWordIndex === 0}
            className="glass-card border-0"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-slate-500">Press Space to flip card, Arrow keys to navigate</div>

          <Button variant="outline" onClick={onNextWord} className="glass-card border-0">
            {isLastWord ? "Finish" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
} 