import { supabase } from '@/lib/supabase'
import type { VocabularyWord, VocabularyStats } from '@/types/vocabulary'

// Vocabulary CRUD Operations
export const vocabularyService = {
  // Create a new vocabulary word
  async createVocabularyWord(word: Omit<VocabularyWord, 'id'>): Promise<VocabularyWord> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .insert({
        word: word.word,
        part_of_speech: word.partOfSpeech,
        definition: word.definition,
        etymology: word.etymology,
        pronunciation: word.pronunciation,
        example_sentences: word.exampleSentences,
        synonyms: word.synonyms,
        antonyms: word.antonyms,
        source: word.source,
        book_reference: word.bookReference,
        date_added: word.dateAdded,
        last_reviewed: word.lastReviewed,
        review_count: word.reviewCount,
        mastery_level: word.masteryLevel,
        tags: word.tags,
        personal_notes: word.personalNotes,
        next_review_date: word.nextReviewDate,
        difficulty_rating: word.difficultyRating,
        user_id: session.user.id
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      word: data.word,
      partOfSpeech: data.part_of_speech,
      definition: data.definition,
      etymology: data.etymology,
      pronunciation: data.pronunciation,
      exampleSentences: data.example_sentences || [],
      synonyms: data.synonyms || [],
      antonyms: data.antonyms || [],
      source: data.source,
      bookReference: data.book_reference,
      dateAdded: data.date_added,
      lastReviewed: data.last_reviewed,
      reviewCount: data.review_count,
      masteryLevel: data.mastery_level,
      tags: data.tags || [],
      personalNotes: data.personal_notes,
      nextReviewDate: data.next_review_date,
      difficultyRating: data.difficulty_rating
    }
  },

  // Get vocabulary word by ID
  async getVocabularyWordById(id: string): Promise<VocabularyWord | null> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      word: data.word,
      partOfSpeech: data.part_of_speech,
      definition: data.definition,
      etymology: data.etymology,
      pronunciation: data.pronunciation,
      exampleSentences: data.example_sentences || [],
      synonyms: data.synonyms || [],
      antonyms: data.antonyms || [],
      source: data.source,
      bookReference: data.book_reference,
      dateAdded: data.date_added,
      lastReviewed: data.last_reviewed,
      reviewCount: data.review_count,
      masteryLevel: data.mastery_level,
      tags: data.tags || [],
      personalNotes: data.personal_notes,
      nextReviewDate: data.next_review_date,
      difficultyRating: data.difficulty_rating
    }
  },

  // Get all vocabulary words
  async getAllVocabularyWords(): Promise<VocabularyWord[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('*')
      .eq('user_id', session.user.id)
      .order('word', { ascending: true })

    if (error) throw error

    return data.map((word: any) => ({
      id: word.id,
      word: word.word,
      partOfSpeech: word.part_of_speech,
      definition: word.definition,
      etymology: word.etymology,
      pronunciation: word.pronunciation,
      exampleSentences: word.example_sentences || [],
      synonyms: word.synonyms || [],
      antonyms: word.antonyms || [],
      source: word.source,
      bookReference: word.book_reference,
      dateAdded: word.date_added,
      lastReviewed: word.last_reviewed,
      reviewCount: word.review_count,
      masteryLevel: word.mastery_level,
      tags: word.tags || [],
      personalNotes: word.personal_notes,
      nextReviewDate: word.next_review_date,
      difficultyRating: word.difficulty_rating
    }))
  },

  // Get vocabulary words by mastery level
  async getVocabularyWordsByMasteryLevel(masteryLevel: string): Promise<VocabularyWord[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('*')
      .eq('mastery_level', masteryLevel)
      .eq('user_id', session.user.id)
      .order('word', { ascending: true })

    if (error) throw error

    return data.map((word: any) => ({
      id: word.id,
      word: word.word,
      partOfSpeech: word.part_of_speech,
      definition: word.definition,
      etymology: word.etymology,
      pronunciation: word.pronunciation,
      exampleSentences: word.example_sentences || [],
      synonyms: word.synonyms || [],
      antonyms: word.antonyms || [],
      source: word.source,
      bookReference: word.book_reference,
      dateAdded: word.date_added,
      lastReviewed: word.last_reviewed,
      reviewCount: word.review_count,
      masteryLevel: word.mastery_level,
      tags: word.tags || [],
      personalNotes: word.personal_notes,
      nextReviewDate: word.next_review_date,
      difficultyRating: word.difficulty_rating
    }))
  },

  // Get mastered vocabulary words
  async getMasteredVocabularyWords(): Promise<VocabularyWord[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('*')
      .eq('mastery_level', 'mastered')
      .eq('user_id', session.user.id)
      .order('word', { ascending: true })

    if (error) throw error

    return data.map((word: any) => ({
      id: word.id,
      word: word.word,
      partOfSpeech: word.part_of_speech,
      definition: word.definition,
      etymology: word.etymology,
      pronunciation: word.pronunciation,
      exampleSentences: word.example_sentences || [],
      synonyms: word.synonyms || [],
      antonyms: word.antonyms || [],
      source: word.source,
      bookReference: word.book_reference,
      dateAdded: word.date_added,
      lastReviewed: word.last_reviewed,
      reviewCount: word.review_count,
      masteryLevel: word.mastery_level,
      tags: word.tags || [],
      personalNotes: word.personal_notes,
      nextReviewDate: word.next_review_date,
      difficultyRating: word.difficulty_rating
    }))
  },

  // Get vocabulary words needing review
  async getVocabularyWordsNeedingReview(): Promise<VocabularyWord[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('*')
      .neq('mastery_level', 'mastered')
      .eq('user_id', session.user.id)
      .order('next_review_date', { ascending: true })

    if (error) throw error

    return data.map((word: any) => ({
      id: word.id,
      word: word.word,
      partOfSpeech: word.part_of_speech,
      definition: word.definition,
      etymology: word.etymology,
      pronunciation: word.pronunciation,
      exampleSentences: word.example_sentences || [],
      synonyms: word.synonyms || [],
      antonyms: word.antonyms || [],
      source: word.source,
      bookReference: word.book_reference,
      dateAdded: word.date_added,
      lastReviewed: word.last_reviewed,
      reviewCount: word.review_count,
      masteryLevel: word.mastery_level,
      tags: word.tags || [],
      personalNotes: word.personal_notes,
      nextReviewDate: word.next_review_date,
      difficultyRating: word.difficulty_rating
    }))
  },

  // Get vocabulary words due for review today
  async getVocabularyWordsDueToday(): Promise<VocabularyWord[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('*')
      .lte('next_review_date', today)
      .eq('user_id', session.user.id)
      .order('next_review_date', { ascending: true })

    if (error) throw error

    return data.map((word: any) => ({
      id: word.id,
      word: word.word,
      partOfSpeech: word.part_of_speech,
      definition: word.definition,
      etymology: word.etymology,
      pronunciation: word.pronunciation,
      exampleSentences: word.example_sentences || [],
      synonyms: word.synonyms || [],
      antonyms: word.antonyms || [],
      source: word.source,
      bookReference: word.book_reference,
      dateAdded: word.date_added,
      lastReviewed: word.last_reviewed,
      reviewCount: word.review_count,
      masteryLevel: word.mastery_level,
      tags: word.tags || [],
      personalNotes: word.personal_notes,
      nextReviewDate: word.next_review_date,
      difficultyRating: word.difficulty_rating
    }))
  },

  // Update a vocabulary word
  async updateVocabularyWord(id: string, updates: Partial<Omit<VocabularyWord, 'id'>>): Promise<VocabularyWord> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .update({
        word: updates.word,
        part_of_speech: updates.partOfSpeech,
        definition: updates.definition,
        etymology: updates.etymology,
        pronunciation: updates.pronunciation,
        example_sentences: updates.exampleSentences,
        synonyms: updates.synonyms,
        antonyms: updates.antonyms,
        source: updates.source,
        book_reference: updates.bookReference,
        date_added: updates.dateAdded,
        last_reviewed: updates.lastReviewed,
        review_count: updates.reviewCount,
        mastery_level: updates.masteryLevel,
        tags: updates.tags,
        personal_notes: updates.personalNotes,
        next_review_date: updates.nextReviewDate,
        difficulty_rating: updates.difficultyRating
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      word: data.word,
      partOfSpeech: data.part_of_speech,
      definition: data.definition,
      etymology: data.etymology,
      pronunciation: data.pronunciation,
      exampleSentences: data.example_sentences || [],
      synonyms: data.synonyms || [],
      antonyms: data.antonyms || [],
      source: data.source,
      bookReference: data.book_reference,
      dateAdded: data.date_added,
      lastReviewed: data.last_reviewed,
      reviewCount: data.review_count,
      masteryLevel: data.mastery_level,
      tags: data.tags || [],
      personalNotes: data.personal_notes,
      nextReviewDate: data.next_review_date,
      difficultyRating: data.difficulty_rating
    }
  },

  // Delete a vocabulary word
  async deleteVocabularyWord(id: string): Promise<void> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('vocabulary_words')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error
  },

  // Mark word as reviewed
  async markWordAsReviewed(id: string): Promise<VocabularyWord> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const today = new Date().toISOString().split('T')[0]
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + 7) // Review in 7 days

    // First get current review count
    const { data: currentData, error: currentError } = await supabase
      .from('vocabulary_words')
      .select('review_count')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (currentError) throw currentError

    const { data, error } = await supabase
      .from('vocabulary_words')
      .update({
        last_reviewed: today,
        review_count: (currentData.review_count || 0) + 1,
        next_review_date: nextReviewDate.toISOString().split('T')[0]
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      word: data.word,
      partOfSpeech: data.part_of_speech,
      definition: data.definition,
      etymology: data.etymology,
      pronunciation: data.pronunciation,
      exampleSentences: data.example_sentences || [],
      synonyms: data.synonyms || [],
      antonyms: data.antonyms || [],
      source: data.source,
      bookReference: data.book_reference,
      dateAdded: data.date_added,
      lastReviewed: data.last_reviewed,
      reviewCount: data.review_count,
      masteryLevel: data.mastery_level,
      tags: data.tags || [],
      personalNotes: data.personal_notes,
      nextReviewDate: data.next_review_date,
      difficultyRating: data.difficulty_rating
    }
  },

  // Mark word as mastered
  async markWordAsMastered(id: string): Promise<VocabularyWord> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const today = new Date().toISOString().split('T')[0]

    // First get current review count
    const { data: currentData, error: currentError } = await supabase
      .from('vocabulary_words')
      .select('review_count')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (currentError) throw currentError

    const { data, error } = await supabase
      .from('vocabulary_words')
      .update({
        mastery_level: 'mastered',
        last_reviewed: today,
        review_count: (currentData.review_count || 0) + 1
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      word: data.word,
      partOfSpeech: data.part_of_speech,
      definition: data.definition,
      etymology: data.etymology,
      pronunciation: data.pronunciation,
      exampleSentences: data.example_sentences || [],
      synonyms: data.synonyms || [],
      antonyms: data.antonyms || [],
      source: data.source,
      bookReference: data.book_reference,
      dateAdded: data.date_added,
      lastReviewed: data.last_reviewed,
      reviewCount: data.review_count,
      masteryLevel: data.mastery_level,
      tags: data.tags || [],
      personalNotes: data.personal_notes,
      nextReviewDate: data.next_review_date,
      difficultyRating: data.difficulty_rating
    }
  },

  // Search vocabulary words
  async searchVocabularyWords(query: string): Promise<VocabularyWord[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('*')
      .or(`word.ilike.%${query}%,definition.ilike.%${query}%,etymology.ilike.%${query}%`)
      .eq('user_id', session.user.id)
      .order('word', { ascending: true })

    if (error) throw error

    return data.map((word: any) => ({
      id: word.id,
      word: word.word,
      partOfSpeech: word.part_of_speech,
      definition: word.definition,
      etymology: word.etymology,
      pronunciation: word.pronunciation,
      exampleSentences: word.example_sentences || [],
      synonyms: word.synonyms || [],
      antonyms: word.antonyms || [],
      source: word.source,
      bookReference: word.book_reference,
      dateAdded: word.date_added,
      lastReviewed: word.last_reviewed,
      reviewCount: word.review_count,
      masteryLevel: word.mastery_level,
      tags: word.tags || [],
      personalNotes: word.personal_notes,
      nextReviewDate: word.next_review_date,
      difficultyRating: word.difficulty_rating
    }))
  },

  // Get vocabulary statistics
  async getVocabularyStats(): Promise<VocabularyStats> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('vocabulary_words')
      .select('mastery_level, review_count')
      .eq('user_id', session.user.id)

    if (error) throw error

    const totalWords = data.length
    const masteredWords = data.filter((word: any) => word.mastery_level === 'mastered').length
    const learningWords = data.filter((word: any) => word.mastery_level === 'learning').length
    const familiarWords = data.filter((word: any) => word.mastery_level === 'familiar').length
    const newWords = data.filter((word: any) => word.mastery_level === 'new').length
    const totalReviews = data.reduce((sum: number, word: any) => sum + word.review_count, 0)
    const masteryPercentage = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0

    return {
      totalWords,
      masteredWords,
      learningWords,
      familiarWords,
      newWords,
      totalReviews,
      masteryPercentage,
      studyStreak: 0,
      wordsThisWeek: 0,
      wordsToReview: 0
    }
  }
} 