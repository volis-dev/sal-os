"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Play, Pause, Bookmark } from "lucide-react"
import type { Book, Chapter } from "@/types/modules"

interface ReadingInterfaceProps {
  selectedBook: Book | null
  selectedChapter: Chapter | null
  readingTime: number
  isTimerRunning: boolean
  onStopReading: () => void
  onToggleTimer: () => void
  onStartReading: (book: Book, chapterNumber?: number) => void
  onMarkChapterComplete: () => void
  formatTime: (seconds: number) => string
}

export function ReadingInterface({
  selectedBook,
  selectedChapter,
  readingTime,
  isTimerRunning,
  onStopReading,
  onToggleTimer,
  onStartReading,
  onMarkChapterComplete,
  formatTime,
}: ReadingInterfaceProps) {
  if (!selectedBook || !selectedChapter) return null

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Navigation Bar */}
      <div className="border-b glass-card p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onStopReading}
              className="hover:glass-card rounded-xl transition-all duration-300"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Modules
            </Button>
            <div className="text-sm">
              <p className="font-semibold text-slate-800">{selectedBook.title}</p>
              <p className="text-slate-600">{selectedChapter.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="glass-card">
              <Clock className="mr-1 h-3 w-3" />
              {formatTime(readingTime)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleTimer}
              className="glass-card border-0"
            >
              {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" className="glass-card border-0">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reading Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Reading Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-700">{selectedChapter.content}</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l glass-card p-6 overflow-auto">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Chapter Navigation</h3>
              <div className="space-y-2">
                {Array.from({ length: selectedBook.totalChapters }, (_, i) => {
                  const chapterNumber = i + 1
                  const isCurrentChapter = chapterNumber === selectedChapter.number
                  const isCompleted = chapterNumber <= selectedBook.completedChapters

                  return (
                    <Button
                      key={i}
                      variant={isCurrentChapter ? "default" : "ghost"}
                      className="w-full justify-start glass-card border-0"
                      size="sm"
                      onClick={() => onStartReading(selectedBook, chapterNumber)}
                    >
                      Chapter {chapterNumber}
                      {isCompleted && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-4">Reading Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">This Chapter</span>
                  <span className="font-medium">{selectedChapter.estimatedMinutes} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Time Reading</span>
                  <span className="font-medium">{formatTime(readingTime)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Book Progress</span>
                  <span className="font-medium">
                    {selectedBook.completedChapters}/{selectedBook.totalChapters} chapters
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={onMarkChapterComplete}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-xl"
              disabled={selectedChapter.completed}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {selectedChapter.completed ? "Chapter Complete" : "Mark Complete"}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t glass-card p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            disabled={selectedChapter.number === 1}
            className="glass-card border-0"
            onClick={() => onStartReading(selectedBook, selectedChapter.number - 1)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Chapter
          </Button>
          <span className="text-sm text-slate-600 font-medium">
            Chapter {selectedChapter.number} of {selectedBook.totalChapters}
          </span>
          <Button
            variant="outline"
            disabled={selectedChapter.number === selectedBook.totalChapters}
            className="glass-card border-0"
            onClick={() => onStartReading(selectedBook, selectedChapter.number + 1)}
          >
            Next Chapter
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 