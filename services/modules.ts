import { supabase } from '@/lib/supabase'
import type { Book, Chapter, ReadingProgress, ModulesStats } from '@/types/modules'

// Books CRUD Operations
export const booksService = {
  // Create a new book
  async createBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at'>): Promise<Book> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('books')
      .insert({
        title: book.title,
        subtitle: book.subtitle,
        total_chapters: book.totalChapters,
        completed_chapters: book.completedChapters,
        current_chapter: book.currentChapter,
        last_read: book.lastRead,
        total_pages: book.totalPages,
        pages_read: book.pagesRead,
        color: book.color,
        description: book.description,
        estimated_hours: book.estimatedHours,
        user_id: session.user.id
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      totalChapters: data.total_chapters,
      completedChapters: data.completed_chapters,
      currentChapter: data.current_chapter,
      lastRead: data.last_read,
      totalPages: data.total_pages,
      pagesRead: data.pages_read,
      color: data.color,
      description: data.description,
      estimatedHours: data.estimated_hours
    }
  },

  // Get book by ID
  async getBookById(id: string): Promise<Book | null> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      totalChapters: data.total_chapters,
      completedChapters: data.completed_chapters,
      currentChapter: data.current_chapter,
      lastRead: data.last_read,
      totalPages: data.total_pages,
      pagesRead: data.pages_read,
      color: data.color,
      description: data.description,
      estimatedHours: data.estimated_hours
    }
  },

  // Get all books
  async getAllBooks(): Promise<Book[]> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', session.user.id)
      .order('title', { ascending: true })

    if (error) throw error

    return data.map((book: any) => ({
      id: book.id,
      title: book.title,
      subtitle: book.subtitle,
      totalChapters: book.total_chapters,
      completedChapters: book.completed_chapters,
      currentChapter: book.current_chapter,
      lastRead: book.last_read,
      totalPages: book.total_pages,
      pagesRead: book.pages_read,
      color: book.color,
      description: book.description,
      estimatedHours: book.estimated_hours
    }))
  },

  // Update a book
  async updateBook(id: string, updates: Partial<Omit<Book, 'id' | 'created_at' | 'updated_at'>>): Promise<Book> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('books')
      .update({
        title: updates.title,
        subtitle: updates.subtitle,
        total_chapters: updates.totalChapters,
        completed_chapters: updates.completedChapters,
        current_chapter: updates.currentChapter,
        last_read: updates.lastRead,
        total_pages: updates.totalPages,
        pages_read: updates.pagesRead,
        color: updates.color,
        description: updates.description,
        estimated_hours: updates.estimatedHours
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      totalChapters: data.total_chapters,
      completedChapters: data.completed_chapters,
      currentChapter: data.current_chapter,
      lastRead: data.last_read,
      totalPages: data.total_pages,
      pagesRead: data.pages_read,
      color: data.color,
      description: data.description,
      estimatedHours: data.estimated_hours
    }
  },

  // Delete a book
  async deleteBook(id: string): Promise<void> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error
  },

  // Mark chapter as completed
  async markChapterCompleted(bookId: string, chapterNumber: number): Promise<Book> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    // First get current book state
    const { data: currentBook, error: bookError } = await supabase
      .from('books')
      .select('*')
      .eq('id', bookId)
      .eq('user_id', session.user.id)
      .single()

    if (bookError) throw bookError

    const newCompletedChapters = currentBook.completed_chapters + 1
    const newCurrentChapter = Math.min(chapterNumber + 1, currentBook.total_chapters)

    const { data, error } = await supabase
      .from('books')
      .update({
        completed_chapters: newCompletedChapters,
        current_chapter: newCurrentChapter,
        last_read: new Date().toISOString()
      })
      .eq('id', bookId)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      totalChapters: data.total_chapters,
      completedChapters: data.completed_chapters,
      currentChapter: data.current_chapter,
      lastRead: data.last_read,
      totalPages: data.total_pages,
      pagesRead: data.pages_read,
      color: data.color,
      description: data.description,
      estimatedHours: data.estimated_hours
    }
  },

  // Update reading progress
  async updateReadingProgress(bookId: string, pagesRead: number): Promise<Book> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('books')
      .update({
        pages_read: pagesRead,
        last_read: new Date().toISOString()
      })
      .eq('id', bookId)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      totalChapters: data.total_chapters,
      completedChapters: data.completed_chapters,
      currentChapter: data.current_chapter,
      lastRead: data.last_read,
      totalPages: data.total_pages,
      pagesRead: data.pages_read,
      color: data.color,
      description: data.description,
      estimatedHours: data.estimated_hours
    }
  },

  // Get reading statistics
  async getReadingStats(): Promise<ModulesStats> {
    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Authentication required')
    }

    const { data, error } = await supabase
      .from('books')
      .select('total_pages, pages_read, total_chapters, completed_chapters, estimated_hours')
      .eq('user_id', session.user.id)

    if (error) throw error

    const totalPages = data.reduce((sum: number, book: any) => sum + book.total_pages, 0)
    const pagesRead = data.reduce((sum: number, book: any) => sum + book.pages_read, 0)
    const totalChapters = data.reduce((sum: number, book: any) => sum + book.total_chapters, 0)
    const completedChapters = data.reduce((sum: number, book: any) => sum + book.completed_chapters, 0)
    const estimatedHours = data.reduce((sum: number, book: any) => sum + book.estimated_hours, 0)
    const progressPercentage = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0

    return {
      totalBooks: data.length,
      totalPages,
      pagesRead,
      totalChapters,
      completedChapters,
      estimatedHours,
      progressPercentage
    }
  }
}

