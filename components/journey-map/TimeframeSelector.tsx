"use client"

interface TimeframeSelectorProps {
  value: "week" | "month" | "all"
  onChange: (value: "week" | "month" | "all") => void
}

export function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  return (
    <div className="flex gap-2 items-center">
      {(["week", "month", "all"] as const).map((tf) => (
        <button
          key={tf}
          className={`px-4 py-1 rounded-full font-semibold text-sm transition-all duration-200 ${
            value === tf
              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
          onClick={() => onChange(tf)}
          aria-pressed={value === tf}
        >
          {tf === "week" ? "This Week" : tf === "month" ? "This Month" : "All Time"}
        </button>
      ))}
    </div>
  )
} 