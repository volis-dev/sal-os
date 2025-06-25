"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Quote, CheckCircle2, Circle } from "lucide-react"

interface Mantra {
  text: string
  category: string
  memorized: boolean
}

interface SALMantrasProps {
  mantras: Mantra[]
}

export function SALMantras({ mantras }: SALMantrasProps) {
  const memorizedCount = mantras.filter((m) => m.memorized).length

  return (
    <Card className="border-0 shadow-xl glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
          <Quote className="h-6 w-6 text-indigo-500" />
          SAL Mantras
        </CardTitle>
        <CardDescription className="font-medium">Memorize key principles for daily practice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-700">Memorized</span>
          <Badge className="glass-card font-semibold px-3 py-1">
            {memorizedCount}/{mantras.length}
          </Badge>
        </div>

        <div className="space-y-4">
          {mantras.slice(0, 2).map((mantra, index) => (
            <div key={index} className="space-y-2 p-3 glass-card rounded-xl">
              <div className="flex items-start gap-3">
                {mantra.memorized ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="space-y-1">
                  <p className="text-sm text-slate-700 font-medium italic leading-relaxed">"{mantra.text}"</p>
                  <Badge variant="outline" className="text-xs">
                    {mantra.category}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full text-indigo-600 font-semibold hover:glass-card rounded-xl transition-all duration-300"
        >
          Review All Mantras
        </Button>
      </CardContent>
    </Card>
  )
}
