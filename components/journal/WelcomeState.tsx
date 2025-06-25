"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenTool } from "lucide-react"
import { entryTypes } from "@/lib/journal-constants"

interface WelcomeStateProps {
  onCreateNewEntry: (type: string) => void
}

export function WelcomeState({ onCreateNewEntry }: WelcomeStateProps) {
  return (
    <Card className="border-0 shadow-xl glass-card flex-1">
      <CardContent className="flex flex-col items-center justify-center h-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
          <PenTool className="h-10 w-10 text-white" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-800">Welcome to Your SAL Journal</h2>
          <p className="text-slate-600 max-w-md">
            Begin your Self-Action Leadership journey by creating your first journal entry. Choose from guided
            templates or start with free writing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          {entryTypes.slice(0, 4).map((type) => (
            <Button
              key={type.value}
              onClick={() => onCreateNewEntry(type.value)}
              variant="outline"
              className="glass-card border-0 hover:glow-effect transition-all duration-300 p-4 h-auto flex-col"
            >
              <type.icon className="h-6 w-6 mb-2 text-slate-600" />
              <span className="text-sm font-medium">{type.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 