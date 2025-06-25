import { supabase } from '@/lib/supabase'
import type { GrowthGoal, GrowthStats } from '@/types/growth'

// Growth Goals CRUD Operations
export const growthGoalsService = {
  // Create a new growth goal
  async createGrowthGoal(goal: Omit<GrowthGoal, 'id' | 'created_at'>): Promise<GrowthGoal> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('growth_goals')
      .insert({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        target_date: goal.targetDate,
        progress: goal.progress,
        milestones: goal.milestones,
        completed_milestones: goal.completedMilestones,
        priority: goal.priority,
        status: goal.status,
        date_created: goal.dateCreated,
        last_updated: goal.lastUpdated,
        user_id: session.user.id
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      targetDate: data.target_date,
      progress: data.progress,
      milestones: data.milestones || [],
      completedMilestones: data.completed_milestones,
      priority: data.priority,
      status: data.status,
      dateCreated: data.date_created,
      lastUpdated: data.last_updated
    }
  },

  // Get growth goal by ID
  async getGrowthGoalById(id: string): Promise<GrowthGoal | null> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('growth_goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      targetDate: data.target_date,
      progress: data.progress,
      milestones: data.milestones || [],
      completedMilestones: data.completed_milestones,
      priority: data.priority,
      status: data.status,
      dateCreated: data.date_created,
      lastUpdated: data.last_updated
    }
  },

  // Get all growth goals
  async getAllGrowthGoals(): Promise<GrowthGoal[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('growth_goals')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date_created', { ascending: false })

    if (error) throw error

    return data.map((goal: any) => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetDate: goal.target_date,
      progress: goal.progress,
      milestones: goal.milestones || [],
      completedMilestones: goal.completed_milestones,
      priority: goal.priority,
      status: goal.status,
      dateCreated: goal.date_created,
      lastUpdated: goal.last_updated
    }))
  },

  // Update a growth goal
  async updateGrowthGoal(id: string, updates: Partial<Omit<GrowthGoal, 'id' | 'created_at'>>): Promise<GrowthGoal> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('growth_goals')
      .update({
        title: updates.title,
        description: updates.description,
        category: updates.category,
        target_date: updates.targetDate,
        progress: updates.progress,
        milestones: updates.milestones,
        completed_milestones: updates.completedMilestones,
        priority: updates.priority,
        status: updates.status,
        last_updated: updates.lastUpdated
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      targetDate: data.target_date,
      progress: data.progress,
      milestones: data.milestones || [],
      completedMilestones: data.completed_milestones,
      priority: data.priority,
      status: data.status,
      dateCreated: data.date_created,
      lastUpdated: data.last_updated
    }
  },

  // Delete a growth goal
  async deleteGrowthGoal(id: string): Promise<void> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('growth_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error
  },

  // Get growth statistics
  async getGrowthStats(): Promise<GrowthStats> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('growth_goals')
      .select('progress, status')
      .eq('user_id', session.user.id)

    if (error) throw error

    const totalGoals = data.length
    const activeGoals = data.filter((goal: any) => goal.status === 'active').length
    const completedGoals = data.filter((goal: any) => goal.status === 'completed').length
    const averageProgress = data.length > 0 
      ? Math.round(data.reduce((sum: number, goal: any) => sum + goal.progress, 0) / data.length)
      : 0

    // Get additional data for complete stats
    const [gravityData, reviewsData] = await Promise.all([
      supabase
        .from('gravity_items')
        .select('status')
        .eq('user_id', session.user.id),
      supabase
        .from('weekly_reviews')
        .select('id')
        .eq('user_id', session.user.id)
    ])

    if (gravityData.error) throw gravityData.error
    if (reviewsData.error) throw reviewsData.error

    const activeGravityItems = gravityData.data.filter((item: any) => item.status === 'active').length
    const resolvedIssues = gravityData.data.filter((item: any) => item.status === 'resolved').length
    const weeklyReviews = reviewsData.data.length

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      averageProgress,
      activeGravityItems,
      resolvedIssues,
      weeklyReviews
    }
  }
} 