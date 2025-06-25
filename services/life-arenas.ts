import { supabase } from '@/lib/supabase'
import type { LifeArena, Milestone, NewMilestone, LifeArenaStats, ArenaProgress, ArenaStats } from '@/types/life-arenas'

// Life Arenas CRUD Operations
export const lifeArenasService = {
  // Create a new life arena
  async createLifeArena(arena: Omit<LifeArena, 'id' | 'created_at' | 'updated_at'>): Promise<LifeArena> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('life_arenas')
      .insert({
        name: arena.name,
        description: arena.description,
        current_score: arena.currentScore,
        target_score: arena.targetScore,
        gradient: arena.gradient,
        vision_statement: arena.visionStatement,
        current_actions: arena.currentActions,
        milestones: arena.milestones,
        last_updated: arena.lastUpdated,
        sal_principle: arena.salPrinciple,
        icon: arena.icon,
        user_id: session.user.id
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      currentScore: data.current_score,
      targetScore: data.target_score,
      gradient: data.gradient,
      visionStatement: data.vision_statement,
      currentActions: data.current_actions || [],
      milestones: data.milestones || [],
      lastUpdated: data.last_updated,
      salPrinciple: data.sal_principle,
      icon: data.icon
    }
  },

  // Get life arena by ID
  async getLifeArenaById(id: string): Promise<LifeArena | null> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('life_arenas')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      currentScore: data.current_score,
      targetScore: data.target_score,
      gradient: data.gradient,
      visionStatement: data.vision_statement,
      currentActions: data.current_actions || [],
      milestones: data.milestones || [],
      lastUpdated: data.last_updated,
      salPrinciple: data.sal_principle,
      icon: data.icon
    }
  },

  // Get all life arenas
  async getAllLifeArenas(): Promise<LifeArena[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('life_arenas')
      .select('*')
      .eq('user_id', session.user.id)
      .order('name', { ascending: true })

    if (error) throw error

    return data.map((arena: any) => ({
      id: arena.id,
      name: arena.name,
      description: arena.description,
      currentScore: arena.current_score,
      targetScore: arena.target_score,
      gradient: arena.gradient,
      visionStatement: arena.vision_statement,
      currentActions: arena.current_actions || [],
      milestones: arena.milestones || [],
      lastUpdated: arena.last_updated,
      salPrinciple: arena.sal_principle,
      icon: arena.icon
    }))
  },

  // Update a life arena
  async updateLifeArena(id: string, updates: Partial<Omit<LifeArena, 'id' | 'created_at' | 'updated_at'>>): Promise<LifeArena> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('life_arenas')
      .update({
        name: updates.name,
        description: updates.description,
        current_score: updates.currentScore,
        target_score: updates.targetScore,
        gradient: updates.gradient,
        vision_statement: updates.visionStatement,
        current_actions: updates.currentActions,
        milestones: updates.milestones,
        last_updated: updates.lastUpdated,
        sal_principle: updates.salPrinciple,
        icon: updates.icon
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      currentScore: data.current_score,
      targetScore: data.target_score,
      gradient: data.gradient,
      visionStatement: data.vision_statement,
      currentActions: data.current_actions || [],
      milestones: data.milestones || [],
      lastUpdated: data.last_updated,
      salPrinciple: data.sal_principle,
      icon: data.icon
    }
  },

  // Delete a life arena
  async deleteLifeArena(id: string): Promise<void> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('life_arenas')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error
  },

  // Update arena score
  async updateArenaScore(id: string, newScore: number): Promise<LifeArena> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('life_arenas')
      .update({
        current_score: newScore,
        last_updated: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      currentScore: data.current_score,
      targetScore: data.target_score,
      gradient: data.gradient,
      visionStatement: data.vision_statement,
      currentActions: data.current_actions || [],
      milestones: data.milestones || [],
      lastUpdated: data.last_updated,
      salPrinciple: data.sal_principle,
      icon: data.icon
    }
  },

  // Get arena statistics
  async getArenaStats(): Promise<ArenaStats> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('life_arenas')
      .select('current_score, target_score')
      .eq('user_id', session.user.id)

    if (error) throw error

    const totalArenas = data.length
    const averageScore = data.length > 0 
      ? Math.round(data.reduce((sum: number, arena: any) => sum + arena.current_score, 0) / data.length)
      : 0
    const totalTargetScore = data.reduce((sum: number, arena: any) => sum + arena.target_score, 0)
    const totalCurrentScore = data.reduce((sum: number, arena: any) => sum + arena.current_score, 0)
    const overallProgress = totalTargetScore > 0 ? Math.round((totalCurrentScore / totalTargetScore) * 100) : 0

    return {
      totalArenas,
      averageScore,
      totalTargetScore,
      totalCurrentScore,
      overallProgress
    }
  }
}

