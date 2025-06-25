"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, PenTool, Target, Brain, ArrowRight, ArrowLeft, Check, LucideIcon } from "lucide-react"
import { useState } from "react"

interface OnboardingProps {
  onComplete: () => void
}

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: LucideIcon
  color: string
  bgColor: string
  features?: string[]
  modules?: Array<{
    name: string
    icon: LucideIcon
    description: string
  }>
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to SAL OS",
    description: "Your personal development journey starts here. SAL OS is designed to support your growth through the Systematic Approach to Life methodology.",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    features: [
      "Track your reading progress through SAL books",
      "Journal your thoughts and reflections",
      "Complete structured tasks and challenges",
      "Build your vocabulary library"
    ]
  },
  {
    id: 2,
    title: "Your Journey Modules",
    description: "Explore the different modules that make up your SAL journey. Each module is designed to support a specific aspect of your development.",
    icon: Target,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
    modules: [
      { name: "Journal", icon: PenTool, description: "Reflect and document your journey" },
      { name: "Reading", icon: BookOpen, description: "Study SAL books and track progress" },
      { name: "Tasks", icon: Target, description: "Complete structured challenges" },
      { name: "Vocabulary", icon: Brain, description: "Build your knowledge base" }
    ]
  },
  {
    id: 3,
    title: "Ready to Begin",
    description: "Your data is stored locally in your browser, ensuring complete privacy. You can export your data anytime or start fresh if needed.",
    icon: Check,
    color: "text-green-500",
    bgColor: "bg-green-500",
    features: [
      "100% local storage - your data stays private",
      "Export and backup your progress",
      "Track achievements and milestones",
      "Start your journey at your own pace"
    ]
  }
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = steps[currentStep]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      localStorage.setItem("sal-os-onboarding-complete", "true")
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("sal-os-onboarding-complete", "true")
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="border-0 shadow-2xl glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center`}>
              <step.icon className={`h-8 w-8 text-white`} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">{step.title}</CardTitle>
          <CardDescription className="text-slate-600 text-base">
            {step.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step Content */}
          {currentStep === 0 && step.features && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">What you can do:</h3>
              <ul className="space-y-2">
                {step.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentStep === 1 && step.modules && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Available Modules:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {step.modules.map((module, index) => (
                  <div key={index} className="p-4 glass-card rounded-xl">
                    <div className="flex items-center gap-3">
                      <module.icon className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-semibold text-slate-800">{module.name}</h4>
                        <p className="text-sm text-slate-500">{module.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && step.features && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">Key Features:</h3>
              <ul className="space-y-2">
                {step.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep ? "bg-blue-500" : "bg-slate-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="hover:glass-card"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip} className="hover:glass-card">
                Skip
              </Button>
              <Button onClick={handleNext} className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 