"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { VocabularyAddWordFormProps } from "@/types/vocabulary-addword"
import { VocabularyAddWordField } from "./VocabularyAddWordField"
import { formFieldConfig } from "@/lib/vocabulary-addword-constants"

export function VocabularyAddWordForm({
  newWord,
  partOfSpeechOptions,
  sourceOptions,
  onNewWordChange,
}: VocabularyAddWordFormProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">Add New Word</CardTitle>
          <CardDescription>Expand your vocabulary library</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VocabularyAddWordField label="Word" required>
              <Input
                value={newWord.word}
                onChange={(e) => onNewWordChange("word", e.target.value)}
                placeholder={formFieldConfig.word.placeholder}
                className="glass-card border-0"
              />
            </VocabularyAddWordField>
            <VocabularyAddWordField label="Part of Speech" required>
              <Select
                value={newWord.partOfSpeech}
                onValueChange={(value) => onNewWordChange("partOfSpeech", value)}
              >
                <SelectTrigger className="glass-card border-0">
                  <SelectValue placeholder={formFieldConfig.partOfSpeech.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {partOfSpeechOptions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </VocabularyAddWordField>
          </div>

          <VocabularyAddWordField label="Definition" required>
            <Textarea
              value={newWord.definition}
              onChange={(e) => onNewWordChange("definition", e.target.value)}
              placeholder={formFieldConfig.definition.placeholder}
              className="glass-card border-0"
            />
          </VocabularyAddWordField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VocabularyAddWordField label="Etymology">
              <Input
                value={newWord.etymology}
                onChange={(e) => onNewWordChange("etymology", e.target.value)}
                placeholder={formFieldConfig.etymology.placeholder}
                className="glass-card border-0"
              />
            </VocabularyAddWordField>
            <VocabularyAddWordField label="Pronunciation">
              <Input
                value={newWord.pronunciation}
                onChange={(e) => onNewWordChange("pronunciation", e.target.value)}
                placeholder={formFieldConfig.pronunciation.placeholder}
                className="glass-card border-0"
              />
            </VocabularyAddWordField>
          </div>

          <VocabularyAddWordField label="Example Sentence">
            <Textarea
              value={newWord.exampleSentences[0] || ""}
              onChange={(e) => onNewWordChange("exampleSentences", [e.target.value])}
              placeholder={formFieldConfig.exampleSentence.placeholder}
              className="glass-card border-0"
            />
          </VocabularyAddWordField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VocabularyAddWordField label="Source">
              <Select
                value={newWord.source}
                onValueChange={(value: any) => onNewWordChange("source", value)}
              >
                <SelectTrigger className="glass-card border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.icon} {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </VocabularyAddWordField>
            <VocabularyAddWordField label="Book Reference">
              <Input
                value={newWord.bookReference}
                onChange={(e) => onNewWordChange("bookReference", e.target.value)}
                placeholder={formFieldConfig.bookReference.placeholder}
                className="glass-card border-0"
              />
            </VocabularyAddWordField>
          </div>

          <VocabularyAddWordField label="Personal Notes">
            <Textarea
              value={newWord.personalNotes}
              onChange={(e) => onNewWordChange("personalNotes", e.target.value)}
              placeholder={formFieldConfig.personalNotes.placeholder}
              className="glass-card border-0"
            />
          </VocabularyAddWordField>
        </CardContent>
      </Card>
    </div>
  )
} 