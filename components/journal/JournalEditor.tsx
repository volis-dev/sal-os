"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Clock } from "lucide-react"
import type { JournalEntry, AutoSaveStatus } from "@/types/journal"
import { entryTypes } from "@/lib/journal-constants"

interface JournalEditorProps {
  currentEntry: JournalEntry
  autoSaveStatus: AutoSaveStatus
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onUpdateEntry: (field: keyof JournalEntry, value: any) => void
  onSaveEntry: () => void
  onSetEditing: (editing: boolean) => void
}

export function JournalEditor({
  currentEntry,
  autoSaveStatus,
  textareaRef,
  onUpdateEntry,
  onSaveEntry,
  onSetEditing,
}: JournalEditorProps) {
  return (
    <>
      {/* Editor Header */}
      <Card className="border-0 shadow-xl glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Input
                value={currentEntry.title}
                onChange={(e) => onUpdateEntry("title", e.target.value)}
                className="text-lg font-semibold glass-card border-0 flex-1"
                placeholder="Entry title..."
              />

              <Select value={currentEntry.type} onValueChange={(value) => onUpdateEntry("type", value)}>
                <SelectTrigger className="w-48 glass-card border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span
                  className={`font-medium ${
                    autoSaveStatus === "saved"
                      ? "text-green-600"
                      : autoSaveStatus === "saving"
                        ? "text-amber-600"
                        : "text-slate-500"
                  }`}
                >
                  {autoSaveStatus === "saved" ? "Saved" : autoSaveStatus === "saving" ? "Saving..." : "Unsaved"}
                </span>
              </div>

              <Button
                onClick={onSaveEntry}
                size="sm"
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-xl"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
            <span>{new Date(currentEntry.date).toLocaleDateString()}</span>
            <span>•</span>
            <span>{currentEntry.wordCount} words</span>
            <span>•</span>
            <span>{Math.ceil(currentEntry.wordCount / 250)} pages</span>
          </div>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card className="border-0 shadow-xl glass-card flex-1">
        <CardContent className="p-6 h-full">
          <Textarea
            ref={textareaRef}
            value={currentEntry.content}
            onChange={(e) => {
              onUpdateEntry("content", e.target.value)
              onSetEditing(true)
            }}
            placeholder="Start writing your thoughts..."
            className="w-full h-full resize-none border-0 bg-transparent text-slate-700 leading-relaxed text-base focus:ring-0 focus:outline-none"
            style={{ minHeight: "500px" }}
          />
        </CardContent>
      </Card>
    </>
  )
} 