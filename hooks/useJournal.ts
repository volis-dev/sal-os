"use client"

import { useState, useEffect, useRef } from "react"
import type { JournalEntry, JournalStats, AutoSaveStatus } from "@/types/journal"
import { entryTypes, entryTemplates } from "@/lib/journal-constants"
import { journalService } from "@/services/journal"

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>("saved")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Load entries from Supabase on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const loadedEntries = await journalService.getAllJournalEntries()
        setEntries(loadedEntries)
      } catch (err) {
        console.error("Error loading journal entries:", err)
        setError("Failed to load journal entries")
        setEntries([])
      } finally {
        setIsLoading(false)
      }
    }

    loadEntries()
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (currentEntry && isEditing) {
      setAutoSaveStatus("unsaved")

      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        saveEntry()
        setAutoSaveStatus("saved")
      }, 2000) // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [currentEntry, isEditing])

  const createNewEntry = (type = "free-writing") => {
    const newEntry: Omit<JournalEntry, 'id'> = {
      title: `${entryTypes.find((t) => t.value === type)?.label || "New Entry"} - ${new Date().toLocaleDateString()}`,
      content: entryTemplates[type] || "",
      type,
      date: new Date().toISOString(),
      wordCount: 0,
      tags: [],
    }

    setCurrentEntry(newEntry as JournalEntry)
    setIsEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 100)
  }

  const saveEntry = async () => {
    if (!currentEntry) return

    setAutoSaveStatus("saving")

    try {
      setError(null)
      const updatedEntry = {
        ...currentEntry,
        wordCount: currentEntry.content.trim().split(/\s+/).length,
      }

      let savedEntry: JournalEntry

      if (currentEntry.id) {
        // Update existing entry
        savedEntry = await journalService.updateJournalEntry(currentEntry.id, {
          title: updatedEntry.title,
          content: updatedEntry.content,
          type: updatedEntry.type,
          date: updatedEntry.date,
          wordCount: updatedEntry.wordCount,
          tags: updatedEntry.tags
        })
      } else {
        // Create new entry
        savedEntry = await journalService.createJournalEntry({
          title: updatedEntry.title,
          content: updatedEntry.content,
          type: updatedEntry.type,
          date: updatedEntry.date,
          wordCount: updatedEntry.wordCount,
          tags: updatedEntry.tags
        })
      }

      // Update local state
      const existingIndex = entries.findIndex((e) => e.id === savedEntry.id)
      let updatedEntries

      if (existingIndex >= 0) {
        updatedEntries = [...entries]
        updatedEntries[existingIndex] = savedEntry
      } else {
        updatedEntries = [savedEntry, ...entries]
      }

      setEntries(updatedEntries)
      setCurrentEntry(savedEntry)
      setAutoSaveStatus("saved")
    } catch (err) {
      console.error("Error saving entry:", err)
      setError("Failed to save entry")
      setAutoSaveStatus("unsaved")
    }
  }

  const selectEntry = (entry: JournalEntry) => {
    if (isEditing && currentEntry) {
      saveEntry()
    }
    setCurrentEntry(entry)
    setIsEditing(false)
  }

  const updateCurrentEntry = (field: keyof JournalEntry, value: any) => {
    if (!currentEntry) return

    setCurrentEntry({
      ...currentEntry,
      [field]: value,
    })
  }

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || entry.type === filterType
    return matchesSearch && matchesFilter
  })

  const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0)
  const totalPages = Math.ceil(totalWords / 250) // Assuming 250 words per page

  const journalStats: JournalStats = {
    totalPages,
    totalWords,
    totalEntries: entries.length,
    progressPercentage: Math.min((totalPages / 200) * 100, 100),
  }

  return {
    // State
    entries,
    currentEntry,
    isEditing,
    searchTerm,
    filterType,
    selectedDate,
    autoSaveStatus,
    filteredEntries,
    journalStats,
    isLoading,
    error,

    // Refs
    textareaRef,

    // Actions
    setSearchTerm,
    setFilterType,
    setSelectedDate,
    createNewEntry,
    saveEntry,
    selectEntry,
    updateCurrentEntry,
    setIsEditing,
  }
} 