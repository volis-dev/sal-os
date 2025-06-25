"use client"

import { useState, useEffect, useRef } from "react"
import type { SALTask, TaskStats, CategoryStats } from "@/types/tasks"
import type { VocabularyWord, NewWordForm } from "@/types/vocabulary"
import { defaultTasks } from "@/lib/tasks-constants"
import { tasksService } from "@/services/tasks"

export function useTasks() {
  const [tasks, setTasks] = useState<SALTask[]>(defaultTasks)
  const [selectedTask, setSelectedTask] = useState<SALTask | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingTask, setEditingTask] = useState<SALTask | null>(null)
  const [newVocabWord, setNewVocabWord] = useState<NewWordForm>({
    word: "",
    partOfSpeech: "",
    definition: "",
    etymology: "",
    pronunciation: "",
    exampleSentences: [],
    synonyms: [],
    antonyms: [],
    source: "tasks",
    bookReference: "",
    tags: [],
    personalNotes: ""
  })
  const [vocabularyWords, setVocabularyWords] = useState<VocabularyWord[]>([])
  const [activeTimer, setActiveTimer] = useState<number | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [tasksData, vocabData] = await Promise.all([
          tasksService.getAllTasks(),
          // Note: Vocabulary would need to be loaded from vocabulary service
          // For now, starting with empty vocabulary
          Promise.resolve([])
        ])

        setTasks(tasksData.length > 0 ? tasksData : defaultTasks)
        setVocabularyWords(vocabData)
      } catch (err) {
        console.error("Error loading tasks data:", err)
        setError("Failed to load tasks data")
        setTasks(defaultTasks)
        setVocabularyWords([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Timer functionality
  useEffect(() => {
    if (activeTimer !== null) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [activeTimer])

  const addTask = async (task: Omit<SALTask, 'id'>) => {
    try {
      const newTask = await tasksService.createTask(task)
      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (err) {
      console.error("Error adding task:", err)
      throw err
    }
  }

  const updateTask = async (taskId: number, updates: Partial<SALTask>) => {
    try {
      const updatedTask = await tasksService.updateTask(taskId, updates)
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task))
      return updatedTask
    } catch (err) {
      console.error("Error updating task:", err)
      throw err
    }
  }

  const deleteTask = async (taskId: number) => {
    try {
      await tasksService.deleteTask(taskId)
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (err) {
      console.error("Error deleting task:", err)
      throw err
    }
  }

  const startTimer = async (taskId: number) => {
    try {
      setActiveTimer(taskId)
      setTimerSeconds(0)
      
      // Update task status to in-progress if not already
      const task = tasks.find(t => t.id === taskId)
      if (task && task.status === 'not-started') {
        await tasksService.updateTask(taskId, {
          status: 'in-progress',
          startedDate: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error("Error starting timer:", err)
    }
  }

  const stopTimer = async () => {
    if (activeTimer !== null) {
      try {
        // Update task with time spent
        await tasksService.updateTask(activeTimer, {
          timeSpent: timerSeconds
        })
        
        setActiveTimer(null)
        setTimerSeconds(0)
      } catch (err) {
        console.error("Error stopping timer:", err)
      }
    }
  }

  const completeTask = async (taskId: number) => {
    try {
      const completedTask = await tasksService.markTaskAsCompleted(taskId)
      setTasks(prev => prev.map(task => task.id === taskId ? completedTask : task))
      return completedTask
    } catch (err) {
      console.error("Error completing task:", err)
      throw err
    }
  }

  const addVocabularyWord = async (taskId: number) => {
    try {
      // This would need to be implemented with vocabulary service
      // For now, just update the task with the new vocabulary word
      const task = tasks.find(t => t.id === taskId)
      if (task) {
        await tasksService.updateTask(taskId, {
          notes: task.notes + `\nVocabulary: ${newVocabWord.word}`
        })
        
        // Reset form
        setNewVocabWord({
          word: "",
          partOfSpeech: "",
          definition: "",
          etymology: "",
          pronunciation: "",
          exampleSentences: [],
          synonyms: [],
          antonyms: [],
          source: "tasks",
          bookReference: "",
          tags: [],
          personalNotes: ""
        })
      }
    } catch (err) {
      console.error("Error adding vocabulary word:", err)
    }
  }

  const updateNewVocabWord = (field: keyof NewWordForm, value: any) => {
    setNewVocabWord((prev) => ({ ...prev, [field]: value }))
  }

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category)
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const getTaskStats = async (): Promise<TaskStats> => {
    try {
      return await tasksService.getTaskStats()
    } catch (err) {
      console.error("Error getting task stats:", err)
      return {
        completedTasks: 0,
        inProgressTasks: 0,
        totalTimeSpent: 0,
        progressPercentage: 0
      }
    }
  }

  return {
    tasks,
    selectedTask,
    isEditing,
    editingTask,
    newVocabWord,
    vocabularyWords,
    activeTimer,
    timerSeconds,
    isLoading,
    error,
    setSelectedTask,
    setIsEditing,
    setEditingTask,
    addTask,
    updateTask,
    deleteTask,
    startTimer,
    stopTimer,
    completeTask,
    addVocabularyWord,
    updateNewVocabWord,
    getTasksByCategory,
    getTasksByStatus,
    getTaskStats
  }
} 