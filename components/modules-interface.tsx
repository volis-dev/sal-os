"use client"

import { useModules } from "@/hooks/useModules"
import { ModulesDashboard } from "@/components/modules/ModulesDashboard"
import { BookCard } from "@/components/modules/BookCard"
import { ReadingInterface } from "@/components/modules/ReadingInterface"

export function ModulesInterface() {
  const {
    // State
    selectedBook,
    selectedChapter,
    isReading,
    searchTerm,
    readingTime,
    isTimerRunning,
    filteredBooks,
    modulesStats,

    // Actions
    setSearchTerm,
    startReading,
    stopReading,
    markChapterComplete,
    setIsTimerRunning,

    // Utilities
    formatTime,
  } = useModules()

  return (
    <div className="flex h-full">
      {!isReading ? (
        /* Books Overview */
        <div className="container mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 bg-clip-text text-transparent tracking-tight">
              SAL Modules
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Your journey through the 8 books of Self-Action Leadership
            </p>
          </div>

          <ModulesDashboard
            modulesStats={modulesStats}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onStartReading={startReading} />
            ))}
          </div>
        </div>
      ) : (
        <ReadingInterface
          selectedBook={selectedBook}
          selectedChapter={selectedChapter}
          readingTime={readingTime}
          isTimerRunning={isTimerRunning}
          onStopReading={stopReading}
          onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
          onStartReading={startReading}
          onMarkChapterComplete={markChapterComplete}
          formatTime={formatTime}
        />
      )}
    </div>
  )
}
