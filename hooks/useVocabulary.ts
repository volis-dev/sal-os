"use client"

import { useState, useEffect } from "react"
import type { VocabularyWord, StudySession, NewWordForm, MasteryStats } from "@/types/vocabulary"
import { defaultWords, masteryLevels } from "@/lib/vocabulary-constants"
import { vocabularyService } from "@/services/vocabulary"

export function useVocabulary() {
  const [words, setWords] = useState<VocabularyWord[]>(defaultWords)
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [currentView, setCurrentView] = useState<"dashboard" | "wordlist" | "study" | "add">("dashboard")
  const [studyMode, setStudyMode] = useState<"flashcards" | "quiz" | "review">("flashcards")
  const [currentStudyWords, setCurrentStudyWords] = useState<VocabularyWord[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMastery, setFilterMastery] = useState("all")
  const [filterSource, setFilterSource] = useState("all")
  const [sortBy, setSortBy] = useState("dateAdded")
  const [studyStreak, setStudyStreak] = useState(3)
  const [todaysWord, setTodaysWord] = useState<VocabularyWord | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New word form state
  const [newWord, setNewWord] = useState<NewWordForm>({
    word: "",
    partOfSpeech: "",
    definition: "",
    etymology: "",
    pronunciation: "",
    exampleSentences: [""],
    synonyms: [],
    antonyms: [],
    source: "manual",
    bookReference: "",
    tags: [],
    personalNotes: "",
  })

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const loadedWords = await vocabularyService.getAllVocabularyWords()
        setWords(loadedWords.length > 0 ? loadedWords : defaultWords)
        
        // Set today's word (rotate based on date)
        const today = new Date().getDate()
        const wordsToUse = loadedWords.length > 0 ? loadedWords : defaultWords
        setTodaysWord(wordsToUse[today % wordsToUse.length] || wordsToUse[0])
        
        // Note: Study sessions would need a separate service
        // For now, starting with empty sessions
        setStudySessions([])
      } catch (err) {
        console.error("Error loading vocabulary data:", err)
        setError("Failed to load vocabulary data")
        setWords(defaultWords)
        setTodaysWord(defaultWords[0])
        setStudySessions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const addNewWord = async () => {
    if (newWord.word.trim() && newWord.definition.trim()) {
      try {
        setError(null)
        
        // Create word data that matches the service expectations
        const wordData = {
          word: newWord.word.trim(),
          definition: newWord.definition.trim(),
          example: newWord.exampleSentences[0] || "",
          context: newWord.personalNotes || "",
          difficulty: 3, // Default difficulty
          mastered: false,
          reviewCount: 0,
          lastReviewed: new Date().toISOString(),
          notes: newWord.personalNotes || ""
        } as any // Type assertion to bridge the type differences

        const savedWord = await vocabularyService.createVocabularyWord(wordData)
        setWords(prev => [...prev, savedWord])

        // Reset form
        setNewWord({
          word: "",
          partOfSpeech: "",
          definition: "",
          etymology: "",
          pronunciation: "",
          exampleSentences: [""],
          synonyms: [],
          antonyms: [],
          source: "manual",
          bookReference: "",
          tags: [],
          personalNotes: "",
        })

        setCurrentView("dashboard")
      } catch (err) {
        console.error("Error adding new word:", err)
        setError("Failed to add new word")
      }
    }
  }

  const startStudySession = (mode: "flashcards" | "quiz" | "review") => {
    // Get words due for review or random selection
    const wordsToStudy = words
      .filter((word) => {
        const dueDate = new Date(word.lastReviewed)
        const today = new Date()
        // Simple due date logic - review every 7 days
        const daysSinceReview = (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceReview >= 7 || mode === "quiz"
      })
      .slice(0, 10) // Limit to 10 words per session

    if (wordsToStudy.length === 0) {
      // If no words due, take random words
      const shuffled = [...words].sort(() => 0.5 - Math.random())
      setCurrentStudyWords(shuffled.slice(0, 10))
    } else {
      setCurrentStudyWords(wordsToStudy)
    }

    setStudyMode(mode)
    setCurrentWordIndex(0)
    setShowAnswer(false)
    setCurrentView("study")
  }

  const nextWord = async () => {
    if (currentWordIndex < currentStudyWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setShowAnswer(false)
    } else {
      // End study session
      const session: StudySession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        wordsStudied: currentStudyWords.map((w) => w.id),
        correctAnswers: currentStudyWords.length, // Simplified for now
        totalQuestions: currentStudyWords.length,
        duration: 10, // Simplified for now
        mode: studyMode,
      }

      // Note: Study sessions would need a separate service
      // For now, just update local state
      setStudySessions(prev => [...prev, session])
      setCurrentView("dashboard")
    }
  }

  const previousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
      setShowAnswer(false)
    }
  }

  const markWordDifficulty = async (difficulty: number) => {
    const currentWord = currentStudyWords[currentWordIndex]
    
    try {
      setError(null)
      
      // Update word in Supabase using type assertion
      const updatedWord = await vocabularyService.updateVocabularyWord(currentWord.id, {
        reviewCount: currentWord.reviewCount + 1,
        lastReviewed: new Date().toISOString(),
        mastered: difficulty <= 2 && currentWord.reviewCount >= 3
      } as any)

      // Update local state
      setWords(prev => prev.map(word => 
        word.id === currentWord.id ? updatedWord : word
      ))

      nextWord()
    } catch (err) {
      console.error("Error updating word difficulty:", err)
      setError("Failed to update word difficulty")
    }
  }

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase())
    // Use type assertion to access mastered property
    const matchesMastery = filterMastery === "all" || (word as any).mastered === (filterMastery === "mastered")
    const matchesSource = filterSource === "all" // Simplified for now
    return matchesSearch && matchesMastery && matchesSource
  })

  const masteryStats: MasteryStats[] = masteryLevels.map((level) => ({
    ...level,
    count: words.filter((word) => (word as any).mastered === (level.value === "mastered")).length,
  }))

  const wordsThisWeek = words.filter((word) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return new Date(word.lastReviewed) > weekAgo
  }).length

  const wordsToReview = words.filter((word) => {
    const dueDate = new Date(word.lastReviewed)
    const today = new Date()
    const daysSinceReview = (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysSinceReview >= 7
  }).length

  const recentWords = words
    .sort((a, b) => new Date(b.lastReviewed).getTime() - new Date(a.lastReviewed).getTime())
    .slice(0, 5)

  const stats = {
    totalWords: words.length,
    studyStreak,
    wordsThisWeek,
    wordsToReview,
    masteredWords: words.filter((word) => (word as any).mastered === true).length,
    learningWords: words.filter((word) => (word as any).mastered === false && (word as any).reviewCount > 0).length,
    familiarWords: words.filter((word) => (word as any).reviewCount >= 2 && (word as any).mastered === false).length,
    newWords: words.filter((word) => (word as any).reviewCount === 0).length,
    totalReviews: words.reduce((sum, word) => sum + (word as any).reviewCount, 0),
    masteryPercentage: words.length > 0 
      ? Math.round((words.filter((word) => (word as any).mastered === true).length / words.length) * 100)
      : 0
  }

  const handleNewWordChange = (field: keyof NewWordForm, value: any) => {
    setNewWord((prev) => ({ ...prev, [field]: value }))
  }

  return {
    // State
    words,
    studySessions,
    currentView,
    studyMode,
    currentStudyWords,
    currentWordIndex,
    showAnswer,
    searchTerm,
    filterMastery,
    filterSource,
    sortBy,
    studyStreak,
    todaysWord,
    newWord,
    filteredWords,
    masteryStats,
    stats,
    recentWords,
    isLoading,
    error,

    // Actions
    setCurrentView,
    setStudyMode,
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
  }
} 