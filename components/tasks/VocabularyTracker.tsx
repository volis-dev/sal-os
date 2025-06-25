"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Sparkles } from "lucide-react"
import type { VocabularyWord, NewWordForm } from "@/types/vocabulary"

interface VocabularyTrackerProps {
  vocabularyWords: VocabularyWord[]
  newVocabWord: NewWordForm
  onNewVocabWordChange: (field: keyof NewWordForm, value: any) => void
  onAddVocabularyWord: () => void
}

export function VocabularyTracker({
  vocabularyWords,
  newVocabWord,
  onNewVocabWordChange,
  onAddVocabularyWord,
}: VocabularyTrackerProps) {
  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Vocabulary Progress (Task #2)
        </CardTitle>
        <CardDescription>Track your progress toward 100 vocabulary words</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700">Words Learned</span>
          <Badge className="glass-card font-semibold px-3 py-1">{vocabularyWords.length}/100 Words</Badge>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((vocabularyWords.length / 100) * 100, 100)}%` }}
          />
        </div>

        {/* Add New Word Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 glass-card rounded-xl">
          <div className="space-y-3">
            <Input
              placeholder="Word"
              value={newVocabWord.word}
              onChange={(e) => onNewVocabWordChange("word", e.target.value)}
              className="glass-card border-0"
            />
            <Input
              placeholder="Part of Speech"
              value={newVocabWord.partOfSpeech}
              onChange={(e) => onNewVocabWordChange("partOfSpeech", e.target.value)}
              className="glass-card border-0"
            />
            <Input
              placeholder="Etymology"
              value={newVocabWord.etymology}
              onChange={(e) => onNewVocabWordChange("etymology", e.target.value)}
              className="glass-card border-0"
            />
          </div>
          <div className="space-y-3">
            <Textarea
              placeholder="Definition"
              value={newVocabWord.definition}
              onChange={(e) => onNewVocabWordChange("definition", e.target.value)}
              className="glass-card border-0"
            />
            <div className="space-y-2">
              <label htmlFor="exampleSentences" className="text-sm font-medium">Example Sentences</label>
              <Textarea
                id="exampleSentences"
                placeholder="Enter example sentences..."
                value={newVocabWord.exampleSentences.join('\n')}
                onChange={(e) => onNewVocabWordChange('exampleSentences', e.target.value.split('\n').filter(s => s.trim()))}
                className="min-h-[80px]"
              />
            </div>
            <Button
              onClick={onAddVocabularyWord}
              className="w-full bg-gradient-to-r from-purple-400 to-blue-500 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Word
            </Button>
          </div>
        </div>

        {/* Recent Words */}
        {vocabularyWords.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800">Recent Words</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vocabularyWords.slice(-4).map((word) => (
                <div key={word.id} className="p-3 glass-card rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-slate-800">{word.word}</h5>
                    <Badge variant="outline" className="text-xs">
                      {word.partOfSpeech}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{word.definition}</p>
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Example:</strong> {word.exampleSentences[0] || 'No example provided'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 