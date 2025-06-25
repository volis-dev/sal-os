export interface SALTask {
  id: number
  title: string
  description: string
  bookSection: string
  category: "foundation" | "knowledge" | "action" | "reflection" | "service" | "creation"
  status: "not-started" | "in-progress" | "completed"
  startedDate?: string
  completedDate?: string
  timeSpent: number
  notes: string
  evidenceUrl?: string
  relatedJournalIds: string[]
  relatedArenaIds: string[]
  estimatedMinutes: number
  isMultiPart: boolean
  subTasks?: string[]
  completedSubTasks?: number
}

export interface CategoryConfig {
  color: string
  icon: string
  label: string
}

export interface CategoryStats {
  category: string
  total: number
  completed: number
  percentage: number
}

export interface TaskStats {
  completedTasks: number
  inProgressTasks: number
  totalTimeSpent: number
  progressPercentage: number
} 