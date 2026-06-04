"use client"

import { useState } from "react"
import { LocationSearch } from "@/components/weather/location-search"
import { useCurrentAQI } from "@/hooks/use-weather"
import { Card, CardHeader, CardTitle, CardContent, Skeleton } from "@/components/ui"
import { Wind } from "lucide-react"
import { PageTransition, FadeIn } from "@/components/ui/animated"
import type { GeocodingResult } from "@/services/weather"

const aqiLabels = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"]

const aqiColors = ["", "bg-green-500", "bg-yellow-400", "bg-orange-400", "bg-red-500", "bg-red-800"]

const aqiDescriptions: Record<number, string> = {
  1: "Air quality is satisfactory, and air pollution poses little or no risk.",
  2: "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
  3: "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
  4: "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects.",
  5: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
}

export default function AirQualityPage() {
  const [location, setLocation] = useState<GeocodingResult | null>(null)
  const { data: aqi, isLoading, error } = useCurrentAQI(
    location?.latitude ?? null,
    location?.longitude ?? null
  )

  const pollutants = aqi
    ? [
        { label: "PM2.5", value: aqi.pm25, unit: "µg/m³" },
        { label: "PM10", value: aqi.pm10, unit: "µg/m³" },
        { label: "O₃", value: aqi.o3, unit: "µg/m³" },
        { label: "NO₂", value: aqi.no2, unit: "µg/m³" },
        { label: "SO₂", value: aqi.so2, unit: "µg/m³" },
        { label: "CO", value: aqi.co, unit: "µg/m³" },
      ]
    : []

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Air Quality</h1>
          <p className="text-muted-foreground">Real-time air quality index and pollutant levels</p>
        </div>
        <LocationSearch onSelect={setLocation} />
      </div>

      {!location && (
        <FadeIn>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Wind className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Search for a city</p>
              <p className="text-sm text-muted-foreground">Check air quality conditions</p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      )}

      {error && (
        <FadeIn>
          <Card>
            <CardContent className="py-8 text-center text-destructive">
              Failed to load air quality data.
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {aqi && location && (
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <Card className={aqiColors[aqi.aqi]}>
              <CardContent className="flex flex-col items-center justify-center py-10 text-white">
                <p className="text-6xl font-bold">{aqi.aqi}</p>
                <p className="mt-2 text-xl font-semibold">{aqiLabels[aqi.aqi]}</p>
                <p className="mt-4 max-w-md text-center text-sm opacity-90">
                  {aqiDescriptions[aqi.aqi]}
                </p>
              </CardContent>
            </Card>
          </FadeIn>
          <FadeIn>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pollutants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pollutants.map((p) => (
                  <div key={p.label} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{p.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {p.value?.toFixed(1) ?? "—"} {p.unit}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      )}
    </PageTransition>
  )
}
