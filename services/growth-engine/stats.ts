import { supabase } from '@/lib/supabase'
import type { GrowthStats } from '@/types/growth'

// Growth Statistics Service
export const growthStatsService = {
  // Get comprehensive growth statistics
  async getGrowthStats(): Promise<GrowthStats> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    // Get data from multiple tables
    const [goalsData, gravityData, reviewsData] = await Promise.all([
      supabase
        .from('growth_goals')
        .select('progress, status')
        .eq('user_id', session.user.id),
      supabase
        .from('gravity_items')
        .select('status')
        .eq('user_id', session.user.id),
      supabase
        .from('weekly_reviews')
        .select('id')
        .eq('user_id', session.user.id)
    ])

    if (goalsData.error) throw goalsData.error
    if (gravityData.error) throw gravityData.error
    if (reviewsData.error) throw reviewsData.error

    const totalGoals = goalsData.data.length
    const activeGoals = goalsData.data.filter((goal: any) => goal.status === 'active').length
    const completedGoals = goalsData.data.filter((goal: any) => goal.status === 'completed').length
    const averageProgress = goalsData.data.length > 0 
      ? Math.round(goalsData.data.reduce((sum: number, goal: any) => sum + goal.progress, 0) / goalsData.data.length)
      : 0

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