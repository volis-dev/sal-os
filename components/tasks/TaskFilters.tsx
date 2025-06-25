"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface TaskFiltersProps {
  searchTerm: string
  filterCategory: string
  filterStatus: string
  onSearchChange: (term: string) => void
  onFilterCategoryChange: (value: string) => void
  onFilterStatusChange: (value: string) => void
}

export function TaskFilters({
  searchTerm,
  filterCategory,
  filterStatus,
  onSearchChange,
  onFilterCategoryChange,
  onFilterStatusChange,
}: TaskFiltersProps) {
  const categoryConfig = {
    foundation: { icon: "🏗️", label: "Foundation" },
    knowledge: { icon: "📚", label: "Knowledge" },
    action: { icon: "⚡", label: "Action" },
    reflection: { icon: "🤔", label: "Reflection" },
    service: { icon: "🤝", label: "Service" },
    creation: { icon: "✨", label: "Creation" },
  }

  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 glass-card border-0"
            />
          </div>
          <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
            <SelectTrigger className="w-48 glass-card border-0">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.icon} {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={onFilterStatusChange}>
            <SelectTrigger className="w-48 glass-card border-0">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
} 