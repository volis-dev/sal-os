export interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  completed: boolean
  completedDate?: string
}

export interface LifeArena {
  id: string
  name: string
  description: string
  currentScore: number
  targetScore: number
  gradient: string
  visionStatement: string
  currentActions: string[]
  milestones: Milestone[]
  lastUpdated: string
  salPrinciple: string
  icon: string
}

export interface NewMilestone {
  title: string
  description: string
  targetDate: string
}

export interface LifeArenaStats {
  overallScore: number
  overallProgress: number
  totalArenas: number
  averageScore: number
}

export interface ArenaProgress {
  progressPercentage: number
  gapToTarget: number
  completedMilestones: number
  totalMilestones: number
}

export interface ArenaStats {
  totalArenas: number
  averageScore: number
  totalTargetScore: number
  totalCurrentScore: number
  overallProgress: number
} 