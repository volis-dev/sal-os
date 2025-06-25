export const salBooks = [
  { id: "book-1", title: "Life Leadership & Education", totalChapters: 5 },
  { id: "book-2", title: "Change, Growth & Freedom", totalChapters: 12 },
  { id: "book-3", title: "SAL Philosophy", totalChapters: 7 },
  { id: "book-4", title: "SAL Theory", totalChapters: 21 },
  { id: "book-5", title: "SAL Model", totalChapters: 9 },
  { id: "book-6", title: "Success Stories", totalChapters: 12 },
  { id: "book-7", title: "Pedagogy", totalChapters: 10 },
  { id: "book-8", title: "Sovereignty", totalChapters: 5 },
]

export const defaultTasks = 25 // Total number of SAL Challenge tasks

export const localStorageKeys = {
  journalEntries: "sal-os-journal-entries",
  readingProgress: "sal-os-reading-progress",
  tasks: "sal-os-tasks",
  tasksVocabulary: "sal-os-vocabulary",
  libraryVocabulary: "sal-os-vocabulary-library",
  lifeArenas: "sal-os-life-arenas",
} as const 