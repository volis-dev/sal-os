"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, CheckCircle2, Circle } from "lucide-react"
import type { LifeArena, NewMilestone } from "@/types/life-arenas"

interface MilestonesManagementProps {
  arena: LifeArena
  isEditing: boolean
  editingArena: LifeArena | null
  newMilestone: NewMilestone
  onAddMilestone: () => void
  onToggleMilestone: (milestoneId: string) => void
  onUpdateNewMilestone: (field: keyof NewMilestone, value: string) => void
}

export function MilestonesManagement({
  arena,
  isEditing,
  editingArena,
  newMilestone,
  onAddMilestone,
  onToggleMilestone,
  onUpdateNewMilestone,
}: MilestonesManagementProps) {
  const currentMilestones = isEditing ? editingArena?.milestones : arena.milestones

  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-blue-500" />
          Milestones
        </CardTitle>
        <CardDescription>Key achievements and goals for this arena</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {currentMilestones?.map((milestone) => (
            <div key={milestone.id} className="flex items-start gap-3 p-4 glass-card rounded-xl">
              <button
                onClick={() => isEditing && onToggleMilestone(milestone.id)}
                className={`mt-1 ${isEditing ? "cursor-pointer" : "cursor-default"}`}
              >
                {milestone.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <h4
                  className={`font-semibold ${
                    milestone.completed ? "text-green-700 line-through" : "text-slate-800"
                  }`}
                >
                  {milestone.title}
                </h4>
                <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                  {milestone.completed && milestone.completedDate && (
                    <span className="text-green-600">
                      Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="space-y-3 p-4 border-2 border-dashed border-slate-200 rounded-xl">
            <h4 className="font-semibold text-slate-700">Add New Milestone</h4>
            <div className="space-y-2">
              <Input
                value={newMilestone.title}
                onChange={(e) => onUpdateNewMilestone("title", e.target.value)}
                placeholder="Milestone title..."
                className="glass-card border-0"
              />
              <Textarea
                value={newMilestone.description}
                onChange={(e) => onUpdateNewMilestone("description", e.target.value)}
                placeholder="Description..."
                className="glass-card border-0"
              />
              <Input
                type="date"
                value={newMilestone.targetDate}
                onChange={(e) => onUpdateNewMilestone("targetDate", e.target.value)}
                className="glass-card border-0"
              />
              <Button onClick={onAddMilestone} className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 