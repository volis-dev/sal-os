"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, Target } from "lucide-react"

interface VocabularyTrackerProps {
  wordsLearned: number
  targetWords: number
  todaysWord: {
    word: string
    definition: string
    etymology: string
  }
  recentWords: string[]
}

export function VocabularyTracker({ wordsLearned, targetWords, todaysWord, recentWords }: VocabularyTrackerProps) {
  const progressPercentage = (wordsLearned / targetWords) * 100

  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
          <Brain className="h-6 w-6 text-purple-500" />
          Vocabulary Builder
        </CardTitle>
        <CardDescription className="font-medium">SAL Master Challenge: Learn 100 new words</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Progress</span>
            <Badge className="glass-card font-semibold px-3 py-1">
              {wordsLearned}/{targetWords} Words
            </Badge>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Today's Word */}
        <div className="space-y-3 p-4 glass-card rounded-xl">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-600">Today's Word</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-800">{todaysWord.word}</h4>
            <p className="text-sm text-slate-600 font-medium">{todaysWord.definition}</p>
            <p className="text-xs text-slate-500 italic">{todaysWord.etymology}</p>
          </div>
        </div>

        {/* Recent Words */}
        <div className="space-y-3">
          <span className="text-sm font-semibold text-slate-600">Recent Words</span>
          <div className="flex flex-wrap gap-2">
            {recentWords.map((word) => (
              <Badge key={word} variant="outline" className="font-medium">
                {word}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full text-purple-600 font-semibold hover:glass-card rounded-xl transition-all duration-300"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Study Vocabulary
        </Button>
      </CardContent>
    </Card>
  )
}
