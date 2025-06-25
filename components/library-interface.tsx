"use client"

import { useVocabulary } from "@/hooks/useVocabulary"
import { VocabularyDashboard } from "@/components/vocabulary/VocabularyDashboard"
import { VocabularyWordList } from "@/components/vocabulary/VocabularyWordList"
import { VocabularyStudy } from "@/components/vocabulary/VocabularyStudy"
import { VocabularyAddWord } from "@/components/vocabulary/VocabularyAddWord"
import { partOfSpeechOptions, sourceOptions } from "@/lib/vocabulary-constants"

export function LibraryInterface() {
  const {
    // State
    currentView,
    studyMode,
    currentStudyWords,
    currentWordIndex,
    showAnswer,
    searchTerm,
    filterMastery,
    filterSource,
    sortBy,
    todaysWord,
    newWord,
    filteredWords,
    masteryStats,
    recentWords,
    stats,
    studySessions,

    // Actions
    setCurrentView,
    setShowAnswer,
    setSearchTerm,
    setFilterMastery,
    setFilterSource,
    setSortBy,
    addNewWord,
    startStudySession,
    nextWord,
    previousWord,
    markWordDifficulty,
    handleNewWordChange,
  } = useVocabulary()

  const handleEndSession = () => {
    setCurrentView("dashboard")
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {currentView === "dashboard" && (
        <VocabularyDashboard
          stats={stats}
          masteryStats={masteryStats}
          todaysWord={todaysWord}
          recentWords={recentWords}
          studySessions={studySessions}
          onStartStudy={startStudySession}
          onNavigateToAdd={() => setCurrentView("add")}
          onNavigateToWordList={() => setCurrentView("wordlist")}
        />
      )}

      {currentView === "wordlist" && (
        <VocabularyWordList
          words={filteredWords}
          masteryLevels={masteryStats}
          sourceOptions={sourceOptions}
          searchTerm={searchTerm}
          filterMastery={filterMastery}
          filterSource={filterSource}
          sortBy={sortBy}
          onSearchChange={setSearchTerm}
          onFilterMasteryChange={setFilterMastery}
          onFilterSourceChange={setFilterSource}
          onSortByChange={setSortBy}
          onNavigateToAdd={() => setCurrentView("add")}
          onNavigateToDashboard={() => setCurrentView("dashboard")}
        />
      )}

      {currentView === "study" && currentStudyWords.length > 0 && (
        <VocabularyStudy
          studyWords={currentStudyWords}
          currentWordIndex={currentWordIndex}
          showAnswer={showAnswer}
          studyMode={studyMode}
          onShowAnswer={() => setShowAnswer(true)}
          onMarkDifficulty={markWordDifficulty}
          onPreviousWord={previousWord}
          onNextWord={nextWord}
          onEndSession={handleEndSession}
        />
      )}

      {currentView === "add" && (
        <VocabularyAddWord
          newWord={newWord}
          partOfSpeechOptions={partOfSpeechOptions}
          sourceOptions={sourceOptions}
          onNewWordChange={handleNewWordChange}
          onAddWord={addNewWord}
          onCancel={() => setCurrentView("dashboard")}
        />
      )}
    </div>
  )
}
