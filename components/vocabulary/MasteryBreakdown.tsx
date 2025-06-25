"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import type { MasteryBreakdownProps } from "@/types/vocabulary-dashboard"

export function MasteryBreakdown({ masteryStats, totalWords }: MasteryBreakdownProps) {
  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-amber-500" />
          Mastery Levels
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {masteryStats.map((level) => (
            <div key={level.value} className="text-center">
              <div
                className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center text-white font-bold text-xl`}
              >
                {level.count}
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">{level.label}</h3>
              <p className="text-xs text-slate-500">
                {totalWords > 0 ? Math.round((level.count / totalWords) * 100) : 0}%
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 