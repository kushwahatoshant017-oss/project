"use client"

import { useState } from "react"
import { LocationSearch } from "@/components/weather/location-search"
import { HourlyChart } from "@/components/weather/hourly-chart"
import { useHourlyForecast } from "@/hooks/use-weather"
import { Card, CardContent, Skeleton } from "@/components/ui"
import { Clock } from "lucide-react"
import { PageTransition, FadeIn } from "@/components/ui/animated"
import type { GeocodingResult } from "@/services/weather"

export default function HourlyForecastPage() {
  const [location, setLocation] = useState<GeocodingResult | null>(null)
  const [units] = useState<"metric" | "imperial">("metric")
  const { data: forecast, isLoading, error } = useHourlyForecast(
    location?.latitude ?? null,
    location?.longitude ?? null,
    48,
    units
  )

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hourly Forecast</h1>
          <p className="text-muted-foreground">Hour-by-hour weather predictions for the next 48 hours</p>
        </div>
        <LocationSearch onSelect={setLocation} />
      </div>

      {!location && (
        <FadeIn>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Clock className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Search for a city</p>
              <p className="text-sm text-muted-foreground">View detailed hourly weather forecasts</p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {isLoading && <Skeleton className="h-80 w-full rounded-lg" />}

      {error && (
        <FadeIn>
          <Card>
            <CardContent className="py-8 text-center text-destructive">
              Failed to load forecast data.
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {forecast && location && <HourlyChart data={forecast} units={units} />}
    </PageTransition>
  )
}
