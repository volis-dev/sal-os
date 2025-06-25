"use client"

import { Target, Calendar, Lightbulb } from "lucide-react"

interface PlaceholderViewProps {
  type: "goals" | "reviews" | "insights"
}

export function PlaceholderView({ type }: PlaceholderViewProps) {
  const config = {
    goals: {
      icon: Target,
      title: "Growth Goals",
      description: "Coming soon - Set and track SMART goals for each life arena",
    },
    reviews: {
      icon: Calendar,
      title: "Weekly Reviews",
      description: "Coming soon - Structured weekly reflection and planning",
    },
    insights: {
      icon: Lightbulb,
      title: "Growth Insights",
      description: "Coming soon - AI-powered insights based on your SAL journey",
    },
  }

  const { icon: Icon, title, description } = config[type]

  return (
    <div className="text-center py-20">
      <Icon className="h-12 w-12 mx-auto text-slate-400 mb-4" />
      <h3 className="text-lg font-semibold text-slate-600 mb-2">{title}</h3>
      <p className="text-slate-500">{description}</p>
    </div>
  )
} 