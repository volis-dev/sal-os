import { supabase } from '@/lib/supabase'
import type { GravityItem, NewGravityItem } from '@/types/growth'

// Gravity Items CRUD Operations
export const gravityItemsService = {
  // Create a new gravity item
  async createGravityItem(item: NewGravityItem): Promise<GravityItem> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('gravity_items')
      .insert({
        category_id: item.categoryId,
        name: item.name,
        description: item.description,
        severity: item.severity,
        impact: item.impact,
        action_plan: item.actionPlan,
        date_identified: new Date().toISOString(),
        status: 'active',
        last_reviewed: new Date().toISOString(),
        user_id: session.user.id
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      severity: data.severity,
      impact: data.impact,
      actionPlan: data.action_plan,
      dateIdentified: data.date_identified,
      status: data.status,
      lastReviewed: data.last_reviewed
    }
  },

  // Get gravity item by ID
  async getGravityItemById(id: string): Promise<GravityItem | null> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('gravity_items')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      severity: data.severity,
      impact: data.impact,
      actionPlan: data.action_plan,
      dateIdentified: data.date_identified,
      status: data.status,
      lastReviewed: data.last_reviewed
    }
  },

  // Get all gravity items
  async getAllGravityItems(): Promise<GravityItem[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('gravity_items')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date_identified', { ascending: false })

    if (error) throw error

    return data.map((item: any) => ({
      id: item.id,
      categoryId: item.category_id,
      name: item.name,
      description: item.description,
      severity: item.severity,
      impact: item.impact,
      actionPlan: item.action_plan,
      dateIdentified: item.date_identified,
      status: item.status,
      lastReviewed: item.last_reviewed
    }))
  },

  // Get gravity items by category
  async getGravityItemsByCategory(categoryId: string): Promise<GravityItem[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('gravity_items')
      .select('*')
      .eq('category_id', categoryId)
      .eq('user_id', session.user.id)
      .order('date_identified', { ascending: false })

    if (error) throw error

    return data.map((item: any) => ({
      id: item.id,
      categoryId: item.category_id,
      name: item.name,
      description: item.description,
      severity: item.severity,
      impact: item.impact,
      actionPlan: item.action_plan,
      dateIdentified: item.date_identified,
      status: item.status,
      lastReviewed: item.last_reviewed
    }))
  },

  // Get gravity items by status
  async getGravityItemsByStatus(status: 'active' | 'improving' | 'resolved'): Promise<GravityItem[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('gravity_items')
      .select('*')
      .eq('status', status)
      .eq('user_id', session.user.id)
      .order('date_identified', { ascending: false })

    if (error) throw error

    return data.map((item: any) => ({
      id: item.id,
      categoryId: item.category_id,
      name: item.name,
      description: item.description,
      severity: item.severity,
      impact: item.impact,
      actionPlan: item.action_plan,
      dateIdentified: item.date_identified,
      status: item.status,
      lastReviewed: item.last_reviewed
    }))
  },

  // Update a gravity item
  async updateGravityItem(id: string, updates: Partial<Omit<GravityItem, 'id' | 'categoryId' | 'dateIdentified'>>): Promise<GravityItem> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('gravity_items')
      .update({
        name: updates.name,
        description: updates.description,
        severity: updates.severity,
        impact: updates.impact,
        action_plan: updates.actionPlan,
        status: updates.status,
        last_reviewed: updates.lastReviewed
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      categoryId: data.category_id,
      name: data.name,
      description: data.description,
      severity: data.severity,
      impact: data.impact,
      actionPlan: data.action_plan,
      dateIdentified: data.date_identified,
      status: data.status,
      lastReviewed: data.last_reviewed
    }
  },

  // Delete a gravity item
  async deleteGravityItem(id: string): Promise<void> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('gravity_items')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error
  },

  // Get gravity statistics
  async getGravityStats(): Promise<{ activeItems: number; resolvedItems: number; improvingItems: number; totalItems: number }> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('gravity_items')
      .select('status')
      .eq('user_id', session.user.id)

    if (error) throw error

    const activeItems = data.filter((item: any) => item.status === 'active').length
    const resolvedItems = data.filter((item: any) => item.status === 'resolved').length
    const improvingItems = data.filter((item: any) => item.status === 'improving').length
    const totalItems = data.length

    return {
      activeItems,
      resolvedItems,
      improvingItems,
      totalItems
    }
  }
} 