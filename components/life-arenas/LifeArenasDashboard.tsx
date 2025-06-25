"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import type { LifeArena, LifeArenaStats, ArenaProgress } from "@/types/life-arenas"

interface LifeArenasDashboardProps {
  arenas: LifeArena[]
  lifeArenaStats: LifeArenaStats
  getArenaProgress: (arena: LifeArena) => ArenaProgress
  onArenaSelect: (arena: LifeArena) => void
}

export function LifeArenasDashboard({
  arenas,
  lifeArenaStats,
  getArenaProgress,
  onArenaSelect,
}: LifeArenasDashboardProps) {
  return (
    <>
      {/* Overall Life Score Dashboard */}
      <Card className="border-0 shadow-2xl tornasol-gradient glow-effect text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            Your Holistic Life Assessment
          </CardTitle>
          <CardDescription className="text-white/80 font-medium">
            SAL Principle: "True success requires balance across all life arenas"
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-5xl font-bold">{lifeArenaStats.overallScore}/10</div>
              <div className="text-white/80 font-medium">Overall Life Score</div>
              <div className="text-sm text-white/70">{lifeArenaStats.overallProgress}% toward optimal life balance</div>
            </div>
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - lifeArenaStats.overallProgress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{lifeArenaStats.overallProgress}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arena Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {arenas.map((arena) => {
          const progress = getArenaProgress(arena)

          return (
            <Card
              key={arena.id}
              className="border-0 shadow-xl glass-card hover:glow-effect transition-all duration-300 group cursor-pointer"
              onClick={() => onArenaSelect(arena)}
            >
              {/* Gradient Header */}
              <div className={`h-24 bg-gradient-to-br ${arena.gradient} rounded-t-xl relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{arena.name}</h3>
                    <div className="text-white/80 text-2xl">{arena.icon}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-2xl font-bold">{arena.currentScore}/10</div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Current Progress</span>
                    <span className="text-slate-800 font-bold">{Math.round(progress.progressPercentage)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full bg-gradient-to-r ${arena.gradient} rounded-full transition-all duration-500`}
                      style={{ width: `${progress.progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Target: {arena.targetScore}/10</span>
                    <span>{progress.gapToTarget > 0 ? `+${progress.gapToTarget} to go` : "Target achieved!"}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-800">{arena.currentActions.length}</div>
                    <div className="text-xs text-slate-500">Active Goals</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-800">
                      {progress.completedMilestones}/{progress.totalMilestones}
                    </div>
                    <div className="text-xs text-slate-500">Milestones</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{arena.description}</p>

                {/* Last Updated */}
                <div className="text-xs text-slate-400 text-center">
                  Updated {new Date(arena.lastUpdated).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
} 