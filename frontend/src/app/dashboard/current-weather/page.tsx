"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { LocationSearch } from "@/components/weather/location-search"
import { WeatherCard } from "@/components/weather/weather-card"
import { useCurrentWeather, useCurrentAQI } from "@/hooks/use-weather"
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/components/ui"
import { MapPin, Wind } from "lucide-react"
import { PageTransition, FadeIn } from "@/components/ui/animated"
import type { GeocodingResult } from "@/services/weather"

const Map = dynamic(() => import("@/components/weather/map"), { ssr: false, loading: () => <Skeleton className="h-64 w-full rounded-lg" /> })

const aqiLabels = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"]
const aqiColors = ["", "bg-green-500", "bg-yellow-400", "bg-orange-400", "bg-red-500", "bg-red-800"]

export default function CurrentWeatherPage() {
  const [location, setLocation] = useState<GeocodingResult | null>(null)
  const [units] = useState<"metric" | "imperial">("metric")

  const defaultLocation: GeocodingResult = { id: 0, name: "London", latitude: 51.5074, longitude: -0.1278, country: "United Kingdom", country_code: "GB" }
  const activeLocation = location || defaultLocation

  const { data: weather, isLoading, error } = useCurrentWeather(
    activeLocation.latitude,
    activeLocation.longitude,
    units
  )

  const { data: aqi } = useCurrentAQI(
    activeLocation.latitude,
    activeLocation.longitude
  )

  const hasSearched = location !== null

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Current Weather</h1>
          <p className="text-muted-foreground">Real-time weather conditions for any location</p>
        </div>
        <LocationSearch onSelect={setLocation} />
      </div>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      )}

      {error && !isLoading && (
        <FadeIn>
          <Card>
            <CardContent className="py-8 text-center text-destructive">
              Failed to load weather data. Please try again.
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {weather && !isLoading && !error && (
        <div className="grid gap-6 lg:grid-cols-3">
          <FadeIn className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{activeLocation.name}{!hasSearched && <span className="ml-2 text-sm text-muted-foreground">(default location)</span>}</h2>
            </div>
            <WeatherCard data={weather} units={units} />
          </FadeIn>
          <FadeIn className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <Map
                  center={[activeLocation.latitude, activeLocation.longitude]}
                  zoom={10}
                  marker={[activeLocation.latitude, activeLocation.longitude]}
                />
              </CardContent>
            </Card>
            {aqi && (
              <Card className={aqiColors[aqi.aqi]}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="h-5 w-5 text-white" />
                      <CardTitle className="text-sm font-medium text-white">Air Quality</CardTitle>
                    </div>
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white">
                      {aqiLabels[aqi.aqi]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-white">
                    <div className="text-center">
                      <p className="text-lg font-bold">{aqi.pm25?.toFixed(1) ?? "—"}</p>
                      <p className="text-xs opacity-80">PM2.5</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{aqi.pm10?.toFixed(1) ?? "—"}</p>
                      <p className="text-xs opacity-80">PM10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{aqi.o3?.toFixed(1) ?? "—"}</p>
                      <p className="text-xs opacity-80">O₃</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{aqi.no2?.toFixed(1) ?? "—"}</p>
                      <p className="text-xs opacity-80">NO₂</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{aqi.so2?.toFixed(1) ?? "—"}</p>
                      <p className="text-xs opacity-80">SO₂</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{aqi.co?.toFixed(1) ?? "—"}</p>
                      <p className="text-xs opacity-80">CO</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </FadeIn>
        </div>
      )}

      {!hasSearched && !weather && !isLoading && !error && (
        <FadeIn>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MapPin className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Search for a city</p>
              <p className="text-sm text-muted-foreground">Use the search bar above to check current weather</p>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </PageTransition>
  )
}
