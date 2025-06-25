"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit3, Save, X, Target, Zap } from "lucide-react"
import type { LifeArena } from "@/types/life-arenas"

interface ArenaDetailProps {
  arena: LifeArena
  isEditing: boolean
  editingArena: LifeArena | null
  onBack: () => void
  onStartEditing: (arena: LifeArena) => void
  onSaveChanges: () => void
  onCancelEditing: () => void
  onUpdateEditingArena: (updates: Partial<LifeArena>) => void
}

export function ArenaDetail({
  arena,
  isEditing,
  editingArena,
  onBack,
  onStartEditing,
  onSaveChanges,
  onCancelEditing,
  onUpdateEditingArena,
}: ArenaDetailProps) {
  const currentArena = isEditing ? editingArena : arena
  const currentScore = currentArena?.currentScore || 1
  const targetScore = currentArena?.targetScore || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="hover:glass-card rounded-xl transition-all duration-300"
        >
          ← Back to All Arenas
        </Button>
        <div className="flex gap-2">
          {!isEditing && (
            <Button
              onClick={() => onStartEditing(arena)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Plan & Edit
            </Button>
          )}
          {isEditing && (
            <>
              <Button
                onClick={onSaveChanges}
                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-xl"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button onClick={onCancelEditing} variant="outline" className="glass-card border-0">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Arena Header Card */}
      <Card className="border-0 shadow-xl glass-card">
        <div className={`h-32 bg-gradient-to-br ${arena.gradient} rounded-t-xl relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white text-3xl font-bold">{arena.name}</h1>
                <p className="text-white/80 text-lg font-medium">{arena.description}</p>
              </div>
              <div className="text-right">
                <div className="text-white text-4xl font-bold">{currentScore}/10</div>
                <div className="text-white/80 text-sm">Current Score</div>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-600">Current Score</span>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={currentScore}
                  onChange={(e) =>
                    onUpdateEditingArena({ currentScore: Number.parseInt(e.target.value) || 1 })
                  }
                  className="glass-card border-0"
                />
              ) : (
                <div className="text-2xl font-bold text-slate-800">{arena.currentScore}/10</div>
              )}
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-600">Target Score</span>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={targetScore}
                  onChange={(e) =>
                    onUpdateEditingArena({ targetScore: Number.parseInt(e.target.value) || 1 })
                  }
                  className="glass-card border-0"
                />
              ) : (
                <div className="text-2xl font-bold text-slate-800">{arena.targetScore}/10</div>
              )}
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-600">Progress</span>
              <div className="text-2xl font-bold text-slate-800">
                {Math.round((currentScore / 10) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vision Statement */}
        <Card className="border-0 shadow-xl glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Target className="h-5 w-5 text-purple-500" />
              Vision Statement
            </CardTitle>
            <CardDescription>Your ideal future state for this life arena</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={currentArena?.visionStatement || ""}
                onChange={(e) => onUpdateEditingArena({ visionStatement: e.target.value })}
                className="glass-card border-0 min-h-[120px]"
                placeholder="Describe your vision for this life arena..."
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{arena.visionStatement}</p>
            )}
          </CardContent>
        </Card>

        {/* SAL Principle */}
        <Card className="border-0 shadow-xl glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-amber-500" />
              SAL Principle
            </CardTitle>
            <CardDescription>Related Self-Action Leadership principle</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed italic">"{arena.salPrinciple}"</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 