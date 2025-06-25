"use client"

import { Badge } from "@/components/ui/badge"
import type { Achievement } from "@/types/journey-map"

interface AchievementsListProps {
  achievements: Achievement[]
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {achievements.map((ach) => (
        <div
          key={ach.id}
          className={`p-4 rounded-xl glass-card flex flex-col gap-2 border-2 ${ach.achieved ? "border-green-400" : "border-slate-200"}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{ach.icon}</span>
            <span className="font-bold text-slate-800">{ach.title}</span>
            {ach.achieved && <Badge className="ml-auto bg-green-500 text-white">Achieved</Badge>}
          </div>
          <div className="text-xs text-slate-500">{ach.description}</div>
          {ach.achieved && ach.dateAchieved && (
            <div className="text-xs text-green-600 mt-1">Earned: {new Date(ach.dateAchieved).toLocaleDateString()}</div>
          )}
        </div>
      ))}
    </div>
  )
} 