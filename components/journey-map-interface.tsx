"use client"

import { useJourneyMap } from "@/hooks/useJourneyMap"
import { salBooks } from "@/lib/journey-map-constants"
import { JourneyMapDashboard } from "@/components/journey-map/JourneyMapDashboard"
import { BookProgressGrid } from "@/components/journey-map/BookProgressGrid"
import { AchievementsList } from "@/components/journey-map/AchievementsList"
import { TimeframeSelector } from "@/components/journey-map/TimeframeSelector"

interface JourneyMapProps {
  setActiveTab: (tab: string) => void
}

export function JourneyMapInterface({ setActiveTab }: JourneyMapProps) {
  const {
    progress,
    achievements,
    selectedTimeframe,
    setSelectedTimeframe,
    formatTime,
  } = useJourneyMap()

  if (!progress) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your SAL journey...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 bg-clip-text text-transparent tracking-tight">
          Journey Map
        </h1>
        <p className="text-slate-600 text-lg font-medium">
          Visualize your progress and achievements across the Self-Action Leadership journey
        </p>
      </div>

      <JourneyMapDashboard progress={progress} onTabChange={setActiveTab} formatTime={formatTime} />

      <div className="flex items-center justify-between mt-8 mb-2">
        <h2 className="text-2xl font-bold text-slate-800">Books Progress</h2>
        <TimeframeSelector value={selectedTimeframe} onChange={setSelectedTimeframe} />
      </div>
      <BookProgressGrid books={salBooks} progress={progress} />

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Achievements</h2>
        <AchievementsList achievements={achievements} />
      </div>
    </div>
  )
}
