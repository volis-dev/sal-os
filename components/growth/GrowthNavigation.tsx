"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, AlertTriangle, Target, Calendar, Lightbulb } from "lucide-react"

interface GrowthNavigationProps {
  currentView: "dashboard" | "gravity" | "goals" | "reviews" | "insights"
  onViewChange: (view: "dashboard" | "gravity" | "goals" | "reviews" | "insights") => void
}

export function GrowthNavigation({ currentView, onViewChange }: GrowthNavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "gravity", label: "Existential Gravity", icon: AlertTriangle },
    { id: "goals", label: "Growth Goals", icon: Target },
    { id: "reviews", label: "Weekly Reviews", icon: Calendar },
    { id: "insights", label: "Insights", icon: Lightbulb },
  ] as const

  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              variant={currentView === tab.id ? "default" : "ghost"}
              className={`flex items-center gap-2 ${
                currentView === tab.id
                  ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white"
                  : "hover:glass-card"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 