// Chapters CRUD Operations
export const chaptersService = {
  // Create a new chapter
  async createChapter(chapter: Omit<Chapter, 'id' | 'created_at' | 'updated_at'>): Promise<Chapter> {
    const { data, error } = await supabase
      .from('chapters')
      .insert({
        book_id: chapter.bookId,
        number: chapter.number,
        title: chapter.title,
        content: chapter.content,
        estimated_minutes: chapter.estimatedMinutes,
        completed: chapter.completed
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      bookId: data.book_id,
      number: data.number,
      title: data.title,
      content: data.content,
      estimatedMinutes: data.estimated_minutes,
      completed: data.completed
    }
  },

  // Get chapter by ID
  async getChapterById(id: string): Promise<Chapter | null> {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      bookId: data.book_id,
      number: data.number,
      title: data.title,
      content: data.content,
      estimatedMinutes: data.estimated_minutes,
      completed: data.completed
    }
  },

  // Get all chapters for a book
  async getChaptersByBookId(bookId: string): Promise<Chapter[]> {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('book_id', bookId)
      .order('number', { ascending: true })

    if (error) throw error

    return data.map((chapter: any) => ({
      id: chapter.id,
      bookId: chapter.book_id,
      number: chapter.number,
      title: chapter.title,
      content: chapter.content,
      estimatedMinutes: chapter.estimated_minutes,
      completed: chapter.completed
    }))
  },

  // Update a chapter
  async updateChapter(id: string, updates: Partial<Omit<Chapter, 'id' | 'bookId'>>): Promise<Chapter> {
    const { data, error } = await supabase
      .from('chapters')
      .update({
        number: updates.number,
        title: updates.title,
        content: updates.content,
        estimated_minutes: updates.estimatedMinutes,
        completed: updates.completed
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      bookId: data.book_id,
      number: data.number,
      title: data.title,
      content: data.content,
      estimatedMinutes: data.estimated_minutes,
      completed: data.completed
    }
  },

  // Delete a chapter
  async deleteChapter(id: string): Promise<void> {
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Reading Progress CRUD Operations
export const readingProgressService = {
  // Create or update reading progress
  async createReadingProgress(progress: Omit<ReadingProgress, 'id' | 'created_at' | 'updated_at'>): Promise<ReadingProgress> {
    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        book_id: progress.bookId,
        chapter_id: progress.chapterId,
        position: progress.position,
        total_time: progress.totalTime,
        last_read: progress.lastRead,
        completed: progress.completed
      }, {
        onConflict: 'book_id,chapter_id'
      })
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      bookId: data.book_id,
      chapterId: data.chapter_id,
      position: data.position,
      totalTime: data.total_time,
      lastRead: data.last_read,
      completed: data.completed
    }
  },

  // Get reading progress by book and chapter
  async getReadingProgress(bookId: string, chapterId: string): Promise<ReadingProgress | null> {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('book_id', bookId)
      .eq('chapter_id', chapterId)
      .single()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      bookId: data.book_id,
      chapterId: data.chapter_id,
      position: data.position,
      totalTime: data.total_time,
      lastRead: data.last_read,
      completed: data.completed
    }
  },

  // Get all reading progress for a book
  async getReadingProgressByBookId(bookId: string): Promise<ReadingProgress[]> {
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('book_id', bookId)
      .order('last_read', { ascending: false })

    if (error) throw error

    return data.map((progress: any) => ({
      id: progress.id,
      bookId: progress.book_id,
      chapterId: progress.chapter_id,
      position: progress.position,
      totalTime: progress.total_time,
      lastRead: progress.last_read,
      completed: progress.completed
    }))
  },

  // Update reading progress
  async updateReadingProgress(id: string, updates: Partial<Omit<ReadingProgress, 'id' | 'bookId' | 'chapterId'>>): Promise<ReadingProgress> {
    const { data, error } = await supabase
      .from('reading_progress')
      .update({
        position: updates.position,
        total_time: updates.totalTime,
        last_read: updates.lastRead,
        completed: updates.completed
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      id: data.id,
      bookId: data.book_id,
      chapterId: data.chapter_id,
      position: data.position,
      totalTime: data.total_time,
      lastRead: data.last_read,
      completed: data.completed
    }
  },

  // Delete reading progress
  async deleteReadingProgress(id: string): Promise<void> {
    const { error } = await supabase
      .from('reading_progress')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Modules Statistics
export const modulesStatsService = {
  // Get modules statistics
  async getModulesStats(): Promise<ModulesStats> {
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('completed_chapters, total_chapters, total_pages, pages_read, estimated_hours')

    if (booksError) throw booksError

    const { data: chapters, error: chaptersError } = await supabase
      .from('chapters')
      .select('completed')

    if (chaptersError) throw chaptersError

    const totalBooks = books.length
    const totalChapters = chapters.length
    const completedChapters = chapters.filter((chapter: any) => chapter.completed).length
    const totalPages = books.reduce((sum: number, book: any) => sum + (book.total_pages || 0), 0)
    const pagesRead = books.reduce((sum: number, book: any) => sum + (book.pages_read || 0), 0)
    const estimatedHours = books.reduce((sum: number, book: any) => sum + (book.estimated_hours || 0), 0)
    const progressPercentage = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0

    return {
      totalBooks,
      totalPages,
      pagesRead,
      totalChapters,
      completedChapters,
      estimatedHours,
      progressPercentage
    }
  }
} 