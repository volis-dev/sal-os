"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import type { TaskStats, CategoryStats } from "@/types/tasks"

interface TaskDashboardProps {
  taskStats: TaskStats
  categoryStats: CategoryStats[]
}

export function TaskDashboard({ taskStats, categoryStats }: TaskDashboardProps) {
  const categoryConfig = {
    foundation: { color: "from-slate-500 to-gray-600", icon: "🏗️", label: "Foundation" },
    knowledge: { color: "from-blue-500 to-indigo-600", icon: "📚", label: "Knowledge" },
    action: { color: "from-green-500 to-emerald-600", icon: "⚡", label: "Action" },
    reflection: { color: "from-purple-500 to-pink-600", icon: "🤔", label: "Reflection" },
    service: { color: "from-orange-500 to-red-600", icon: "🤝", label: "Service" },
    creation: { color: "from-yellow-500 to-amber-600", icon: "✨", label: "Creation" },
  }

  return (
    <>
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 bg-clip-text text-transparent tracking-tight">
          SAL Challenge Tasks
        </h1>
        <p className="text-slate-600 text-lg font-medium">
          Complete all 25 exercises to master Self-Action Leadership principles
        </p>
      </div>

      {/* Progress Dashboard */}
      <Card className="border-0 shadow-2xl tornasol-gradient glow-effect text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Award className="h-8 w-8" />
            Challenge Progress
          </CardTitle>
          <CardDescription className="text-white/80 font-medium">
            Your journey through the 25 SAL Master Challenge exercises
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold">{taskStats.completedTasks}/25</div>
              <div className="text-white/80 font-medium">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{taskStats.inProgressTasks}</div>
              <div className="text-white/80 font-medium">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{Math.round(taskStats.totalTimeSpent / 60)}h</div>
              <div className="text-white/80 font-medium">Time Invested</div>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - taskStats.progressPercentage / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{taskStats.progressPercentage}%</span>
                </div>
              </div>
              <div className="text-white/80 font-medium mt-2">Overall</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categoryStats.map(({ category, total, completed, percentage }) => {
          const config = categoryConfig[category as keyof typeof categoryConfig]

          return (
            <Card key={category} className="border-0 shadow-xl glass-card">
              <CardContent className="p-4 text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${config.color} flex items-center justify-center text-2xl`}
                >
                  {config.icon}
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">{config.label}</h3>
                <div className="text-lg font-bold text-slate-700 mt-1">
                  {completed}/{total}
                </div>
                <div className="text-xs text-slate-500">{percentage}% complete</div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
} 