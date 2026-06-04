"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui"
import { formatTemp, formatDate } from "@/lib/utils"
import type { DailyForecast } from "@/services/weather"
import { Droplets, Wind } from "lucide-react"
import { motion } from "framer-motion"

export function WeeklyChart({ data, units }: { data: DailyForecast[]; units: "metric" | "imperial" }) {
  if (data.length === 0) return null

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {data.map((day, i) => (
            <motion.div
              key={day.forecastTime}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-muted/30 -mx-6 px-6 transition-colors"
            >
              <div className="w-10 text-sm font-medium">
                {formatDate(day.forecastTime, { weekday: "short" })}
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${day.weatherIcon}.png`}
                alt={day.weatherDesc}
                className="h-10 w-10"
              />
              <div className="flex-1 text-sm capitalize text-muted-foreground">{day.weatherDesc}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Droplets className="h-3 w-3" />
                <span>{day.precipitationProb}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium">{formatTemp(day.tempMax, units)}</span>
                <span className="text-sm text-muted-foreground">{formatTemp(day.tempMin, units)}</span>
              </div>
              <div className="hidden w-24 sm:block">
                <div className="relative h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                    style={{
                      left: `${((day.tempMin - (-10)) / 50) * 100}%`,
                      right: `${100 - ((day.tempMax - (-10)) / 50) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
                <Wind className="h-3 w-3" />
                <span>{day.windSpeed} {units === "metric" ? "km/h" : "mph"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
