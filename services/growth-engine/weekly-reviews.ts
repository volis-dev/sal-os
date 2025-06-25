import { supabase } from '@/lib/supabase'
import type { WeeklyReview } from '@/types/growth'

// Weekly Reviews CRUD Operations
export const weeklyReviewsService = {
  // Create a new weekly review
  async createWeeklyReview(review: Omit<WeeklyReview, 'id'>): Promise<WeeklyReview> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('weekly_reviews')
      .insert({
        week_of: review.weekOf,
        overall_rating: review.overallRating,
        wins: review.wins,
        challenges: review.challenges,
        lessons: review.lessons,
        next_week_focus: review.nextWeekFocus,
        gravity_progress: review.gravityProgress,
        arena_progress: review.arenaProgress,
        date_created: review.dateCreated,
        user_id: session.user.id
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      weekOf: data.week_of,
      overallRating: data.overall_rating,
      wins: data.wins || [],
      challenges: data.challenges || [],
      lessons: data.lessons || [],
      nextWeekFocus: data.next_week_focus || [],
      gravityProgress: data.gravity_progress || {},
      arenaProgress: data.arena_progress || {},
      dateCreated: data.date_created
    }
  },

  // Get weekly review by ID
  async getWeeklyReviewById(id: string): Promise<WeeklyReview | null> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('weekly_reviews')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      weekOf: data.week_of,
      overallRating: data.overall_rating,
      wins: data.wins || [],
      challenges: data.challenges || [],
      lessons: data.lessons || [],
      nextWeekFocus: data.next_week_focus || [],
      gravityProgress: data.gravity_progress || {},
      arenaProgress: data.arena_progress || {},
      dateCreated: data.date_created
    }
  },

  // Get all weekly reviews
  async getAllWeeklyReviews(): Promise<WeeklyReview[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('weekly_reviews')
      .select('*')
      .eq('user_id', session.user.id)
      .order('week_of', { ascending: false })

    if (error) throw error

    return data.map((review: any) => ({
      id: review.id,
      weekOf: review.week_of,
      overallRating: review.overall_rating,
      wins: review.wins || [],
      challenges: review.challenges || [],
      lessons: review.lessons || [],
      nextWeekFocus: review.next_week_focus || [],
      gravityProgress: review.gravity_progress || {},
      arenaProgress: review.arena_progress || {},
      dateCreated: review.date_created
    }))
  },

  // Get weekly review by week
  async getWeeklyReviewByWeek(weekOf: string): Promise<WeeklyReview | null> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('weekly_reviews')
      .select('*')
      .eq('week_of', weekOf)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      weekOf: data.week_of,
      overallRating: data.overall_rating,
      wins: data.wins || [],
      challenges: data.challenges || [],
      lessons: data.lessons || [],
      nextWeekFocus: data.next_week_focus || [],
      gravityProgress: data.gravity_progress || {},
      arenaProgress: data.arena_progress || {},
      dateCreated: data.date_created
    }
  },

  // Update a weekly review
  async updateWeeklyReview(id: string, updates: Partial<Omit<WeeklyReview, 'id'>>): Promise<WeeklyReview> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('weekly_reviews')
      .update({
        week_of: updates.weekOf,
        overall_rating: updates.overallRating,
        wins: updates.wins,
        challenges: updates.challenges,
        lessons: updates.lessons,
        next_week_focus: updates.nextWeekFocus,
        gravity_progress: updates.gravityProgress,
        arena_progress: updates.arenaProgress,
        date_created: updates.dateCreated
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      weekOf: data.week_of,
      overallRating: data.overall_rating,
      wins: data.wins || [],
      challenges: data.challenges || [],
      lessons: data.lessons || [],
      nextWeekFocus: data.next_week_focus || [],
      gravityProgress: data.gravity_progress || {},
      arenaProgress: data.arena_progress || {},
      dateCreated: data.date_created
    }
  },

  // Delete a weekly review
  async deleteWeeklyReview(id: string): Promise<void> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('weekly_reviews')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error
  },

  // Get weekly review statistics
  async getWeeklyReviewStats(): Promise<{ totalReviews: number; averageRating: number; lastReviewDate: string | null }> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('weekly_reviews')
      .select('overall_rating, date_created')
      .eq('user_id', session.user.id)
      .order('date_created', { ascending: false })

    if (error) throw error

    const totalReviews = data.length
    const averageRating = data.length > 0 
      ? Math.round(data.reduce((sum: number, review: any) => sum + review.overall_rating, 0) / data.length)
      : 0
    const lastReviewDate = data.length > 0 ? data[0].date_created : null

    return {
      totalReviews,
      averageRating,
      lastReviewDate
    }
  }
} 