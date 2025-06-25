"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X } from "lucide-react"
import type { NewGravityItem } from "@/types/growth"
import { gravityCategories } from "@/lib/growth-constants"

interface GravityEditorProps {
  newGravityItem: NewGravityItem
  onUpdateNewGravityItem: (field: keyof NewGravityItem, value: string | number) => void
  onAddGravityItem: () => void
  onClose: () => void
}

export function GravityEditor({
  newGravityItem,
  onUpdateNewGravityItem,
  onAddGravityItem,
  onClose,
}: GravityEditorProps) {
  return (
    <Card className="border-0 shadow-2xl glass-card fixed inset-4 z-50 overflow-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Add Existential Gravity Item</CardTitle>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Identify something that's holding you back from growth</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Category</label>
          <Select
            value={newGravityItem.categoryId}
            onValueChange={(value) => onUpdateNewGravityItem("categoryId", value)}
          >
            <SelectTrigger className="glass-card border-0">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {gravityCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Name *</label>
          <Input
            value={newGravityItem.name}
            onChange={(e) => onUpdateNewGravityItem("name", e.target.value)}
            placeholder="e.g., Procrastination, Fear of failure"
            className="glass-card border-0"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Description</label>
          <Textarea
            value={newGravityItem.description}
            onChange={(e) => onUpdateNewGravityItem("description", e.target.value)}
            placeholder="Describe how this affects you..."
            className="glass-card border-0"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Severity (1-5): {newGravityItem.severity}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={newGravityItem.severity}
            onChange={(e) => onUpdateNewGravityItem("severity", Number.parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Minor</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Impact on Growth</label>
          <Textarea
            value={newGravityItem.impact}
            onChange={(e) => onUpdateNewGravityItem("impact", e.target.value)}
            placeholder="How does this limit your potential?"
            className="glass-card border-0"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Action Plan</label>
          <Textarea
            value={newGravityItem.actionPlan}
            onChange={(e) => onUpdateNewGravityItem("actionPlan", e.target.value)}
            placeholder="What steps will you take to address this?"
            className="glass-card border-0"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onAddGravityItem}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white"
            disabled={!newGravityItem.name.trim() || !newGravityItem.categoryId}
          >
            <Save className="mr-2 h-4 w-4" />
            Add Gravity Item
          </Button>
          <Button onClick={onClose} variant="outline" className="glass-card border-0">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 