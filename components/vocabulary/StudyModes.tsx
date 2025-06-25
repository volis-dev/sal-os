"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Target, Clock } from "lucide-react"
import type { StudyModesProps } from "@/types/vocabulary-dashboard"

export function StudyModes({ onStartStudy }: StudyModesProps) {
  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Play className="h-6 w-6 text-green-500" />
          Study Modes
        </CardTitle>
        <CardDescription>Choose your learning approach</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => onStartStudy("flashcards")}
            className="h-24 flex-col bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:shadow-xl transition-all duration-300"
          >
            <RotateCcw className="h-8 w-8 mb-2" />
            <span className="font-semibold">Flashcards</span>
            <span className="text-xs opacity-80">Interactive review</span>
          </Button>
          <Button
            onClick={() => onStartStudy("quiz")}
            className="h-24 flex-col bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:shadow-xl transition-all duration-300"
          >
            <Target className="h-8 w-8 mb-2" />
            <span className="font-semibold">Quiz Mode</span>
            <span className="text-xs opacity-80">Test knowledge</span>
          </Button>
          <Button
            onClick={() => onStartStudy("review")}
            className="h-24 flex-col bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-xl transition-all duration-300"
          >
            <Clock className="h-8 w-8 mb-2" />
            <span className="font-semibold">Spaced Review</span>
            <span className="text-xs opacity-80">Due words only</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 