// Milestones CRUD Operations (working with JSONB field)
export const milestonesService = {
  // Create a new milestone
  async createMilestone(arenaId: string, milestone: NewMilestone): Promise<Milestone> {
    // First get the current arena
    const { data: arena, error: arenaError } = await supabase
      .from('life_arenas')
      .select('milestones')
      .eq('id', arenaId)
      .single()

    if (arenaError) throw arenaError

    const newMilestone: Milestone = {
      id: crypto.randomUUID(),
      title: milestone.title,
      description: milestone.description,
      targetDate: milestone.targetDate,
      completed: false
    }

    const updatedMilestones = [...(arena.milestones || []), newMilestone]

    // Update the arena with the new milestone
    const { data, error } = await supabase
      .from('life_arenas')
      .update({ milestones: updatedMilestones })
      .eq('id', arenaId)
      .select('milestones')
      .single()

    if (error) throw error

    return newMilestone
  },

  // Get milestone by ID
  async getMilestoneById(arenaId: string, milestoneId: string): Promise<Milestone | null> {
    const { data: arena, error } = await supabase
      .from('life_arenas')
      .select('milestones')
      .eq('id', arenaId)
      .single()

    if (error) throw error
    if (!arena || !arena.milestones) return null

    const milestone = arena.milestones.find((m: Milestone) => m.id === milestoneId)
    return milestone || null
  },

  // Get all milestones for a life arena
  async getMilestonesByArenaId(arenaId: string): Promise<Milestone[]> {
    const { data: arena, error } = await supabase
      .from('life_arenas')
      .select('milestones')
      .eq('id', arenaId)
      .single()

    if (error) throw error
    return arena?.milestones || []
  },

  // Update a milestone
  async updateMilestone(arenaId: string, milestoneId: string, updates: Partial<Omit<Milestone, 'id'>>): Promise<Milestone> {
    // First get the current arena
    const { data: arena, error: arenaError } = await supabase
      .from('life_arenas')
      .select('milestones')
      .eq('id', arenaId)
      .single()

    if (arenaError) throw arenaError

    const milestones = arena.milestones || []
    const milestoneIndex = milestones.findIndex((m: Milestone) => m.id === milestoneId)
    
    if (milestoneIndex === -1) {
      throw new Error('Milestone not found')
    }

    // Update the milestone
    const updatedMilestone: Milestone = {
      ...milestones[milestoneIndex],
      ...updates
    }

    milestones[milestoneIndex] = updatedMilestone

    // Update the arena with the modified milestones
    const { error } = await supabase
      .from('life_arenas')
      .update({ milestones })
      .eq('id', arenaId)

    if (error) throw error

    return updatedMilestone
  },

  // Delete a milestone
  async deleteMilestone(arenaId: string, milestoneId: string): Promise<void> {
    // First get the current arena
    const { data: arena, error: arenaError } = await supabase
      .from('life_arenas')
      .select('milestones')
      .eq('id', arenaId)
      .single()

    if (arenaError) throw arenaError

    const milestones = arena.milestones || []
    const filteredMilestones = milestones.filter((m: Milestone) => m.id !== milestoneId)

    // Update the arena with the filtered milestones
    const { error } = await supabase
      .from('life_arenas')
      .update({ milestones: filteredMilestones })
      .eq('id', arenaId)

    if (error) throw error
  },

  // Get arena progress
  async getArenaProgress(arenaId: string): Promise<ArenaProgress> {
    const { data: arena, error } = await supabase
      .from('life_arenas')
      .select('current_score, target_score, milestones')
      .eq('id', arenaId)
      .single()

    if (error) throw error

    const milestones = arena.milestones || []
    const totalMilestones = milestones.length
    const completedMilestones = milestones.filter((m: Milestone) => m.completed).length
    const progressPercentage = arena.target_score > 0 
      ? Math.round((arena.current_score / arena.target_score) * 100)
      : 0
    const gapToTarget = arena.target_score - arena.current_score

    return {
      progressPercentage,
      gapToTarget,
      completedMilestones,
      totalMilestones
    }
  }
} 