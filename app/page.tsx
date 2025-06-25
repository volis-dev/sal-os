"use client"

import { useState, useEffect } from "react"
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'
import {
  BookOpen,
  CheckCircle2,
  Home as HomeIcon,
  NewspaperIcon as Journal,
  Library,
  Map,
  PenTool,
  Settings as SettingsIcon,
  Target,
  TrendingUp,
  Quote,
  ArrowRight,
  Lightbulb,
  Sparkles,
  Brain,
  Users,
  Award,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { GlobalDashboard } from "@/components/GlobalDashboard"
import { Settings } from "@/components/Settings"
import { Onboarding } from "@/components/Onboarding"
import { JournalInterface } from "@/components/journal-interface"
import { ModulesInterface } from "@/components/modules-interface"
import { TasksInterface } from "@/components/tasks-interface"
import { LibraryInterface } from "@/components/library-interface"
import { LifeArenasInterface } from "@/components/life-arenas-interface"
import { JourneyMapInterface } from "@/components/journey-map-interface"
import { GrowthEngineInterface } from "@/components/growth-engine-interface"

export default function Home() {
  const { isAuthenticated, isLoading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("Dashboard")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem("sal-os-onboarding-completed")
    if (!onboardingCompleted) {
      setShowOnboarding(true)
    }
  }, [])

  // Show loading state while auth is initializing
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <p className="text-slate-600">Loading SAL OS...</p>
        </div>
      </div>
    )
  }

  // Early return if not authenticated - ADD THIS
  if (!isLoading && !isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.replace('/login')
    }
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar 
          setActiveTab={setActiveTab} 
          currentTab={activeTab} 
          onSignOut={signOut}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {activeTab === "Dashboard" && <GlobalDashboard onNavigateToModule={setActiveTab} />}
            {activeTab === "Settings" && <Settings onNavigateToDashboard={() => setActiveTab("Dashboard")} />}
            {activeTab === "Journal" && <JournalInterface />}
            {activeTab === "Modules" && <ModulesInterface />}
            {activeTab === "Tasks" && <TasksInterface />}
            {activeTab === "Library" && <LibraryInterface />}
            {activeTab === "Life Arenas" && <LifeArenasInterface />}
            {activeTab === "Journey Map" && <JourneyMapInterface setActiveTab={setActiveTab} />}
            {activeTab === "Growth Engine" && <GrowthEngineInterface />}
          </div>
        </main>
      </div>

      {showOnboarding && (
        <Onboarding onComplete={() => {
          setShowOnboarding(false)
          localStorage.setItem("sal-os-onboarding-completed", "true")
        }} />
      )}
    </SidebarProvider>
  )
}

function AppSidebar({ 
  setActiveTab, 
  currentTab, 
  onSignOut 
}: { 
  setActiveTab: (tab: string) => void; 
  currentTab: string;
  onSignOut: () => void;
}) {
  const navigationItems = [
    { title: "Dashboard", icon: HomeIcon, url: "#", isActive: currentTab === "Dashboard" },
    { title: "Journey Map", icon: Map, url: "#", isActive: currentTab === "Journey Map" },
    { title: "Modules", icon: BookOpen, url: "#", isActive: currentTab === "Modules" },
    { title: "Journal", icon: Journal, url: "#", isActive: currentTab === "Journal" },
    { title: "Life Arenas", icon: Target, url: "#", isActive: currentTab === "Life Arenas" },
    { title: "Growth Engine", icon: TrendingUp, url: "#", isActive: currentTab === "Growth Engine" },
    { title: "Tasks", icon: CheckCircle2, url: "#", isActive: currentTab === "Tasks" },
    { title: "Library", icon: Library, url: "#", isActive: currentTab === "Library" },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">SAL OS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.title)}
                    className={item.isActive ? "bg-blue-100 text-blue-700" : ""}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarInset>
        <div className="p-4 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("Settings")}
            className="w-full"
          >
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </SidebarInset>
    </Sidebar>
  )
}