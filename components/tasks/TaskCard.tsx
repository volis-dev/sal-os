"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Play, Pause, Timer, Clock, Target } from "lucide-react"
import type { SALTask } from "@/types/tasks"

interface TaskCardProps {
  task: SALTask
  isActive: boolean
  timerSeconds: number
  onTaskClick: (task: SALTask) => void
  onStartTimer: (taskId: number) => void
  onStopTimer: () => void
  formatTime: (seconds: number) => string
}

export function TaskCard({
  task,
  isActive,
  timerSeconds,
  onTaskClick,
  onStartTimer,
  onStopTimer,
  formatTime,
}: TaskCardProps) {
  const categoryConfig = {
    foundation: { color: "from-slate-500 to-gray-600", icon: "🏗️" },
    knowledge: { color: "from-blue-500 to-indigo-600", icon: "📚" },
    action: { color: "from-green-500 to-emerald-600", icon: "⚡" },
    reflection: { color: "from-purple-500 to-pink-600", icon: "🤔" },
    service: { color: "from-orange-500 to-red-600", icon: "🤝" },
    creation: { color: "from-yellow-500 to-amber-600", icon: "✨" },
  }

  const config = categoryConfig[task.category]

  return (
    <Card
      className={`border-0 shadow-xl glass-card hover:glow-effect transition-all duration-300 cursor-pointer ${
        task.status === "completed" ? "ring-2 ring-green-200" : ""
      }`}
      onClick={() => onTaskClick(task)}
    >
      {/* Header */}
      <div className={`h-20 bg-gradient-to-r ${config.color} rounded-t-xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div>
            <div className="text-white text-2xl">{config.icon}</div>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
              {task.bookSection}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {task.status === "completed" && <CheckCircle2 className="h-6 w-6 text-white" />}
            {isActive && <Timer className="h-5 w-5 text-white animate-pulse" />}
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Title and Status */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-800 leading-tight">{task.title}</h3>
          <div className="flex items-center justify-between">
            <Badge
              variant={
                task.status === "completed"
                  ? "default"
                  : task.status === "in-progress"
                    ? "secondary"
                    : "outline"
              }
              className={
                task.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : task.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-slate-100 text-slate-600"
              }
            >
              {task.status === "not-started"
                ? "Not Started"
                : task.status === "in-progress"
                  ? "In Progress"
                  : "Completed"}
            </Badge>
            <span className="text-sm text-slate-500">#{task.id}</span>
          </div>
        </div>

        {/* Progress for multi-part tasks */}
        {task.isMultiPart && task.subTasks && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="font-medium">
                {task.completedSubTasks || 0}/{task.subTasks.length}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-500`}
                style={{
                  width: `${((task.completedSubTasks || 0) / task.subTasks.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{task.description}</p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{task.timeSpent}m spent</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>~{task.estimatedMinutes}m est.</span>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {!isActive ? (
            <Button
              onClick={() => onStartTimer(task.id)}
              size="sm"
              className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white"
              disabled={task.status === "completed"}
            >
              <Play className="mr-2 h-4 w-4" />
              Start Timer
            </Button>
          ) : (
            <Button onClick={onStopTimer} size="sm" className="flex-1 bg-red-500 text-white">
              <Pause className="mr-2 h-4 w-4" />
              Stop ({formatTime(timerSeconds)})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 