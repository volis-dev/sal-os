import { Heart, BookOpen, Lightbulb, Target, PenTool } from "lucide-react"
import type { EntryType } from "@/types/journal"

export const entryTypes: EntryType[] = [
  { value: "daily-reflection", label: "Daily Reflection", icon: Heart },
  { value: "chapter-response", label: "Chapter Response", icon: BookOpen },
  { value: "vocabulary-practice", label: "Vocabulary Practice", icon: Lightbulb },
  { value: "life-arena-planning", label: "Life Arena Planning", icon: Target },
  { value: "existential-blueprint", label: "Existential Blueprint Work", icon: PenTool },
  { value: "free-writing", label: "Free Writing", icon: PenTool },
]

export const entryTemplates: Record<string, string> = {
  "daily-reflection": `Today's Date: ${new Date().toLocaleDateString()}

What did I learn about myself today?

How did I apply SAL principles in my daily choices?

What challenged me today, and how did I respond?

What am I grateful for today?

Tomorrow, I will focus on:`,

  "chapter-response": `Book: 
Chapter: 

Key concepts I learned:

How this applies to my life:

Questions this chapter raised for me:

Action items from this reading:`,

  "vocabulary-practice": `New words learned today:

Word 1:
Definition:
Used in sentence:

Word 2:
Definition:
Used in sentence:

How these words connect to SAL principles:`,

  "life-arena-planning": `Life Arena: 

Current state (1-10 scale):

Vision for this arena:

Specific goals:

Action steps:

SAL principles that apply:`,

  "existential-blueprint": `Today's focus: Personal Mission/Values/Purpose

Current thoughts on my life's purpose:

Values that guide my decisions:

How I want to be remembered:

Steps to align my daily actions with my deeper purpose:`,

  "free-writing": `Today's thoughts and reflections:

`,
} 