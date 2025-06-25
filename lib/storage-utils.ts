/**
 * Utility functions for safe localStorage operations with error handling
 */

export interface StorageError {
  key: string
  error: string
  timestamp: string
}

export function safeGetItem(key: string, defaultValue: any = null): any {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      return defaultValue
    }
    return JSON.parse(item)
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

export function safeSetItem(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
    return false
  }
}

export function safeRemoveItem(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error)
    return false
  }
}

export function clearAllSALData(): boolean {
  const keys = [
    "sal-os-journal-entries",
    "sal-os-reading-progress", 
    "sal-os-tasks",
    "sal-os-vocabulary",
    "sal-os-vocabulary-library",
    "sal-os-life-arenas",
    "sal-os-start-date",
    "sal-os-timezone",
    "sal-os-notifications",
    "sal-os-onboarding-complete"
  ]
  
  let success = true
  keys.forEach(key => {
    if (!safeRemoveItem(key)) {
      success = false
    }
  })
  
  return success
}

export function exportAllData(): Record<string, any> {
  const keys = [
    "sal-os-journal-entries",
    "sal-os-reading-progress", 
    "sal-os-tasks",
    "sal-os-vocabulary",
    "sal-os-vocabulary-library",
    "sal-os-life-arenas",
    "sal-os-start-date",
    "sal-os-timezone",
    "sal-os-notifications",
    "sal-os-onboarding-complete"
  ]
  
  const data: Record<string, any> = {}
  keys.forEach(key => {
    const value = safeGetItem(key)
    if (value !== null) {
      data[key] = value
    }
  })
  
  return data
}

export function importAllData(data: Record<string, any>): boolean {
  let success = true
  
  Object.entries(data).forEach(([key, value]) => {
    if (!safeSetItem(key, value)) {
      success = false
    }
  })
  
  return success
}

export function validateStorageData(): { isValid: boolean; errors: StorageError[] } {
  const errors: StorageError[] = []
  
  try {
    // Test basic localStorage functionality
    const testKey = "sal-os-test"
    const testValue = { test: true }
    
    if (!safeSetItem(testKey, testValue)) {
      errors.push({
        key: "localStorage",
        error: "Cannot write to localStorage",
        timestamp: new Date().toISOString()
      })
    }
    
    const retrieved = safeGetItem(testKey)
    if (retrieved?.test !== true) {
      errors.push({
        key: "localStorage",
        error: "Cannot read from localStorage",
        timestamp: new Date().toISOString()
      })
    }
    
    safeRemoveItem(testKey)
    
  } catch (error) {
    errors.push({
      key: "localStorage",
      error: `Storage validation failed: ${error}`,
      timestamp: new Date().toISOString()
    })
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
} 