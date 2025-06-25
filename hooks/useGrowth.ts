"use client"

import { useState, useEffect } from "react"
import type {
  GravityItem,
  GrowthGoal,
  WeeklyReview,
  NewGravityItem,
  GrowthTrajectory,
  GrowthStats,
} from "@/types/growth"
import { existentialLevels } from "@/lib/growth-constants"
import { 
  gravityItemsService, 
  growthGoalsService, 
  weeklyReviewsService, 
  growthStatsService 
} from "@/services/growth-engine"

export function useGrowth() {
  const [currentView, setCurrentView] = useState<"dashboard" | "gravity" | "goals" | "reviews" | "insights">("dashboard")
  const [gravityItems, setGravityItems] = useState<GravityItem[]>([])
  const [growthGoals, setGrowthGoals] = useState<GrowthGoal[]>([])
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>([])
  const [currentLevel, setCurrentLevel] = useState(2)
  const [isEditingGravity, setIsEditingGravity] = useState(false)
  const [selectedGravityCategory, setSelectedGravityCategory] = useState<string | null>(null)
  const [newGravityItem, setNewGravityItem] = useState<NewGravityItem>({
    name: "",
    description: "",
    severity: 3,
    impact: "",
    actionPlan: "",
    categoryId: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [gravityData, goalsData, reviewsData] = await Promise.all([
          gravityItemsService.getAllGravityItems(),
          growthGoalsService.getAllGrowthGoals(),
          weeklyReviewsService.getAllWeeklyReviews()
        ])

        setGravityItems(gravityData)
        setGrowthGoals(goalsData)
        setWeeklyReviews(reviewsData)
      } catch (err) {
        console.error("Error loading growth data:", err)
        setError("Failed to load growth data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const addGravityItem = async () => {
    if (newGravityItem.name.trim() && newGravityItem.categoryId) {
      try {
        setError(null)
        const savedItem = await gravityItemsService.createGravityItem(newGravityItem)

        setGravityItems(prev => [...prev, savedItem])

        setNewGravityItem({
          name: "",
          description: "",
          severity: 3,
          impact: "",
          actionPlan: "",
          categoryId: "",
        })
        setIsEditingGravity(false)
      } catch (err) {
        console.error("Error adding gravity item:", err)
        setError("Failed to add gravity item")
      }
    }
  }

  const updateGravityItemStatus = async (id: string, status: "active" | "improving" | "resolved") => {
    try {
      setError(null)
      const updatedItem = await gravityItemsService.updateGravityItem(id, {
        status,
        lastReviewed: new Date().toISOString()
      })

      setGravityItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ))
    } catch (err) {
      console.error("Error updating gravity item status:", err)
      setError("Failed to update gravity item status")
    }
  }

  // Calculate overall gravity score (lower is better)
  const calculateGravityScore = () => {
    if (gravityItems.length === 0) return 0
    const activeItems = gravityItems.filter((item) => item.status === "active")
    const totalSeverity = activeItems.reduce((sum, item) => sum + item.severity, 0)
    return Math.round((totalSeverity / (activeItems.length * 5)) * 100)
  }

  // Calculate growth trajectory
  const calculateGrowthTrajectory = (): GrowthTrajectory => {
    const gravityScore = calculateGravityScore()
    const completedGoals = growthGoals.filter((goal) => goal.status === "completed").length
    const totalGoals = growthGoals.length || 1

    // Note: Life arenas data would need to be loaded from its service
    // For now, we'll use a simplified calculation
    const averageArenaScore = 5 // Placeholder - would need to integrate with life arenas service

    const goalCompletion = (completedGoals / totalGoals) * 100
    const arenaScore = (averageArenaScore / 10) * 100

    // Weighted calculation: 40% arena scores, 30% goal completion, 30% gravity (inverted)
    const trajectory = Math.round(arenaScore * 0.4 + goalCompletion * 0.3 + (100 - gravityScore) * 0.3)

    return {
      trajectory,
      gravityScore,
      goalCompletion,
      arenaScore,
    }
  }

  const getRecommendedLevel = () => {
    const { trajectory } = calculateGrowthTrajectory()

    // Note: These would need to be loaded from their respective services
    // For now, using simplified calculations
    const completedBooks = 0 // Would need modules service
    const journalCount = 0 // Would need journal service
    const completedTasks = 0 // Would need tasks service

    // Level calculation based on multiple factors
    let recommendedLevel = 1

    if (completedBooks >= 1 && journalCount >= 10) recommendedLevel = 2
    if (completedBooks >= 3 && journalCount >= 30 && trajectory >= 40) recommendedLevel = 3
    if (completedBooks >= 5 && journalCount >= 100 && trajectory >= 60) recommendedLevel = 4
    if (completedBooks >= 6 && trajectory >= 70 && completedTasks >= 15) recommendedLevel = 5
    if (completedBooks >= 7 && trajectory >= 80 && completedTasks >= 20) recommendedLevel = 6
    if (completedBooks >= 8 && trajectory >= 85 && completedTasks >= 23) recommendedLevel = 7
    if (trajectory >= 90 && completedTasks >= 25) recommendedLevel = 8
    if (trajectory >= 95) recommendedLevel = 9

    return recommendedLevel
  }

  const updateCurrentLevel = (level: number) => {
    setCurrentLevel(level)
    // Note: Current level could be stored in user preferences table
    // For now, keeping it in local state
  }

  const updateNewGravityItem = (field: keyof NewGravityItem, value: string | number) => {
    setNewGravityItem((prev) => ({ ...prev, [field]: value }))
  }

  const openGravityEditor = (categoryId?: string) => {
    if (categoryId) {
      setSelectedGravityCategory(categoryId)
      setNewGravityItem((prev) => ({ ...prev, categoryId }))
    }
    setIsEditingGravity(true)
  }

  const closeGravityEditor = () => {
    setIsEditingGravity(false)
    setSelectedGravityCategory(null)
    setNewGravityItem({
      name: "",
      description: "",
      severity: 3,
      impact: "",
      actionPlan: "",
      categoryId: "",
    })
  }

  // Computed values
  const gravityScore = calculateGravityScore()
  const growthData = calculateGrowthTrajectory()
  const recommendedLevel = getRecommendedLevel()
  const currentLevelData = existentialLevels[currentLevel - 1]
  const recommendedLevelData = existentialLevels[recommendedLevel - 1]

  const growthStats: GrowthStats = {
    totalGoals: growthGoals.length,
    activeGoals: growthGoals.filter((goal) => goal.status === "active").length,
    completedGoals: growthGoals.filter((goal) => goal.status === "completed").length,
    averageProgress: growthGoals.length > 0 
      ? Math.round(growthGoals.reduce((sum, goal) => sum + goal.progress, 0) / growthGoals.length)
      : 0,
    activeGravityItems: gravityItems.filter((item) => item.status === "active").length,
    resolvedIssues: gravityItems.filter((item) => item.status === "resolved").length,
    weeklyReviews: weeklyReviews.length,
  }

  return {
    // State
    currentView,
    gravityItems,
    growthGoals,
    weeklyReviews,
    currentLevel,
    isEditingGravity,
    selectedGravityCategory,
    newGravityItem,
    gravityScore,
    growthData,
    recommendedLevel,
    currentLevelData,
    recommendedLevelData,
    growthStats,
    isLoading,
    error,

    // Actions
    setCurrentView,
    updateCurrentLevel,
    addGravityItem,
    updateGravityItemStatus,
    updateNewGravityItem,
    openGravityEditor,
    closeGravityEditor,
  }
} 