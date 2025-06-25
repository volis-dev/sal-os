"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, BookOpen } from "lucide-react"
import type { Book } from "@/types/modules"

interface BookCardProps {
  book: Book
  onStartReading: (book: Book) => void
}

export function BookCard({ book, onStartReading }: BookCardProps) {
  const progressPercentage = book.totalChapters > 0 ? (book.completedChapters / book.totalChapters) * 100 : 0
  const isCompleted = book.completedChapters === book.totalChapters

  return (
    <Card className="border-0 shadow-xl glass-card hover:glow-effect transition-all duration-300 group">
      {/* Gradient Header */}
      <div className={`h-32 bg-gradient-to-br ${book.color} rounded-t-xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg leading-tight">{book.title}</h3>
          <p className="text-white/80 text-sm font-medium">{book.subtitle}</p>
        </div>
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Progress Ring */}
        <div className="flex items-center justify-between">
          <div className="relative w-20 h-20">
            <svg className="transform -rotate-90 w-20 h-20">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-200"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - progressPercentage / 100)}`}
                className="text-indigo-600 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-slate-800">{Math.round(progressPercentage)}%</span>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div>
              <p className="text-xs text-slate-500 font-medium">Chapters</p>
              <p className="font-bold text-slate-800">
                {book.completedChapters}/{book.totalChapters}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Pages</p>
              <p className="font-bold text-slate-800">
                {book.pagesRead}/{book.totalPages}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Est. Time</p>
              <p className="font-bold text-slate-800">{book.estimatedHours}h</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">{book.description}</p>

        {/* Action Button */}
        <Button
          onClick={() => onStartReading(book)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={isCompleted && book.completedChapters === book.totalChapters}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          {isCompleted ? "Review Book" : book.completedChapters > 0 ? "Continue Reading" : "Start Reading"}
        </Button>

        {/* Last Read */}
        {book.lastRead && (
          <p className="text-xs text-slate-500 text-center">
            Last read: {new Date(book.lastRead).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
} 