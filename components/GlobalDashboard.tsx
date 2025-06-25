"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  PenTool, 
  Brain, 
  Target, 
  TrendingUp, 
  Calendar,
  Flame,
  Trophy,
  BarChart3
} from "lucide-react"
import { aggregateProgress } from "@/lib/progress-aggregator"
import { getAchievements } from "@/lib/achievement-system"
import { useState, useEffect } from "react"
import type { JourneyProgress, Achievement } from "@/types/progress"

interface GlobalDashboardProps {
  onNavigateToModule: (module: string) => void
}

export function GlobalDashboard({ onNavigateToModule }: GlobalDashboardProps) {
  const [progress, setProgress] = useState<JourneyProgress | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const journeyProgress = aggregateProgress()
      const userAchievements = getAchievements(journeyProgress)
      setProgress(journeyProgress)
      setAchievements(userAchievements)
    } catch (error) {
      console.error("Error loading global progress:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600">Loading your progress...</div>
        </div>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to SAL OS</h2>
          <p className="text-slate-600 mb-6">Start your journey by exploring the modules below</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button onClick={() => onNavigateToModule("journal")} className="h-24 flex-col">
              <PenTool className="h-8 w-8 mb-2" />
              <span>Journal</span>
            </Button>
            <Button onClick={() => onNavigateToModule("modules")} className="h-24 flex-col">
              <BookOpen className="h-8 w-8 mb-2" />
              <span>Reading</span>
            </Button>
            <Button onClick={() => onNavigateToModule("tasks")} className="h-24 flex-col">
              <Target className="h-8 w-8 mb-2" />
              <span>Tasks</span>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 bg-clip-text text-transparent tracking-tight">
          SAL OS Dashboard
        </h1>
        <p className="text-slate-600 text-lg font-medium">
          Your personal development journey overview
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="border-0 shadow-2xl tornasol-gradient glow-effect text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            Overall Progress
          </CardTitle>
          <CardDescription className="text-white/80 font-medium">
            Your complete SAL journey progress
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{progress.overallCompletion}%</div>
              <div className="text-white/80 font-medium">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold flex items-center justify-center gap-2">
                <Flame className="h-8 w-8 text-orange-300" />
                {progress.currentStreak}
              </div>
              <div className="text-white/80 font-medium">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{progress.daysActive}</div>
              <div className="text-white/80 font-medium">Days Active</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{achievements.length}</div>
              <div className="text-white/80 font-medium">Achievements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Module Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Reading Progress */}
          <Card className="border-0 shadow-xl glass-card hover:glow-effect transition-all duration-300 cursor-pointer" 
                onClick={() => onNavigateToModule("modules")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-blue-500" />
                Reading Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Books Completed</span>
                  <Badge className="glass-card font-semibold">
                    {progress.booksProgress.completedBooks}/{progress.booksProgress.totalBooks}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Chapters Read</span>
                  <span className="font-semibold text-slate-800">
                    {progress.booksProgress.chaptersCompleted}/{progress.booksProgress.totalChapters}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${(progress.booksProgress.chaptersCompleted / progress.booksProgress.totalChapters) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Journal Progress */}
          <Card className="border-0 shadow-xl glass-card hover:glow-effect transition-all duration-300 cursor-pointer"
                onClick={() => onNavigateToModule("journal")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <PenTool className="h-6 w-6 text-green-500" />
                Journal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Pages Written</span>
                  <Badge className="glass-card font-semibold">
                    {progress.journalProgress.pagesWritten}/{progress.journalProgress.targetPages}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Total Entries</span>
                  <span className="font-semibold text-slate-800">{progress.journalProgress.entriesCount}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(progress.journalProgress.pagesWritten / progress.journalProgress.targetPages) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tasks Progress */}
          <Card className="border-0 shadow-xl glass-card hover:glow-effect transition-all duration-300 cursor-pointer"
                onClick={() => onNavigateToModule("tasks")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="h-6 w-6 text-purple-500" />
                Tasks Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Tasks Completed</span>
                  <Badge className="glass-card font-semibold">
                    {progress.tasksProgress.completedTasks}/{progress.tasksProgress.totalTasks}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Time Spent</span>
                  <span className="font-semibold text-slate-800">{progress.tasksProgress.totalTimeSpent}h</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${(progress.tasksProgress.completedTasks / progress.tasksProgress.totalTasks) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vocabulary Progress */}
          <Card className="border-0 shadow-xl glass-card hover:glow-effect transition-all duration-300 cursor-pointer"
                onClick={() => onNavigateToModule("library")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-amber-500" />
                Vocabulary Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Words Learned</span>
                  <Badge className="glass-card font-semibold">
                    {progress.vocabularyProgress.totalWords}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Words Mastered</span>
                  <span className="font-semibold text-slate-800">{progress.vocabularyProgress.wordsMastered}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((progress.vocabularyProgress.totalWords / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card className="border-0 shadow-xl glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-amber-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.slice(0, 6).map((achievement) => (
                <div key={achievement.id} className="p-4 glass-card rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{achievement.title}</h4>
                      <p className="text-xs text-slate-500">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => onNavigateToModule("journal")} className="h-16 flex-col">
              <PenTool className="h-5 w-5 mb-1" />
              <span className="text-xs">Journal</span>
            </Button>
            <Button onClick={() => onNavigateToModule("modules")} className="h-16 flex-col">
              <BookOpen className="h-5 w-5 mb-1" />
              <span className="text-xs">Reading</span>
            </Button>
            <Button onClick={() => onNavigateToModule("tasks")} className="h-16 flex-col">
              <Target className="h-5 w-5 mb-1" />
              <span className="text-xs">Tasks</span>
            </Button>
            <Button onClick={() => onNavigateToModule("library")} className="h-16 flex-col">
              <Brain className="h-5 w-5 mb-1" />
              <span className="text-xs">Vocabulary</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 