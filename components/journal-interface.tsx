"use client"

import { useJournal } from "@/hooks/useJournal"
import { JournalStats } from "@/components/journal/JournalStats"
import { JournalSidebar } from "@/components/journal/JournalSidebar"
import { JournalEditor } from "@/components/journal/JournalEditor"
import { WelcomeState } from "@/components/journal/WelcomeState"

export function JournalInterface() {
  const {
    // State
    currentEntry,
    isEditing,
    searchTerm,
    filterType,
    selectedDate,
    autoSaveStatus,
    filteredEntries,
    journalStats,

    // Refs
    textareaRef,

    // Actions
    setSearchTerm,
    setFilterType,
    setSelectedDate,
    createNewEntry,
    saveEntry,
    selectEntry,
    updateCurrentEntry,
    setIsEditing,
  } = useJournal()

  return (
    <div className="container mx-auto p-6 h-full">
      <div className="flex gap-6 h-full">
        {/* Left Sidebar - Entry List */}
        <div className="w-80 flex flex-col space-y-4">
          <JournalStats stats={journalStats} />
          
          <JournalSidebar
            searchTerm={searchTerm}
            filterType={filterType}
            filteredEntries={filteredEntries}
            currentEntry={currentEntry}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterType}
            onCreateNewEntry={() => createNewEntry()}
            onSelectEntry={selectEntry}
          />
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col space-y-4">
          {currentEntry ? (
            <JournalEditor
              currentEntry={currentEntry}
              autoSaveStatus={autoSaveStatus}
              textareaRef={textareaRef}
              onUpdateEntry={updateCurrentEntry}
              onSaveEntry={saveEntry}
              onSetEditing={setIsEditing}
            />
          ) : (
            <WelcomeState onCreateNewEntry={createNewEntry} />
          )}
        </div>
      </div>
    </div>
  )
}
