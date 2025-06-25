import { supabase } from '@/lib/supabase'
import type { SALTask, TaskStats } from '@/types/tasks'

// Tasks CRUD Operations
export const tasksService = {
  // Create a new task
  async createTask(task: Omit<SALTask, 'id'>): Promise<SALTask> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: task.title,
        description: task.description,
        book_section: task.bookSection,
        category: task.category,
        status: task.status,
        started_date: task.startedDate,
        completed_date: task.completedDate,
        time_spent: task.timeSpent,
        notes: task.notes,
        evidence_url: task.evidenceUrl,
        related_journal_ids: task.relatedJournalIds,
        related_arena_ids: task.relatedArenaIds,
        estimated_minutes: task.estimatedMinutes,
        is_multi_part: task.isMultiPart,
        sub_tasks: task.subTasks,
        completed_sub_tasks: task.completedSubTasks,
        user_id: session.user.id
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      bookSection: data.book_section,
      category: data.category,
      status: data.status,
      startedDate: data.started_date,
      completedDate: data.completed_date,
      timeSpent: data.time_spent,
      notes: data.notes,
      evidenceUrl: data.evidence_url,
      relatedJournalIds: data.related_journal_ids || [],
      relatedArenaIds: data.related_arena_ids || [],
      estimatedMinutes: data.estimated_minutes,
      isMultiPart: data.is_multi_part,
      subTasks: data.sub_tasks || [],
      completedSubTasks: data.completed_sub_tasks || 0
    }
  },

  // Get task by ID
  async getTaskById(id: number): Promise<SALTask | null> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
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
      bookSection: data.book_section,
      category: data.category,
      status: data.status,
      startedDate: data.started_date,
      completedDate: data.completed_date,
      timeSpent: data.time_spent,
      notes: data.notes,
      evidenceUrl: data.evidence_url,
      relatedJournalIds: data.related_journal_ids || [],
      relatedArenaIds: data.related_arena_ids || [],
      estimatedMinutes: data.estimated_minutes,
      isMultiPart: data.is_multi_part,
      subTasks: data.sub_tasks || [],
      completedSubTasks: data.completed_sub_tasks || 0
    }
  },

  // Get all tasks
  async getAllTasks(): Promise<SALTask[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      bookSection: task.book_section,
      category: task.category,
      status: task.status,
      startedDate: task.started_date,
      completedDate: task.completed_date,
      timeSpent: task.time_spent,
      notes: task.notes,
      evidenceUrl: task.evidence_url,
      relatedJournalIds: task.related_journal_ids || [],
      relatedArenaIds: task.related_arena_ids || [],
      estimatedMinutes: task.estimated_minutes,
      isMultiPart: task.is_multi_part,
      subTasks: task.sub_tasks || [],
      completedSubTasks: task.completed_sub_tasks || 0
    }))
  },

  // Get tasks by status
  async getTasksByStatus(status: string): Promise<SALTask[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', status)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      bookSection: task.book_section,
      category: task.category,
      status: task.status,
      startedDate: task.started_date,
      completedDate: task.completed_date,
      timeSpent: task.time_spent,
      notes: task.notes,
      evidenceUrl: task.evidence_url,
      relatedJournalIds: task.related_journal_ids || [],
      relatedArenaIds: task.related_arena_ids || [],
      estimatedMinutes: task.estimated_minutes,
      isMultiPart: task.is_multi_part,
      subTasks: task.sub_tasks || [],
      completedSubTasks: task.completed_sub_tasks || 0
    }))
  },

  // Get tasks by category
  async getTasksByCategory(category: string): Promise<SALTask[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('category', category)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      bookSection: task.book_section,
      category: task.category,
      status: task.status,
      startedDate: task.started_date,
      completedDate: task.completed_date,
      timeSpent: task.time_spent,
      notes: task.notes,
      evidenceUrl: task.evidence_url,
      relatedJournalIds: task.related_journal_ids || [],
      relatedArenaIds: task.related_arena_ids || [],
      estimatedMinutes: task.estimated_minutes,
      isMultiPart: task.is_multi_part,
      subTasks: task.sub_tasks || [],
      completedSubTasks: task.completed_sub_tasks || 0
    }))
  },

  // Get completed tasks
  async getCompletedTasks(): Promise<SALTask[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'completed')
      .eq('user_id', session.user.id)
      .order('completed_date', { ascending: false })

    if (error) throw error

    return data.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      bookSection: task.book_section,
      category: task.category,
      status: task.status,
      startedDate: task.started_date,
      completedDate: task.completed_date,
      timeSpent: task.time_spent,
      notes: task.notes,
      evidenceUrl: task.evidence_url,
      relatedJournalIds: task.related_journal_ids || [],
      relatedArenaIds: task.related_arena_ids || [],
      estimatedMinutes: task.estimated_minutes,
      isMultiPart: task.is_multi_part,
      subTasks: task.sub_tasks || [],
      completedSubTasks: task.completed_sub_tasks || 0
    }))
  },

  // Get in-progress tasks
  async getInProgressTasks(): Promise<SALTask[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'in-progress')
      .eq('user_id', session.user.id)
      .order('started_date', { ascending: false })

    if (error) throw error

    return data.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      bookSection: task.book_section,
      category: task.category,
      status: task.status,
      startedDate: task.started_date,
      completedDate: task.completed_date,
      timeSpent: task.time_spent,
      notes: task.notes,
      evidenceUrl: task.evidence_url,
      relatedJournalIds: task.related_journal_ids || [],
      relatedArenaIds: task.related_arena_ids || [],
      estimatedMinutes: task.estimated_minutes,
      isMultiPart: task.is_multi_part,
      subTasks: task.sub_tasks || [],
      completedSubTasks: task.completed_sub_tasks || 0
    }))
  },

  // Update a task
  async updateTask(id: number, updates: Partial<Omit<SALTask, 'id'>>): Promise<SALTask> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updates.title,
        description: updates.description,
        book_section: updates.bookSection,
        category: updates.category,
        status: updates.status,
        started_date: updates.startedDate,
        completed_date: updates.completedDate,
        time_spent: updates.timeSpent,
        notes: updates.notes,
        evidence_url: updates.evidenceUrl,
        related_journal_ids: updates.relatedJournalIds,
        related_arena_ids: updates.relatedArenaIds,
        estimated_minutes: updates.estimatedMinutes,
        is_multi_part: updates.isMultiPart,
        sub_tasks: updates.subTasks,
        completed_sub_tasks: updates.completedSubTasks
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
      bookSection: data.book_section,
      category: data.category,
      status: data.status,
      startedDate: data.started_date,
      completedDate: data.completed_date,
      timeSpent: data.time_spent,
      notes: data.notes,
      evidenceUrl: data.evidence_url,
      relatedJournalIds: data.related_journal_ids || [],
      relatedArenaIds: data.related_arena_ids || [],
      estimatedMinutes: data.estimated_minutes,
      isMultiPart: data.is_multi_part,
      subTasks: data.sub_tasks || [],
      completedSubTasks: data.completed_sub_tasks || 0
    }
  },

  // Delete a task
  async deleteTask(id: number): Promise<void> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error
  },

  // Mark task as completed
  async markTaskAsCompleted(id: number, timeSpent?: number): Promise<SALTask> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const updates: any = {
      status: 'completed',
      completed_date: new Date().toISOString()
    }

    if (timeSpent !== undefined) {
      updates.time_spent = timeSpent
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      bookSection: data.book_section,
      category: data.category,
      status: data.status,
      startedDate: data.started_date,
      completedDate: data.completed_date,
      timeSpent: data.time_spent,
      notes: data.notes,
      evidenceUrl: data.evidence_url,
      relatedJournalIds: data.related_journal_ids || [],
      relatedArenaIds: data.related_arena_ids || [],
      estimatedMinutes: data.estimated_minutes,
      isMultiPart: data.is_multi_part,
      subTasks: data.sub_tasks || [],
      completedSubTasks: data.completed_sub_tasks || 0
    }
  },

  // Search tasks
  async searchTasks(query: string): Promise<SALTask[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,notes.ilike.%${query}%`)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      bookSection: task.book_section,
      category: task.category,
      status: task.status,
      startedDate: task.started_date,
      completedDate: task.completed_date,
      timeSpent: task.time_spent,
      notes: task.notes,
      evidenceUrl: task.evidence_url,
      relatedJournalIds: task.related_journal_ids || [],
      relatedArenaIds: task.related_arena_ids || [],
      estimatedMinutes: task.estimated_minutes,
      isMultiPart: task.is_multi_part,
      subTasks: task.sub_tasks || [],
      completedSubTasks: task.completed_sub_tasks || 0
    }))
  },

  // Get tasks by book section
  async getTasksByBookSection(bookSection: string): Promise<SALTask[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('book_section', bookSection)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      bookSection: task.book_section,
      category: task.category,
      status: task.status,
      startedDate: task.started_date,
      completedDate: task.completed_date,
      timeSpent: task.time_spent,
      notes: task.notes,
      evidenceUrl: task.evidence_url,
      relatedJournalIds: task.related_journal_ids || [],
      relatedArenaIds: task.related_arena_ids || [],
      estimatedMinutes: task.estimated_minutes,
      isMultiPart: task.is_multi_part,
      subTasks: task.sub_tasks || [],
      completedSubTasks: task.completed_sub_tasks || 0
    }))
  },

  // Get task statistics
  async getTaskStats(): Promise<TaskStats> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('status, time_spent')
      .eq('user_id', session.user.id)

    if (error) throw error

    const completedTasks = data.filter((task: any) => task.status === 'completed').length
    const inProgressTasks = data.filter((task: any) => task.status === 'in-progress').length
    const totalTimeSpent = data.reduce((sum: number, task: any) => sum + (task.time_spent || 0), 0)
    const progressPercentage = data.length > 0 ? Math.round((completedTasks / data.length) * 100) : 0

    return {
      completedTasks,
      inProgressTasks,
      totalTimeSpent,
      progressPercentage
    }
  }
} 