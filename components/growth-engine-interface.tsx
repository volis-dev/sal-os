"use client"

import { useGrowth } from "@/hooks/useGrowth"
import { GrowthNavigation } from "@/components/growth/GrowthNavigation"
import { GrowthDashboard } from "@/components/growth/GrowthDashboard"
import { GravityManagement } from "@/components/growth/GravityManagement"
import { GravityEditor } from "@/components/growth/GravityEditor"
import { PlaceholderView } from "@/components/growth/PlaceholderView"

export function GrowthEngineInterface() {
  const {
    // State
    currentView,
    gravityItems,
    gravityScore,
    growthData,
    currentLevelData,
    recommendedLevelData,
    currentLevel,
    recommendedLevel,
    growthStats,
    isEditingGravity,
    newGravityItem,

    // Actions
    setCurrentView,
    updateCurrentLevel,
    updateGravityItemStatus,
    updateNewGravityItem,
    addGravityItem,
    openGravityEditor,
    closeGravityEditor,
  } = useGrowth()

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 bg-clip-text text-transparent tracking-tight">
          Growth Engine
        </h1>
        <p className="text-slate-600 text-lg font-medium">
          Track your existential growth through SAL principles and overcome limiting factors
        </p>
      </div>

      <GrowthNavigation currentView={currentView} onViewChange={setCurrentView} />

      {currentView === "dashboard" && (
        <GrowthDashboard
          currentLevelData={currentLevelData}
          recommendedLevelData={recommendedLevelData}
          currentLevel={currentLevel}
          recommendedLevel={recommendedLevel}
          growthData={growthData}
          growthStats={growthStats}
          gravityItems={gravityItems}
          onUpdateLevel={updateCurrentLevel}
        />
      )}

      {currentView === "gravity" && (
        <GravityManagement
          gravityItems={gravityItems}
          gravityScore={gravityScore}
          onUpdateGravityItemStatus={updateGravityItemStatus}
          onOpenGravityEditor={openGravityEditor}
        />
      )}

      {currentView === "goals" && <PlaceholderView type="goals" />}

      {currentView === "reviews" && <PlaceholderView type="reviews" />}

      {currentView === "insights" && <PlaceholderView type="insights" />}

      {/* Gravity Editor Modal */}
      {isEditingGravity && (
        <GravityEditor
          newGravityItem={newGravityItem}
          onUpdateNewGravityItem={updateNewGravityItem}
          onAddGravityItem={addGravityItem}
          onClose={closeGravityEditor}
        />
      )}
    </div>
  )
}
