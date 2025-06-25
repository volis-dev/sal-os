import type { JourneyProgress, Achievement } from "@/types/progress"

export function getAchievements(progress: JourneyProgress): Achievement[] {
  const achievements: Achievement[] = []

  // First journal entry
  if (progress.journalProgress.entriesCount > 0) {
    achievements.push({
      id: "first-entry",
      title: "First Step",
      description: "Wrote your first journal entry",
      icon: "📝",
      dateEarned: progress.journalProgress.lastEntryDate,
      category: "journal",
    })
  }

  // 100 vocabulary words
  if (progress.vocabularyProgress.totalWords >= 100) {
    achievements.push({
      id: "vocab-master",
      title: "Vocabulary Master",
      description: "Learned 100 vocabulary words",
      icon: "📚",
      dateEarned: progress.vocabularyProgress.lastWordAdded,
      category: "vocabulary",
    })
  }

  // Complete first book
  if (progress.booksProgress.completedBooks >= 1) {
    achievements.push({
      id: "first-book",
      title: "Book Completion",
      description: "Completed your first SAL book",
      icon: "🎓",
      dateEarned: progress.booksProgress.lastReadDate,
      category: "reading",
    })
  }

  // 7-day streak
  if (progress.currentStreak >= 7) {
    achievements.push({
      id: "week-streak",
      title: "Consistent Learner",
      description: "7-day activity streak",
      icon: "🔥",
      dateEarned: progress.lastActivityDate,
      category: "consistency",
    })
  }

  // Complete 10 tasks
  if (progress.tasksProgress.completedTasks >= 10) {
    achievements.push({
      id: "task-warrior",
      title: "Task Warrior",
      description: "Completed 10 SAL Challenge tasks",
      icon: "⚡",
      dateEarned: progress.tasksProgress.lastTaskUpdate,
      category: "tasks",
    })
  }

  // 50 journal pages
  if (progress.journalProgress.pagesWritten >= 50) {
    achievements.push({
      id: "prolific-writer",
      title: "Prolific Writer",
      description: "Wrote 50 pages in your journal",
      icon: "✍️",
      dateEarned: progress.journalProgress.lastEntryDate,
      category: "journal",
    })
  }

  return achievements.sort((a, b) => new Date(b.dateEarned || 0).getTime() - new Date(a.dateEarned || 0).getTime())
} 