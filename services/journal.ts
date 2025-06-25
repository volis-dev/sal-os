import { supabase } from '@/lib/supabase'
import type { JournalEntry, JournalStats } from '@/types/journal'

// Journal CRUD Operations
export const journalService = {
  // Create a new journal entry
  async createJournalEntry(entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> {
    // Ensure we have an authenticated session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        title: entry.title,
        content: entry.content,
        type: entry.type,
        date: entry.date,
        book_reference: entry.bookReference,
        chapter_reference: entry.chapterReference,
        word_count: entry.wordCount,
        tags: entry.tags,
        user_id: session.user.id // Ensure user_id is set
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      type: data.type,
      date: data.date,
      bookReference: data.book_reference,
      chapterReference: data.chapter_reference,
      wordCount: data.word_count,
      tags: data.tags || []
    }
  },

  // Get all journal entries for the authenticated user
  async getAllJournalEntries(): Promise<JournalEntry[]> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(entry => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      type: entry.type,
      date: entry.date,
      bookReference: entry.book_reference,
      chapterReference: entry.chapter_reference,
      wordCount: entry.word_count,
      tags: entry.tags || []
    }))
  },

  // Get journal entry by ID
  async getJournalEntryById(id: string): Promise<JournalEntry | null> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      type: data.type,
      date: data.date,
      bookReference: data.book_reference,
      chapterReference: data.chapter_reference,
      wordCount: data.word_count,
      tags: data.tags || []
    }
  },

  // Get journal entries by type
  async getJournalEntriesByType(type: string): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('type', type)
      .order('date', { ascending: false })

    if (error) throw error

    return data.map((entry: any) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      type: entry.type,
      date: entry.date,
      bookReference: entry.book_reference,
      chapterReference: entry.chapter_reference,
      wordCount: entry.word_count,
      tags: entry.tags || []
    }))
  },

  // Get journal entries by date range
  async getJournalEntriesByDateRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) throw error

    return data.map((entry: any) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      type: entry.type,
      date: entry.date,
      bookReference: entry.book_reference,
      chapterReference: entry.chapter_reference,
      wordCount: entry.word_count,
      tags: entry.tags || []
    }))
  },

  // Get journal entries by tags
  async getJournalEntriesByTags(tags: string[]): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .overlaps('tags', tags)
      .order('date', { ascending: false })

    if (error) throw error

    return data.map((entry: any) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      type: entry.type,
      date: entry.date,
      bookReference: entry.book_reference,
      chapterReference: entry.chapter_reference,
      wordCount: entry.word_count,
      tags: entry.tags || []
    }))
  },

  // Update a journal entry
  async updateJournalEntry(id: string, updates: Partial<Omit<JournalEntry, 'id'>>): Promise<JournalEntry> {
    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        title: updates.title,
        content: updates.content,
        type: updates.type,
        date: updates.date,
        book_reference: updates.bookReference,
        chapter_reference: updates.chapterReference,
        word_count: updates.wordCount,
        tags: updates.tags
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      type: data.type,
      date: data.date,
      bookReference: data.book_reference,
      chapterReference: data.chapter_reference,
      wordCount: data.word_count,
      tags: data.tags || []
    }
  },

  // Delete a journal entry
  async deleteJournalEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Get journal statistics
  async getJournalStats(): Promise<JournalStats> {
    const { data: entries, error } = await supabase
      .from('journal_entries')
      .select('word_count, type, date')

    if (error) throw error

    const totalEntries = entries.length
    const totalWords = entries.reduce((sum: number, entry: any) => sum + (entry.word_count || 0), 0)
    const totalPages = Math.ceil(totalWords / 250) // Assuming 250 words per page
    const progressPercentage = totalEntries > 0 ? Math.round((totalEntries / 100) * 100) : 0 // Assuming 100 entries target

    return {
      totalPages,
      totalWords,
      totalEntries,
      progressPercentage
    }
  },

  // Search journal entries
  async searchJournalEntries(query: string): Promise<JournalEntry[]> {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('date', { ascending: false })

    if (error) throw error

    return data.map((entry: any) => ({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      type: entry.type,
      date: entry.date,
      bookReference: entry.book_reference,
      chapterReference: entry.chapter_reference,
      wordCount: entry.word_count,
      tags: entry.tags || []
    }))
  }
} 