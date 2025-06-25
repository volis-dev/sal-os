"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import type { WordOfTheDayProps } from "@/types/vocabulary-dashboard"

export function WordOfTheDay({ todaysWord }: WordOfTheDayProps) {
  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-amber-500" />
          Word of the Day
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 glass-card rounded-xl">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{todaysWord.word}</h3>
          <Badge variant="outline" className="mb-3">
            {todaysWord.partOfSpeech}
          </Badge>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{todaysWord.definition}</p>
          <p className="text-xs text-slate-500 italic">{todaysWord.etymology}</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-800 text-sm">Example:</h4>
          <p className="text-sm text-slate-600 italic">"{todaysWord.exampleSentences[0]}"</p>
        </div>
      </CardContent>
    </Card>
  )
} 