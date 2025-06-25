"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Download, Upload } from "lucide-react"
import type { QuickActionsProps } from "@/types/vocabulary-dashboard"

export function QuickActions({ onNavigateToAdd, onNavigateToWordList }: QuickActionsProps) {
  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onNavigateToAdd}
            className="bg-gradient-to-r from-purple-400 to-blue-500 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Word
          </Button>
          <Button
            onClick={onNavigateToWordList}
            variant="outline"
            className="glass-card border-0"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Library
          </Button>
          <Button variant="outline" className="glass-card border-0">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="glass-card border-0">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 