"use client"

import { useState, useEffect } from "react"
import { useTasks } from "@/hooks/useTasks"
import { TaskCard } from "./tasks/TaskCard"
import { TaskDetail } from "./tasks/TaskDetail"
import { VocabularyTracker } from "./tasks/VocabularyTracker"
import { TaskFilters } from "./tasks/TaskFilters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function TasksInterface() {
  const {
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
  } = useTasks()

  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = filterCategory === "all" || task.category === filterCategory
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const openTaskDetail = (task: any) => {
    setSelectedTask(task)
  }

  const closeTaskDetail = () => {
    setSelectedTask(null)
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Tasks</h2>
        <Button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-blue-500 to-purple-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <TaskFilters
        filterCategory={filterCategory}
        filterStatus={filterStatus}
        searchTerm={searchTerm}
        onFilterCategoryChange={setFilterCategory}
        onFilterStatusChange={setFilterStatus}
        onSearchChange={setSearchTerm}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isActive={activeTimer === task.id}
            timerSeconds={activeTimer === task.id ? timerSeconds : 0}
            onTaskClick={openTaskDetail}
            onStartTimer={startTimer}
            onStopTimer={stopTimer}
            formatTime={formatTime}
          />
        ))}
      </div>

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          isActive={activeTimer === selectedTask.id}
          timerSeconds={timerSeconds}
          onBack={closeTaskDetail}
          onComplete={completeTask}
          onStartTimer={startTimer}
          onStopTimer={stopTimer}
          onUpdateNotes={(taskId, notes) => updateTask(taskId, { notes })}
          formatTime={formatTime}
        />
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
            {/* Add task form would go here */}
            <div className="flex gap-2">
              <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={() => setShowAddForm(false)}>Add Task</Button>
            </div>
          </div>
        </div>
      )}

      {isEditing && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Task</h3>
            {/* Edit task form would go here */}
            <div className="flex gap-2">
              <Button onClick={() => {
                setIsEditing(false)
                setEditingTask(null)
              }}>Cancel</Button>
              <Button onClick={() => {
                setIsEditing(false)
                setEditingTask(null)
              }}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}

      <VocabularyTracker
        vocabularyWords={vocabularyWords}
        newVocabWord={newVocabWord}
        onNewVocabWordChange={updateNewVocabWord}
        onAddVocabularyWord={() => addVocabularyWord(selectedTask?.id || 0)}
      />
    </div>
  )
}
