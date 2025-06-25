"use client"

import { useLifeArenas } from "@/hooks/useLifeArenas"
import { LifeArenasDashboard } from "@/components/life-arenas/LifeArenasDashboard"
import { ArenaDetail } from "@/components/life-arenas/ArenaDetail"
import { ActionsManagement } from "@/components/life-arenas/ActionsManagement"
import { MilestonesManagement } from "@/components/life-arenas/MilestonesManagement"

export function LifeArenasInterface() {
  const {
    // State
    arenas,
    selectedArena,
    isEditing,
    editingArena,
    newAction,
    newMilestone,
    lifeArenaStats,

    // Actions
    selectArena,
    goBackToOverview,
    startEditing,
    saveChanges,
    cancelEditing,
    addAction,
    removeAction,
    addMilestone,
    toggleMilestone,
    updateNewMilestone,
    setNewAction,
    setEditingArena,

    // Utilities
    getArenaProgress,
  } = useLifeArenas()

  const handleUpdateEditingArena = (updates: Partial<typeof editingArena>) => {
    if (editingArena) {
      // Type assertion needed because we're updating partial fields
      setEditingArena({ ...editingArena, ...updates } as typeof editingArena)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {!selectedArena ? (
        <>
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 bg-clip-text text-transparent tracking-tight">
              Life Arenas
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Develop as an "Existential Octathlete" - excelling across all 8 key areas of life
            </p>
          </div>

          <LifeArenasDashboard
            arenas={arenas}
            lifeArenaStats={lifeArenaStats}
            getArenaProgress={getArenaProgress}
            onArenaSelect={selectArena}
          />
        </>
      ) : (
        <>
          <ArenaDetail
            arena={selectedArena}
            isEditing={isEditing}
            editingArena={editingArena}
            onBack={goBackToOverview}
            onStartEditing={startEditing}
            onSaveChanges={saveChanges}
            onCancelEditing={cancelEditing}
            onUpdateEditingArena={handleUpdateEditingArena}
          />

          <ActionsManagement
            arena={selectedArena}
            isEditing={isEditing}
            editingArena={editingArena}
            newAction={newAction}
            onAddAction={addAction}
            onRemoveAction={removeAction}
            onNewActionChange={setNewAction}
          />

          <MilestonesManagement
            arena={selectedArena}
            isEditing={isEditing}
            editingArena={editingArena}
            newMilestone={newMilestone}
            onAddMilestone={addMilestone}
            onToggleMilestone={toggleMilestone}
            onUpdateNewMilestone={updateNewMilestone}
          />
        </>
      )}
    </div>
  )
}
