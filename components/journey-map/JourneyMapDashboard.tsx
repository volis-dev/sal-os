"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, Flame, Calendar, Clock, Star } from "lucide-react"
import type { JourneyProgress } from "@/types/journey-map"

interface JourneyMapDashboardProps {
  progress: JourneyProgress
  onTabChange: (tab: string) => void
  formatTime: (seconds: number) => string
}

export function JourneyMapDashboard({ progress, onTabChange, formatTime }: JourneyMapDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Overall Completion */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Overall Completion
          </CardTitle>
          <CardDescription>Total progress across all modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-slate-800">{Math.round(progress.overallCompletion * 100)}%</div>
          <div className="text-xs text-slate-500 mt-2">Since {new Date(progress.startDate).toLocaleDateString()}</div>
        </CardContent>
      </Card>

      {/* Streaks */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Flame className="h-5 w-5 text-amber-500" />
            Current Streak
          </CardTitle>
          <CardDescription>Consecutive days of activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-slate-800">{progress.currentStreak} days</div>
          <div className="text-xs text-slate-500 mt-2">Last activity: {new Date(progress.lastActivityDate).toLocaleDateString()}</div>
        </CardContent>
      </Card>

      {/* Reading Time */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-purple-500" />
            Reading Time
          </CardTitle>
          <CardDescription>Total time spent reading</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-slate-800">{formatTime(progress.booksProgress.totalReadingTime)}</div>
          <div className="text-xs text-slate-500 mt-2">Avg: {formatTime(progress.booksProgress.averageReadingTime)} / session</div>
        </CardContent>
      </Card>

      {/* Days Active */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-green-500" />
            Days Active
          </CardTitle>
          <CardDescription>Total days with activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-slate-800">{progress.daysActive}</div>
          <div className="text-xs text-slate-500 mt-2">Keep up the momentum!</div>
        </CardContent>
      </Card>
    </div>
  )
} 