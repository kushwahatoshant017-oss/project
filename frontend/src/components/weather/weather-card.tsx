"use client"

import { Card, CardContent } from "@/components/ui"
import { formatTemp, formatTime } from "@/lib/utils"
import type { CurrentWeather } from "@/services/weather"
import {
  Sun,
  Sunset,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Cloud,
  Gauge,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

interface WeatherCardProps {
  data: CurrentWeather
  units: "metric" | "imperial"
}

export function WeatherCard({ data, units }: WeatherCardProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weatherIcon}@4x.png`

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-5xl font-bold">{formatTemp(data.temperature, units)}</p>
            <p className="mt-1 text-lg opacity-90">Feels like {formatTemp(data.feelsLike, units)}</p>
            <p className="mt-1 text-xl font-medium capitalize">{data.weatherDesc}</p>
          </div>
          {data.weatherIcon && (
            <img src={iconUrl} alt={data.weatherDesc} className="h-24 w-24 -mr-2" />
          )}
        </div>
      </div>
      <CardContent className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <p className="text-muted-foreground">High / Low</p>
            <p className="font-medium">
              {formatTemp(data.tempMax, units)} / {formatTemp(data.tempMin, units)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <p className="text-muted-foreground">Humidity</p>
            <p className="font-medium">{data.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <p className="text-muted-foreground">Wind</p>
            <p className="font-medium">{data.windSpeed} {units === "metric" ? "km/h" : "mph"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <p className="text-muted-foreground">Clouds</p>
            <p className="font-medium">{data.clouds}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <p className="text-muted-foreground">Visibility</p>
            <p className="font-medium">{(data.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <p className="text-muted-foreground">Pressure</p>
            <p className="font-medium">{data.pressure} hPa</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <p className="text-muted-foreground">UV Index</p>
            <p className="font-medium">{data.uvIndex ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Sunset className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            <p className="text-muted-foreground">Sunrise / Sunset</p>
            <p className="font-medium text-xs">
              {formatTime(data.sunrise)} / {formatTime(data.sunset)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
