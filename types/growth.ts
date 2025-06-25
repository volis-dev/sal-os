export interface ExistentialLevel {
  level: number
  name: string
  description: string
  color: string
  requirements: string[]
  focus: string
}

export interface GravityCategory {
  id: string
  name: string
  icon: any // Lucide icon component
  color: string
  description: string
  examples: string[]
}

export interface GravityItem {
  id: string
  categoryId: string
  name: string
  description: string
  severity: number // 1-5 scale
  impact: string
  actionPlan: string
  dateIdentified: string
  status: "active" | "improving" | "resolved"
  lastReviewed: string
}

export interface GrowthGoal {
  id: string
  title: string
  description: string
  category: "spiritual" | "mental" | "physical" | "social" | "emotional" | "financial" | "moral" | "constitutional"
  targetDate: string
  progress: number
  milestones: string[]
  completedMilestones: number
  priority: "low" | "medium" | "high"
  status: "active" | "completed" | "paused"
  dateCreated: string
  lastUpdated: string
}

export interface WeeklyReview {
  id: string
  weekOf: string
  overallRating: number
  wins: string[]
  challenges: string[]
  lessons: string[]
  nextWeekFocus: string[]
  gravityProgress: Record<string, number>
  arenaProgress: Record<string, number>
  dateCreated: string
}

export interface NewGravityItem {
  name: string
  description: string
  severity: number
  impact: string
  actionPlan: string
  categoryId: string
}

export interface GrowthTrajectory {
  trajectory: number
  gravityScore: number
  goalCompletion: number
  arenaScore: number
}

export interface GrowthStats {
  totalGoals: number
  activeGoals: number
  completedGoals: number
  averageProgress: number
  activeGravityItems: number
  resolvedIssues: number
  weeklyReviews: number
} 