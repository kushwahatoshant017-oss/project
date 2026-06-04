"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui"
import { searchLocation, type GeocodingResult } from "@/services/weather"
import { Search, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationSearchProps {
  onSelect: (location: GeocodingResult) => void
}

export function LocationSearch({ onSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (query.length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    timer.current = setTimeout(async () => {
      const res = await searchLocation(query)
      setResults(res)
      setOpen(res.length > 0)
      setLoading(false)
    }, 300)
  }, [query])

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9"
      />
      {open && (
        <div className="absolute top-full mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          {loading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">Searching...</div>
          ) : (
            results.map((r) => (
              <button
                key={r.id}
                onClick={() => { onSelect(r); setQuery(`${r.name}, ${r.country}`); setOpen(false) }}
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
              >
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="font-medium">{r.name}</span>
                {r.admin1 && <span className="text-muted-foreground">{r.admin1},</span>}
                <span className="text-muted-foreground">{r.country}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
