"use client"

import { useState } from "react"
import { useFavorites, useCreateFavorite, useDeleteFavorite } from "@/hooks/use-favorites"
import { searchLocation } from "@/services/weather"
import { Card, CardContent, Button, Skeleton } from "@/components/ui"
import { Heart, MapPin, Trash2, Plus, Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { PageTransition, FadeIn, StaggerGrid, StaggerItem } from "@/components/ui/animated"
import type { GeocodingResult } from "@/services/weather"

function AddFavorite({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<GeocodingResult | null>(null)
  const [label, setLabel] = useState("")
  const create = useCreateFavorite()

  const { data: results } = useQuery({
    queryKey: ["geocode", query],
    queryFn: () => searchLocation(query),
    enabled: query.length >= 2,
  })

  const handleAdd = () => {
    if (!selected) return
    create.mutate(
      { latitude: selected.latitude, longitude: selected.longitude, locationName: selected.name, label: label || undefined },
      { onSuccess: () => { setSelected(null); setQuery(""); setLabel(""); onClose() } }
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      {results && results.length > 0 && (
        <div className="space-y-1">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent",
                selected?.id === r.id && "bg-accent"
              )}
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{r.name}, {r.admin1 ? `${r.admin1}, ` : ""}{r.country}</span>
            </button>
          ))}
        </div>
      )}
      {selected && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Selected: {selected.name}</p>
          <Input placeholder="Label (optional)" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Button onClick={handleAdd} className="w-full" disabled={create.isPending}>
            {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add to Favorites
          </Button>
        </div>
      )}
    </div>
  )
}

export default function FavoritesPage() {
  const { data: favorites, isLoading, error } = useFavorites()
  const deleteFav = useDeleteFavorite()
  const [adding, setAdding] = useState(false)

  return (
    <PageTransition className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Favorites</h1>
          <p className="text-muted-foreground">Your saved locations</p>
        </div>
        <Button onClick={() => setAdding(!adding)}>
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      {adding && (
        <FadeIn>
          <Card>
            <CardContent className="pt-6">
              <AddFavorite onClose={() => setAdding(false)} />
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      )}

      {error && (
        <FadeIn>
          <Card>
            <CardContent className="py-8 text-center text-destructive">Failed to load favorites.</CardContent>
          </Card>
        </FadeIn>
      )}

      {favorites && favorites.length === 0 && !adding && (
        <FadeIn>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Heart className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">No favorites yet</p>
              <p className="text-sm text-muted-foreground">Click "Add Location" to save a city</p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {favorites && favorites.length > 0 && (
        <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <StaggerItem key={fav.id}>
              <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="flex items-start justify-between pt-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-medium">{fav.label || fav.locationName || "Saved Location"}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {fav.latitude.toFixed(4)}, {fav.longitude.toFixed(4)}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteFav.mutate(fav.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </PageTransition>
  )
}
