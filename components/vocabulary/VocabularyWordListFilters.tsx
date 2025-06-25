"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { VocabularyWordListFiltersProps } from "@/types/vocabulary-wordlist"

export function VocabularyWordListFilters({
  searchTerm,
  filterMastery,
  filterSource,
  sortBy,
  masteryLevels,
  sourceOptions,
  onSearchChange,
  onFilterMasteryChange,
  onFilterSourceChange,
  onSortByChange,
}: VocabularyWordListFiltersProps) {
  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search words or definitions..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 glass-card border-0"
            />
          </div>
          <Select value={filterMastery} onValueChange={onFilterMasteryChange}>
            <SelectTrigger className="w-48 glass-card border-0">
              <SelectValue placeholder="Filter by mastery" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {masteryLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterSource} onValueChange={onFilterSourceChange}>
            <SelectTrigger className="w-48 glass-card border-0">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sourceOptions.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.icon} {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger className="w-48 glass-card border-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="word">Word A-Z</SelectItem>
              <SelectItem value="dateAdded">Date Added</SelectItem>
              <SelectItem value="masteryLevel">Mastery Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
} 