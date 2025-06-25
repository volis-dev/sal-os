"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { SalBook, JourneyProgress } from "@/types/journey-map"

interface BookProgressGridProps {
  books: SalBook[]
  progress: JourneyProgress
  onBookClick?: (bookId: string) => void
}

export function BookProgressGrid({ books, progress, onBookClick }: BookProgressGridProps) {
  // Calculate per-book progress (stub: all 0 except currentBookId)
  const getBookProgress = (book: SalBook) => {
    if (!progress.booksProgress.currentBookId) return 0
    if (book.id === progress.booksProgress.currentBookId) {
      return Math.round((progress.booksProgress.chaptersCompleted / book.totalChapters) * 100)
    }
    // If completedBooks includes this book, return 100
    if (progress.booksProgress.completedBooks > 0) {
      // This is a simplification; real logic would check which books are completed
      return 100
    }
    return 0
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <Card
          key={book.id}
          className="border-0 shadow-xl glass-card cursor-pointer hover:glow-effect"
          onClick={() => onBookClick?.(book.id)}
        >
          <div className={`h-20 bg-gradient-to-br ${book.color} rounded-t-xl relative overflow-hidden`}></div>
          <CardHeader>
            <CardTitle className="text-lg font-bold">{book.title}</CardTitle>
            <div className="text-xs text-slate-500">{book.subtitle}</div>
          </CardHeader>
          <CardContent>
            <Progress value={getBookProgress(book)} className="h-2" />
            <div className="text-xs text-slate-500 mt-2">
              {getBookProgress(book)}% complete
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 