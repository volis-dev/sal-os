"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Circle, Play, Pause, Timer } from "lucide-react"
import type { SALTask } from "@/types/tasks"

interface TaskDetailProps {
  task: SALTask
  isActive: boolean
  timerSeconds: number
  onBack: () => void
  onComplete: (taskId: number) => void
  onStartTimer: (taskId: number) => void
  onStopTimer: () => void
  onUpdateNotes: (taskId: number, notes: string) => void
  formatTime: (seconds: number) => string
}

export function TaskDetail({
  task,
  isActive,
  timerSeconds,
  onBack,
  onComplete,
  onStartTimer,
  onStopTimer,
  onUpdateNotes,
  formatTime,
}: TaskDetailProps) {
  const categoryConfig = {
    foundation: { color: "from-slate-500 to-gray-600", icon: "🏗️", label: "Foundation" },
    knowledge: { color: "from-blue-500 to-indigo-600", icon: "📚", label: "Knowledge" },
    action: { color: "from-green-500 to-emerald-600", icon: "⚡", label: "Action" },
    reflection: { color: "from-purple-500 to-pink-600", icon: "🤔", label: "Reflection" },
    service: { color: "from-orange-500 to-red-600", icon: "🤝", label: "Service" },
    creation: { color: "from-yellow-500 to-amber-600", icon: "✨", label: "Creation" },
  }

  const config = categoryConfig[task.category]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="hover:glass-card rounded-xl transition-all duration-300"
        >
          ← Back to Tasks
        </Button>
        <div className="flex gap-2">
          {task.status !== "completed" && (
            <Button
              onClick={() => onComplete(task.id)}
              className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-xl"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      {/* Task Header */}
      <Card className="border-0 shadow-xl glass-card">
        <div
          className={`h-32 bg-gradient-to-r ${config.color} rounded-t-xl relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white text-3xl font-bold">{task.title}</h1>
                <p className="text-white/80 text-lg font-medium">
                  {config.label} • {task.bookSection}
                </p>
              </div>
              <div className="text-right">
                <div className="text-white text-4xl">{config.icon}</div>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-sm font-medium text-slate-600">Status</span>
              <Badge
                className={`mt-2 ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : task.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {task.status === "not-started"
                  ? "Not Started"
                  : task.status === "in-progress"
                    ? "In Progress"
                    : "Completed"}
              </Badge>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-600">Time Spent</span>
              <div className="text-2xl font-bold text-slate-800 mt-1">{task.timeSpent} minutes</div>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-600">Estimated Time</span>
              <div className="text-2xl font-bold text-slate-800 mt-1">
                {task.estimatedMinutes} minutes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle>Task Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 leading-relaxed">{task.description}</p>
        </CardContent>
      </Card>

      {/* Sub-tasks for multi-part tasks */}
      {task.isMultiPart && task.subTasks && (
        <Card className="border-0 shadow-xl glass-card">
          <CardHeader>
            <CardTitle>Sub-tasks</CardTitle>
            <CardDescription>
              Progress: {task.completedSubTasks || 0}/{task.subTasks.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {task.subTasks.map((subTask, index) => (
                <div key={index} className="flex items-center gap-3 p-3 glass-card rounded-xl">
                  {index < (task.completedSubTasks || 0) ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-400" />
                  )}
                  <span
                    className={`font-medium ${
                      index < (task.completedSubTasks || 0)
                        ? "text-green-700 line-through"
                        : "text-slate-700"
                    }`}
                  >
                    {subTask}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle>Notes & Reflections</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={task.notes}
            onChange={(e) => onUpdateNotes(task.id, e.target.value)}
            placeholder="Add your notes, reflections, and progress updates..."
            className="glass-card border-0 min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Timer */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Timer className="h-5 w-5" />
            Time Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              {isActive ? (
                <div className="text-2xl font-bold text-blue-600">{formatTime(timerSeconds)}</div>
              ) : (
                <div className="text-lg text-slate-600">Timer not running</div>
              )}
            </div>
            <div className="flex gap-2">
              {!isActive ? (
                <Button
                  onClick={() => onStartTimer(task.id)}
                  className="bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                  disabled={task.status === "completed"}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Timer
                </Button>
              ) : (
                <Button onClick={onStopTimer} className="bg-red-500 text-white">
                  <Pause className="mr-2 h-4 w-4" />
                  Stop Timer
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 