"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { JournalStats } from "@/types/journal"

interface JournalStatsProps {
  stats: JournalStats
}

export function JournalStats({ stats }: JournalStatsProps) {
  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-slate-800">Journal Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-600">Total Pages</span>
          <Badge className="glass-card font-semibold">{stats.totalPages}/200</Badge>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${stats.progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{stats.totalEntries} entries</span>
          <span>{stats.totalWords} words</span>
        </div>
      </CardContent>
    </Card>
  )
} 