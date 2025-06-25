"use client"

import { useState, useEffect } from "react"
import type { JourneyProgress, Achievement } from "@/types/journey-map"
import { aggregateProgress, getAchievements } from "@/components/aggregate-progress-utils"
import { journeyMapService, journeyNodesService, journeyConnectionsService } from "@/services/journey-map"

export function useJourneyMap() {
  const [progress, setProgress] = useState<JourneyProgress | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "all">("month")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Load journey data from Supabase
        const [maps, nodes, connections] = await Promise.all([
          journeyMapService.getAllJourneyMaps(),
          // Note: Would need to load nodes and connections for all maps
          // For now, using empty arrays
          Promise.resolve([]),
          Promise.resolve([])
        ])

        // Calculate progress using the existing utility functions
        // Note: This would need to be updated to work with Supabase data
        const progressData = aggregateProgress()
        setProgress(progressData)
        
        const rawAchievements = getAchievements(progressData)
        setAchievements(
          rawAchievements.map((a: any) => ({
            ...a,
            achieved: Boolean(a.dateEarned),
          }))
        )
      } catch (err) {
        console.error("Error loading journey data:", err)
        setError("Failed to load journey data")
        setProgress(null)
        setAchievements([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return {
    progress,
    achievements,
    selectedTimeframe,
    setSelectedTimeframe,
    formatTime,
    isLoading,
    error,
  }
} 