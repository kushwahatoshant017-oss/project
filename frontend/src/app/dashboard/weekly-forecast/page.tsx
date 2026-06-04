"use client"

import { useState } from "react"
import { LocationSearch } from "@/components/weather/location-search"
import { WeeklyChart } from "@/components/weather/weekly-chart"
import { useDailyForecast } from "@/hooks/use-weather"
import { Card, CardContent, Skeleton } from "@/components/ui"
import { CalendarDays } from "lucide-react"
import { PageTransition, FadeIn } from "@/components/ui/animated"
import type { GeocodingResult } from "@/services/weather"

export default function WeeklyForecastPage() {
  const [location, setLocation] = useState<GeocodingResult | null>(null)
  const [units] = useState<"metric" | "imperial">("metric")
  const { data: forecast, isLoading, error } = useDailyForecast(
    location?.latitude ?? null,
    location?.longitude ?? null,
    7,
    units
  )

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weekly Forecast</h1>
          <p className="text-muted-foreground">7-day weather outlook for your location</p>
        </div>
        <LocationSearch onSelect={setLocation} />
      </div>

      {!location && (
        <FadeIn>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CalendarDays className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Search for a city</p>
              <p className="text-sm text-muted-foreground">View the weekly weather forecast</p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {isLoading && <Skeleton className="h-96 w-full rounded-lg" />}

      {error && (
        <FadeIn>
          <Card>
            <CardContent className="py-8 text-center text-destructive">
              Failed to load forecast data.
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {forecast && location && <WeeklyChart data={forecast} units={units} />}
    </PageTransition>
  )
}
