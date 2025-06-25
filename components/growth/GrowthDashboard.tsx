"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  Star,
  ArrowUp,
  CheckCircle2,
  AlertTriangle,
  Target,
  Calendar,
  Clock,
  Eye,
} from "lucide-react"
import type { ExistentialLevel, GrowthTrajectory, GrowthStats, GravityItem } from "@/types/growth"
import { gravityCategories } from "@/lib/growth-constants"

interface GrowthDashboardProps {
  currentLevelData: ExistentialLevel
  recommendedLevelData: ExistentialLevel
  currentLevel: number
  recommendedLevel: number
  growthData: GrowthTrajectory
  growthStats: GrowthStats
  gravityItems: GravityItem[]
  onUpdateLevel: (level: number) => void
}

export function GrowthDashboard({
  currentLevelData,
  recommendedLevelData,
  currentLevel,
  recommendedLevel,
  growthData,
  growthStats,
  gravityItems,
  onUpdateLevel,
}: GrowthDashboardProps) {
  return (
    <>
      {/* Current Level & Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Existential Level */}
        <Card className="border-0 shadow-2xl glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Star className="h-6 w-6 text-amber-500" />
              Current Existential Level
            </CardTitle>
            <CardDescription>Your current stage in the SAL journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div
                className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r ${currentLevelData.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg`}
              >
                {currentLevel}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{currentLevelData.name}</h3>
              <p className="text-slate-600 leading-relaxed">{currentLevelData.description}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800">Current Focus:</h4>
              <p className="text-sm text-slate-600 italic">{currentLevelData.focus}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800">Requirements for Next Level:</h4>
              <div className="space-y-2">
                {currentLevelData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-slate-600">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {recommendedLevel > currentLevel && (
              <div className="p-4 glass-card rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUp className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-800">Ready to Advance!</span>
                </div>
                <p className="text-sm text-green-700">
                  Based on your progress, you're ready for Level {recommendedLevel}: {recommendedLevelData.name}
                </p>
                <Button
                  onClick={() => onUpdateLevel(recommendedLevel)}
                  className="mt-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                  size="sm"
                >
                  Advance to Level {recommendedLevel}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Growth Trajectory */}
        <Card className="border-0 shadow-2xl glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
              Growth Trajectory
            </CardTitle>
            <CardDescription>Your overall development momentum</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - growthData.trajectory / 100)}`}
                    className="text-green-600 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-slate-800">{growthData.trajectory}%</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Overall Growth Score</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{Math.round(growthData.arenaScore)}%</div>
                <div className="text-xs text-slate-500">Life Arenas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{Math.round(growthData.goalCompletion)}%</div>
                <div className="text-xs text-slate-500">Goals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{100 - growthData.gravityScore}%</div>
                <div className="text-xs text-slate-500">Freedom</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Life Arena Balance</span>
                <span className="font-medium">{Math.round(growthData.arenaScore)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${growthData.arenaScore}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Goal Achievement</span>
                <span className="font-medium">{Math.round(growthData.goalCompletion)}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${growthData.goalCompletion}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Freedom from Gravity</span>
                <span className="font-medium">{100 - growthData.gravityScore}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${100 - growthData.gravityScore}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-xl glass-card">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-red-500" />
            <div className="text-2xl font-bold text-slate-800">{growthStats.activeGravityItems}</div>
            <div className="text-sm text-slate-600">Active Gravity Items</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl glass-card">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-3 text-green-500" />
            <div className="text-2xl font-bold text-slate-800">{growthStats.activeGoals}</div>
            <div className="text-sm text-slate-600">Active Goals</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl glass-card">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-blue-500" />
            <div className="text-2xl font-bold text-slate-800">{growthStats.resolvedIssues}</div>
            <div className="text-sm text-slate-600">Resolved Issues</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl glass-card">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-3 text-purple-500" />
            <div className="text-2xl font-bold text-slate-800">{growthStats.weeklyReviews}</div>
            <div className="text-sm text-slate-600">Weekly Reviews</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-500" />
            Recent Growth Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gravityItems
              .sort((a, b) => new Date(b.lastReviewed).getTime() - new Date(a.lastReviewed).getTime())
              .slice(0, 5)
              .map((item) => {
                const category = gravityCategories.find((cat) => cat.id === item.categoryId)
                return (
                  <div key={item.id} className="flex items-center gap-4 p-3 glass-card rounded-xl">
                    {category && <category.icon className="h-5 w-5 text-slate-500" />}
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500">
                        {category?.name} • Last reviewed {new Date(item.lastReviewed).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      className={
                        item.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : item.status === "improving"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                )
              })}

            {gravityItems.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No gravity items identified yet</p>
                <p className="text-xs mt-1">Start by identifying areas that hold you back</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
} 