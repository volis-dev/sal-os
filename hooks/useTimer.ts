import { useState, useEffect, useRef, useCallback } from 'react';
import type { UseTimerReturn } from '@/types/sal-os';

export function useTimer(initialTime: number = 0): UseTimerReturn {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Cleanup function to prevent memory leaks
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start timer
  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - (time * 1000);
      
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setTime(elapsed);
        }
      }, 1000);
    }
  }, [isRunning, time]);

  // Pause timer
  const pause = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      cleanup();
    }
  }, [isRunning, cleanup]);

  // Reset timer
  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);
    startTimeRef.current = null;
    cleanup();
  }, [initialTime, cleanup]);

  // Save current time (useful for persisting timer state)
  const save = useCallback(() => {
    return {
      time,
      isRunning,
      timestamp: Date.now()
    };
  }, [time, isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    save
  };
}

// Specialized timer hook for modules with auto-save
export function useModuleTimer(moduleId: string, onSave?: (time: number) => void) {
  const timer = useTimer();
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save every 30 seconds when timer is running
  useEffect(() => {
    if (timer.isRunning && onSave) {
      saveIntervalRef.current = setInterval(() => {
        onSave(timer.time);
      }, 30000); // 30 seconds
    } else {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = null;
      }
    }

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [timer.isRunning, timer.time, onSave, moduleId]);

  return timer;
} 