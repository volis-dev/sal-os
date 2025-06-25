"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowUp, CheckCircle2, Plus } from "lucide-react"
import type { GravityItem, GravityCategory } from "@/types/growth"
import { gravityCategories } from "@/lib/growth-constants"

interface GravityManagementProps {
  gravityItems: GravityItem[]
  gravityScore: number
  onUpdateGravityItemStatus: (id: string, status: "active" | "improving" | "resolved") => void
  onOpenGravityEditor: (categoryId?: string) => void
}

export function GravityManagement({
  gravityItems,
  gravityScore,
  onUpdateGravityItemStatus,
  onOpenGravityEditor,
}: GravityManagementProps) {
  return (
    <>
      {/* Existential Gravity Header */}
      <Card className="border-0 shadow-2xl tornasol-gradient glow-effect text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <Star className="h-8 w-8" />
            Existential Gravity Assessment
          </CardTitle>
          <CardDescription className="text-white/80 font-medium">
            Identify and overcome the forces that hold you back from growth
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold mb-2">Gravity Score: {gravityScore}%</div>
              <div className="text-white/80 font-medium">
                {gravityScore < 30
                  ? "Low Gravity - Excellent Freedom!"
                  : gravityScore < 60
                    ? "Moderate Gravity - Room for Improvement"
                    : "High Gravity - Focus on Liberation"}
              </div>
            </div>
            <Button
              onClick={() => onOpenGravityEditor()}
              className="bg-white/90 text-purple-700 hover:bg-white font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Gravity Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gravity Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gravityCategories.map((category) => {
          const categoryItems = gravityItems.filter((item) => item.categoryId === category.id)
          const activeItems = categoryItems.filter((item) => item.status === "active")
          const resolvedItems = categoryItems.filter((item) => item.status === "resolved")

          return (
            <Card key={category.id} className="border-0 shadow-xl glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}
                  >
                    <category.icon className="h-5 w-5 text-white" />
                  </div>
                  {category.name}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Active Issues</span>
                  <span className="font-bold text-red-600">{activeItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Resolved</span>
                  <span className="font-bold text-green-600">{resolvedItems.length}</span>
                </div>

                {categoryItems.length > 0 ? (
                  <div className="space-y-2">
                    {categoryItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 glass-card rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-800 text-sm">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < item.severity ? "text-red-400 fill-current" : "text-slate-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge
                              className={
                                item.status === "resolved"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "improving"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {item.status === "active" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onUpdateGravityItemStatus(item.id, "improving")}
                              className="h-6 w-6 p-0"
                            >
                              <ArrowUp className="h-3 w-3 text-blue-500" />
                            </Button>
                          )}
                          {item.status === "improving" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onUpdateGravityItemStatus(item.id, "resolved")}
                              className="h-6 w-6 p-0"
                            >
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {categoryItems.length > 3 && (
                      <p className="text-xs text-slate-500 text-center">+{categoryItems.length - 3} more items</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <p className="text-sm">No items in this category</p>
                    <p className="text-xs mt-1">Examples: {category.examples.slice(0, 2).join(", ")}</p>
                  </div>
                )}

                <Button
                  onClick={() => onOpenGravityEditor(category.id)}
                  variant="outline"
                  size="sm"
                  className="w-full glass-card border-0"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Add {category.name}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
} 