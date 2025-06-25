"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Plus, X } from "lucide-react"
import type { LifeArena } from "@/types/life-arenas"

interface ActionsManagementProps {
  arena: LifeArena
  isEditing: boolean
  editingArena: LifeArena | null
  newAction: string
  onAddAction: () => void
  onRemoveAction: (index: number) => void
  onNewActionChange: (value: string) => void
}

export function ActionsManagement({
  arena,
  isEditing,
  editingArena,
  newAction,
  onAddAction,
  onRemoveAction,
  onNewActionChange,
}: ActionsManagementProps) {
  const currentActions = isEditing ? editingArena?.currentActions : arena.currentActions

  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          Current Actions
        </CardTitle>
        <CardDescription>What you're actively doing to improve this arena</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {currentActions?.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-3 glass-card rounded-xl">
              <span className="text-slate-700 font-medium">{action}</span>
              {isEditing && (
                <Button
                  onClick={() => onRemoveAction(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex gap-2">
            <Input
              value={newAction}
              onChange={(e) => onNewActionChange(e.target.value)}
              placeholder="Add new action..."
              className="glass-card border-0"
              onKeyPress={(e) => e.key === "Enter" && onAddAction()}
            />
            <Button onClick={onAddAction} className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 