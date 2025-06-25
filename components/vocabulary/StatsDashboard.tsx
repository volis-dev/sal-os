"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Flame } from "lucide-react"
import type { StatsDashboardProps } from "@/types/vocabulary-dashboard"

export function StatsDashboard({ stats }: StatsDashboardProps) {
  return (
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
  )
} 