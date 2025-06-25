"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, PenTool } from "lucide-react"
import type { JournalEntry } from "@/types/journal"
import { entryTypes } from "@/lib/journal-constants"

interface JournalSidebarProps {
  searchTerm: string
  filterType: string
  filteredEntries: JournalEntry[]
  currentEntry: JournalEntry | null
  onSearchChange: (value: string) => void
  onFilterChange: (value: string) => void
  onCreateNewEntry: () => void
  onSelectEntry: (entry: JournalEntry) => void
}

export function JournalSidebar({
  searchTerm,
  filterType,
  filteredEntries,
  currentEntry,
  onSearchChange,
  onFilterChange,
  onCreateNewEntry,
  onSelectEntry,
}: JournalSidebarProps) {
  return (
    <div className="w-80 flex flex-col space-y-4">
      {/* Search and Filter */}
      <Card className="border-0 shadow-xl glass-card">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 glass-card border-0"
            />
          </div>

          <Select value={filterType} onValueChange={onFilterChange}>
            <SelectTrigger className="glass-card border-0">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entries</SelectItem>
              {entryTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* New Entry Button */}
      <div className="flex gap-2">
        <Button
          onClick={onCreateNewEntry}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>

      {/* Entry List */}
      <Card className="border-0 shadow-xl glass-card flex-1 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-slate-800">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto">
          <div className="space-y-2 p-4">
            {filteredEntries.map((entry) => {
              const entryType = entryTypes.find((t) => t.value === entry.type)
              const EntryIcon = entryType?.icon || PenTool

              return (
                <button
                  key={entry.id}
                  onClick={() => onSelectEntry(entry)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                    currentEntry?.id === entry.id ? "glass-card glow-effect" : "hover:glass-card"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <EntryIcon className="h-4 w-4 text-slate-500 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 truncate text-sm">{entry.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-400 mt-1">{entry.wordCount} words</p>
                    </div>
                  </div>
                </button>
              )
            })}

            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <PenTool className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No entries found</p>
                <p className="text-xs mt-1">Start writing to see your entries here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 