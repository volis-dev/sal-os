"use client"

import { useState, useEffect } from "react"
import type { Book, Chapter, ReadingProgress, ModulesStats } from "@/types/modules"
import { salBooks, sampleChapters } from "@/lib/modules-constants"
import { booksService, chaptersService, readingProgressService } from "@/services/modules"

export function useModules() {
  const [books, setBooks] = useState<Book[]>(salBooks)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [readingProgress, setReadingProgress] = useState<Record<string, ReadingProgress>>({})
  const [isReading, setIsReading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [readingTime, setReadingTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [booksData, progressData] = await Promise.all([
          booksService.getAllBooks(),
          // Note: Reading progress would need to be loaded differently
          // For now, we'll start with empty progress
          Promise.resolve({})
        ])

        setBooks(booksData.length > 0 ? booksData : salBooks)
        setReadingProgress(progressData)
      } catch (err) {
        console.error("Error loading modules data:", err)
        setError("Failed to load modules data")
        setBooks(salBooks)
        setReadingProgress({})
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Reading timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && isReading) {
      interval = setInterval(() => {
        setReadingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, isReading])

  // Auto-save reading progress
  useEffect(() => {
    if (selectedBook && selectedChapter && readingTime > 0) {
      const progressKey = `${selectedBook.id}-${selectedChapter.id}`
      const newProgress: Record<string, ReadingProgress> = {
        ...readingProgress,
        [progressKey]: {
          id: progressKey,
          bookId: selectedBook.id,
          chapterId: selectedChapter.id,
          position: 0,
          totalTime: readingTime,
          lastRead: new Date().toISOString(),
          completed: true,
        },
      }
      setReadingProgress(newProgress)
      
      // Save to Supabase
      const saveProgress = async () => {
        try {
          await readingProgressService.createReadingProgress({
            bookId: selectedBook.id,
            chapterId: selectedChapter.id,
            position: 0,
            totalTime: readingTime,
            lastRead: new Date().toISOString(),
            completed: true,
          })
        } catch (err) {
          console.error("Error saving reading progress:", err)
        }
      }
      saveProgress()
    }
  }, [readingTime, selectedBook, selectedChapter, readingProgress])

  const startReading = (book: Book, chapterNumber?: number) => {
    setSelectedBook(book)
    const chapters = sampleChapters[book.id] || []
    const chapter = chapters.find((ch) => ch.number === (chapterNumber || book.currentChapter))
    if (chapter) {
      setSelectedChapter(chapter)
    }
    setIsReading(true)
    setReadingTime(0)
    setIsTimerRunning(true)
  }

  const stopReading = () => {
    setIsReading(false)
    setSelectedBook(null)
    setSelectedChapter(null)
    setIsTimerRunning(false)
    setReadingTime(0)
  }

  const markChapterComplete = async () => {
    if (selectedBook && selectedChapter) {
      try {
        setError(null)
        
        // Update reading progress
        const progressKey = `${selectedBook.id}-${selectedChapter.id}`
        const newProgress: Record<string, ReadingProgress> = {
          ...readingProgress,
          [progressKey]: {
            id: progressKey,
            bookId: selectedBook.id,
            chapterId: selectedChapter.id,
            position: 0,
            totalTime: readingTime,
            lastRead: new Date().toISOString(),
            completed: true,
          },
        }
        setReadingProgress(newProgress)

        // Save progress to Supabase
        await readingProgressService.createReadingProgress({
          bookId: selectedBook.id,
          chapterId: selectedChapter.id,
          position: 0,
          totalTime: readingTime,
          lastRead: new Date().toISOString(),
          completed: true,
        })

        // Update book progress
        const newCompletedChapters = Math.min(selectedBook.completedChapters + 1, selectedBook.totalChapters)
        const updatedBook = {
          ...selectedBook,
          completedChapters: newCompletedChapters,
          currentChapter: Math.min(selectedBook.currentChapter + 1, selectedBook.totalChapters),
          lastRead: new Date().toISOString(),
          pagesRead: Math.round((newCompletedChapters / selectedBook.totalChapters) * selectedBook.totalPages),
        }

        // Save updated book to Supabase
        const savedBook = await booksService.updateBook(selectedBook.id, {
          completedChapters: updatedBook.completedChapters,
          currentChapter: updatedBook.currentChapter,
          lastRead: updatedBook.lastRead,
          pagesRead: updatedBook.pagesRead,
        })

        // Update local state
        const updatedBooks = books.map((book) => 
          book.id === selectedBook.id ? savedBook : book
        )
        setBooks(updatedBooks)
      } catch (err) {
        console.error("Error marking chapter complete:", err)
        setError("Failed to mark chapter complete")
      }
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalProgress = books.reduce((sum, book) => sum + book.completedChapters, 0)
  const totalChapters = books.reduce((sum, book) => sum + book.totalChapters, 0)
  const overallProgress = Math.round((totalProgress / totalChapters) * 100)

  const modulesStats: ModulesStats = {
    totalBooks: books.length,
    totalPages: books.reduce((sum, book) => sum + book.totalPages, 0),
    pagesRead: books.reduce((sum, book) => sum + book.pagesRead, 0),
    totalChapters,
    completedChapters: totalProgress,
    estimatedHours: books.reduce((sum, book) => sum + book.estimatedHours, 0),
    progressPercentage: overallProgress,
  }

  return {
    // State
    books,
    selectedBook,
    selectedChapter,
    readingProgress,
    isReading,
    searchTerm,
    readingTime,
    isTimerRunning,
    filteredBooks,
    modulesStats,
    isLoading,
    error,

    // Actions
    setSearchTerm,
    startReading,
    stopReading,
    markChapterComplete,
    setIsTimerRunning,

    // Utilities
    formatTime,
  }
} 