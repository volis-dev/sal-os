"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Settings as SettingsIcon, Calendar, Clock, Download, Upload } from "lucide-react"
import { useState } from "react"
import { safeGetItem, safeSetItem, clearAllSALData, exportAllData, importAllData } from "@/lib/storage-utils"

interface SettingsProps {
  onNavigateToDashboard: () => void
}

export function Settings({ onNavigateToDashboard }: SettingsProps) {
  const [startDate, setStartDate] = useState(() => {
    const stored = safeGetItem("sal-os-start-date")
    return stored || new Date().toISOString().split('T')[0]
  })
  const [timezone, setTimezone] = useState(() => {
    const stored = safeGetItem("sal-os-timezone")
    return stored || Intl.DateTimeFormat().resolvedOptions().timeZone
  })
  const [notifications, setNotifications] = useState(() => {
    const stored = safeGetItem("sal-os-notifications")
    return stored === "true"
  })
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleSaveSettings = () => {
    const success = safeSetItem("sal-os-start-date", startDate) &&
                   safeSetItem("sal-os-timezone", timezone) &&
                   safeSetItem("sal-os-notifications", notifications.toString())
    
    if (success) {
      alert("Settings saved successfully!")
    } else {
      alert("Error saving settings. Please try again.")
    }
  }

  const handleResetAllData = () => {
    if (confirm("Are you absolutely sure? This action cannot be undone. This will permanently delete all your data.")) {
      const success = clearAllSALData()
      if (success) {
        window.location.reload()
      } else {
        alert("Error clearing data. Please try again.")
      }
    }
  }

  const handleExportData = () => {
    setIsExporting(true)
    try {
      const data = exportAllData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sal-os-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Error exporting data. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        const success = importAllData(data)
        if (success) {
          window.location.reload()
        } else {
          alert("Error importing data. Some data may not have been imported correctly.")
        }
      } catch (error) {
        console.error("Error importing data:", error)
        alert("Error importing data. Please check the file format.")
      } finally {
        setIsImporting(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-600">Configure your SAL OS experience</p>
        </div>
        <Button
          variant="ghost"
          onClick={onNavigateToDashboard}
          className="hover:glass-card rounded-xl transition-all duration-300"
        >
          ← Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="border-0 shadow-xl glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <SettingsIcon className="h-6 w-6 text-blue-500" />
              General Settings
            </CardTitle>
            <CardDescription>Basic configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="start-date" className="text-sm font-medium text-slate-700">Journey Start Date</label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="glass-card border-0"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="timezone" className="text-sm font-medium text-slate-700">Timezone</label>
              <Input
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="glass-card border-0"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-slate-700">Notifications</label>
                <p className="text-sm text-slate-500">Receive daily reminders</p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-0 shadow-xl glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Download className="h-6 w-6 text-green-500" />
              Data Management
            </CardTitle>
            <CardDescription>Backup, restore, or reset your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="export" className="text-sm font-medium text-slate-700">Export Data</label>
              <Button 
                onClick={handleExportData} 
                variant="outline" 
                className="w-full glass-card border-0"
                disabled={isExporting}
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export All Data"}
              </Button>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="import" className="text-sm font-medium text-slate-700">Import Data</label>
              <Input
                id="import"
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="glass-card border-0"
                disabled={isImporting}
              />
              {isImporting && <p className="text-sm text-slate-500">Importing data...</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Reset All Data</label>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={handleResetAllData}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Reset All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About */}
      <Card className="border-0 shadow-xl glass-card">
        <CardHeader>
          <CardTitle>About SAL OS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-slate-600">
              SAL OS is a personal development platform designed to support your journey through 
              the Systematic Approach to Life (SAL) methodology.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-slate-800">Version</h4>
                <p className="text-slate-600">1.0.0</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Storage</h4>
                <p className="text-slate-600">Local Browser Storage</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">Privacy</h4>
                <p className="text-slate-600">100% Local - No Data Sent</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 