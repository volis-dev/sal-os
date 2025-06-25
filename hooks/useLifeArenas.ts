"use client"

import { useState, useEffect } from "react"
import type { LifeArena, Milestone, NewMilestone, LifeArenaStats, ArenaProgress } from "@/types/life-arenas"
import { defaultArenas } from "@/lib/life-arenas-constants"
import { lifeArenasService, milestonesService } from "@/services/life-arenas"

export function useLifeArenas() {
  const [arenas, setArenas] = useState<LifeArena[]>(defaultArenas)
  const [selectedArena, setSelectedArena] = useState<LifeArena | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingArena, setEditingArena] = useState<LifeArena | null>(null)
  const [newAction, setNewAction] = useState("")
  const [newMilestone, setNewMilestone] = useState<NewMilestone>({ title: "", description: "", targetDate: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load arenas from Supabase
  useEffect(() => {
    const loadArenas = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const loadedArenas = await lifeArenasService.getAllLifeArenas()
        setArenas(loadedArenas.length > 0 ? loadedArenas : defaultArenas)
      } catch (err) {
        console.error("Error loading life arenas:", err)
        setError("Failed to load life arenas")
        setArenas(defaultArenas)
      } finally {
        setIsLoading(false)
      }
    }

    loadArenas()
  }, [])

  const updateArena = async (updatedArena: LifeArena) => {
    try {
      setError(null)
      const savedArena = await lifeArenasService.updateLifeArena(updatedArena.id, {
        name: updatedArena.name,
        description: updatedArena.description,
        currentScore: updatedArena.currentScore,
        targetScore: updatedArena.targetScore,
        gradient: updatedArena.gradient,
        visionStatement: updatedArena.visionStatement,
        currentActions: updatedArena.currentActions,
        salPrinciple: updatedArena.salPrinciple,
        icon: updatedArena.icon
      })
      
      const updatedArenas = arenas.map((arena) =>
        arena.id === savedArena.id ? savedArena : arena
      )
      setArenas(updatedArenas)
    } catch (err) {
      console.error("Error updating arena:", err)
      setError("Failed to update arena")
    }
  }

  const addAction = () => {
    if (newAction.trim() && editingArena) {
      const updatedArena = {
        ...editingArena,
        currentActions: [...editingArena.currentActions, newAction.trim()],
      }
      setEditingArena(updatedArena)
      setNewAction("")
    }
  }

  const removeAction = (index: number) => {
    if (editingArena) {
      const updatedArena = {
        ...editingArena,
        currentActions: editingArena.currentActions.filter((_, i) => i !== index),
      }
      setEditingArena(updatedArena)
    }
  }

  const addMilestone = async () => {
    if (newMilestone.title.trim() && newMilestone.targetDate && editingArena) {
      try {
        setError(null)
        const savedMilestone = await milestonesService.createMilestone(editingArena.id, {
          title: newMilestone.title.trim(),
          description: newMilestone.description.trim(),
          targetDate: newMilestone.targetDate
        })
        
        const updatedArena = {
          ...editingArena,
          milestones: [...editingArena.milestones, savedMilestone],
        }
        setEditingArena(updatedArena)
        setNewMilestone({ title: "", description: "", targetDate: "" })
      } catch (err) {
        console.error("Error adding milestone:", err)
        setError("Failed to add milestone")
      }
    }
  }

  const toggleMilestone = async (milestoneId: string) => {
    if (editingArena) {
      try {
        setError(null)
        const milestone = editingArena.milestones.find(m => m.id === milestoneId)
        if (!milestone) return

        const updatedMilestone = await milestonesService.updateMilestone(editingArena.id, milestoneId, {
          completed: !milestone.completed,
          completedDate: !milestone.completed ? new Date().toISOString() : undefined
        })

        const updatedArena = {
          ...editingArena,
          milestones: editingArena.milestones.map((milestone) =>
            milestone.id === milestoneId ? updatedMilestone : milestone
          ),
        }
        setEditingArena(updatedArena)
      } catch (err) {
        console.error("Error updating milestone:", err)
        setError("Failed to update milestone")
      }
    }
  }

  const saveChanges = async () => {
    if (editingArena) {
      await updateArena(editingArena)
      setSelectedArena(editingArena)
      setIsEditing(false)
      setEditingArena(null)
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditingArena(null)
    setNewAction("")
    setNewMilestone({ title: "", description: "", targetDate: "" })
  }

  const startEditing = (arena: LifeArena) => {
    setEditingArena({ ...arena })
    setIsEditing(true)
  }

  const selectArena = (arena: LifeArena) => {
    setSelectedArena(arena)
  }

  const goBackToOverview = () => {
    setSelectedArena(null)
    setIsEditing(false)
    setEditingArena(null)
  }

  const updateNewMilestone = (field: keyof NewMilestone, value: string) => {
    setNewMilestone((prev) => ({ ...prev, [field]: value }))
  }

  // Calculate overall life score
  const overallScore = Math.round((arenas.reduce((sum, arena) => sum + arena.currentScore, 0) / arenas.length) * 10) / 10
  const overallProgress = Math.round((overallScore / 10) * 100)

  const lifeArenaStats: LifeArenaStats = {
    overallScore,
    overallProgress,
    totalArenas: arenas.length,
    averageScore: overallScore,
  }

  const getArenaProgress = (arena: LifeArena): ArenaProgress => {
    const progressPercentage = (arena.currentScore / 10) * 100
    const gapToTarget = arena.targetScore - arena.currentScore
    const completedMilestones = arena.milestones.filter((m) => m.completed).length

    return {
      progressPercentage,
      gapToTarget,
      completedMilestones,
      totalMilestones: arena.milestones.length,
    }
  }

  return {
    // State
    arenas,
    selectedArena,
    isEditing,
    editingArena,
    newAction,
    newMilestone,
    lifeArenaStats,
    isLoading,
    error,

    // Actions
    selectArena,
    goBackToOverview,
    startEditing,
    saveChanges,
    cancelEditing,
    addAction,
    removeAction,
    addMilestone,
    toggleMilestone,
    updateNewMilestone,
    setNewAction,
    setEditingArena,

    // Utilities
    getArenaProgress,
  }
} 