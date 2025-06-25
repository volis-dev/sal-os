"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search } from "lucide-react"
import type { ModulesStats } from "@/types/modules"

interface ModulesDashboardProps {
  modulesStats: ModulesStats
  searchTerm: string
  onSearchChange: (value: string) => void
}

export function ModulesDashboard({ modulesStats, searchTerm, onSearchChange }: ModulesDashboardProps) {
  return (
    <>
      {/* Overall Progress */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
            <BookOpen className="h-6 w-6 text-blue-500" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 text-lg">Chapters Completed</span>
            <Badge className="glass-card font-semibold px-3 py-1">
              {modulesStats.completedChapters}/{modulesStats.totalChapters} ({modulesStats.progressPercentage}%)
            </Badge>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full progress-tornasol rounded-full transition-all duration-500"
              style={{ width: `${modulesStats.progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 glass-card border-0"
          />
        </div>
      </div>
    </>
  )
} 