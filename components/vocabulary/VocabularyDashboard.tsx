"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Flame,
  Trophy,
  Play,
  RotateCcw,
  Target,
  Clock,
  Plus,
  BookOpen,
  Download,
  Upload,
  Sparkles,
  TrendingUp,
  Calendar,
} from "lucide-react"
import type { VocabularyStats, MasteryStats, VocabularyWord, StudySession } from "@/types/vocabulary"

interface VocabularyDashboardProps {
  stats: VocabularyStats
  masteryStats: MasteryStats[]
  todaysWord: VocabularyWord | null
  recentWords: VocabularyWord[]
  studySessions: StudySession[]
  onStartStudy: (mode: "flashcards" | "quiz" | "review") => void
  onNavigateToAdd: () => void
  onNavigateToWordList: () => void
}

export function VocabularyDashboard({
  stats,
  masteryStats,
  todaysWord,
  recentWords,
  studySessions,
  onStartStudy,
  onNavigateToAdd,
  onNavigateToWordList,
}: VocabularyDashboardProps) {
  return (
    <>
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 bg-clip-text text-transparent tracking-tight">
          Vocabulary Library
        </h1>
        <p className="text-slate-600 text-lg font-medium">
          Master cultural literacy through systematic vocabulary development
        </p>
      </div>

      {/* Stats Dashboard */}
      <Card className="border-0 shadow-2xl tornasol-gradient glow-effect text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="h-8 w-8" />
            Vocabulary Mastery Progress
          </CardTitle>
          <CardDescription className="text-white/80 font-medium">
            Building cultural literacy through systematic word study
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{stats.totalWords}</div>
              <div className="text-white/80 font-medium">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold flex items-center justify-center gap-2">
                <Flame className="h-8 w-8 text-orange-300" />
                {stats.studyStreak}
              </div>
              <div className="text-white/80 font-medium">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{stats.wordsThisWeek}</div>
              <div className="text-white/80 font-medium">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{stats.wordsToReview}</div>
              <div className="text-white/80 font-medium">Due Review</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mastery Breakdown */}
          <Card className="border-0 shadow-xl glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-amber-500" />
                Mastery Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {masteryStats.map((level) => (
                  <div key={level.value} className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center text-white font-bold text-xl`}
                    >
                      {level.count}
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">{level.label}</h3>
                    <p className="text-xs text-slate-500">
                      {stats.totalWords > 0 ? Math.round((level.count / stats.totalWords) * 100) : 0}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Modes */}
          <Card className="border-0 shadow-xl glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Play className="h-6 w-6 text-green-500" />
                Study Modes
              </CardTitle>
              <CardDescription>Choose your learning approach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => onStartStudy("flashcards")}
                  className="h-24 flex-col bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:shadow-xl transition-all duration-300"
                >
                  <RotateCcw className="h-8 w-8 mb-2" />
                  <span className="font-semibold">Flashcards</span>
                  <span className="text-xs opacity-80">Interactive review</span>
                </Button>
                <Button
                  onClick={() => onStartStudy("quiz")}
                  className="h-24 flex-col bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-xl transition-all duration-300"
                >
                  <Target className="h-8 w-8 mb-2" />
                  <span className="font-semibold">Quiz Mode</span>
                  <span className="text-xs opacity-80">Test knowledge</span>
                </Button>
                <Button
                  onClick={() => onStartStudy("review")}
                  className="h-24 flex-col bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-xl transition-all duration-300"
                >
                  <Clock className="h-8 w-8 mb-2" />
                  <span className="font-semibold">Spaced Review</span>
                  <span className="text-xs opacity-80">Due words only</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-xl glass-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={onNavigateToAdd}
                  className="bg-gradient-to-r from-purple-400 to-blue-500 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Word
                </Button>
                <Button
                  onClick={onNavigateToWordList}
                  variant="outline"
                  className="glass-card border-0"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Library
                </Button>
                <Button variant="outline" className="glass-card border-0">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" className="glass-card border-0">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Word of the Day */}
          {todaysWord && (
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
          )}

          {/* Recent Activity */}
          <Card className="border-0 shadow-xl glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentWords.map((word) => {
                  const masteryConfig = masteryStats.find((m) => m.value === word.masteryLevel)
                  return (
                    <div key={word.id} className="flex items-center justify-between p-3 glass-card rounded-xl">
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{word.word}</h4>
                        <p className="text-xs text-slate-500">
                          {new Date(word.lastReviewed).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`bg-gradient-to-r ${masteryConfig?.color} text-white border-0`}>
                        {masteryConfig?.label}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Study Stats */}
          <Card className="border-0 shadow-xl glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-purple-500" />
                Study Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Sessions This Week</span>
                <span className="font-bold text-slate-800">{studySessions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Average Accuracy</span>
                <span className="font-bold text-slate-800">
                  {studySessions.length > 0
                    ? Math.round(
                        (studySessions.reduce((sum, s) => sum + s.correctAnswers / s.totalQuestions, 0) /
                          studySessions.length) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Study Time</span>
                <span className="font-bold text-slate-800">
                  {studySessions.reduce((sum, s) => sum + s.duration, 0)} min
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
} 