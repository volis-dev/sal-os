"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit3, Volume2, Star } from "lucide-react"
import type { VocabularyWordCardProps } from "@/types/vocabulary-wordlist"

export function VocabularyWordCard({ word, masteryConfig, sourceConfig }: VocabularyWordCardProps) {
  return (
    <Card className="border-0 shadow-xl glass-card hover:glow-effect transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800">{word.word}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {word.partOfSpeech}
              </Badge>
              <Badge className={`bg-gradient-to-r ${masteryConfig?.color} text-white border-0 text-xs`}>
                {masteryConfig?.label}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg">{sourceConfig?.icon}</div>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < word.difficultyRating ? "text-amber-400 fill-current" : "text-slate-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600 leading-relaxed">{word.definition}</p>
        {word.etymology && (
          <div className="p-3 glass-card rounded-xl">
            <p className="text-xs text-slate-500 italic">{word.etymology}</p>
          </div>
        )}
        {word.exampleSentences.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-600 mb-2">Example:</h4>
            <p className="text-sm text-slate-600 italic">"{word.exampleSentences[0]}"</p>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Added {new Date(word.dateAdded).toLocaleDateString()}</span>
          <span>{word.reviewCount} reviews</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 glass-card border-0">
            <Edit3 className="mr-2 h-3 w-3" />
            Edit
          </Button>
          <Button size="sm" variant="outline" className="glass-card border-0">
            <Volume2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 