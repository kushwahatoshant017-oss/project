"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui"
import { formatTemp, formatTime } from "@/lib/utils"
import type { HourlyForecast } from "@/services/weather"
import { useMemo } from "react"
import { motion } from "framer-motion"

export function HourlyChart({ data, units }: { data: HourlyForecast[]; units: "metric" | "imperial" }) {
  const hours = useMemo(() => data.slice(0, 24), [data])

  if (hours.length === 0) return null

  const temps = hours.map(h => h.temperature)
  const minTemp = Math.min(...temps)
  const maxTemp = Math.max(...temps)
  const range = maxTemp - minTemp || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>24-Hour Forecast</span>
          <span className="text-sm font-normal text-muted-foreground">Hover bars for details</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {hours.map((h, i) => {
            const barHeight = ((h.temperature - minTemp) / range) * 120 + 40
            const isNow = i === 0
            return (
              <motion.div
                key={h.forecastTime}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="flex min-w-[48px] flex-col items-center gap-1"
              >
                <p className="text-xs text-muted-foreground">{formatTemp(h.temperature, units)}</p>
                <div className="relative flex h-40 items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeight}px` }}
                    transition={{ duration: 0.5, delay: i * 0.02, ease: "easeOut" }}
                    className="w-8 rounded-full transition-all hover:opacity-80 cursor-pointer"
                    style={{
                      background: `linear-gradient(to top, hsl(${200 + (h.temperature / 40) * 60}, 70%, 50%), hsl(${200 + (h.temperature / 40) * 60}, 70%, 40%))`,
                    }}
                    whileHover={{ scale: 1.1 }}
                  />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <img
                    src={`https://openweathermap.org/img/wn/${h.weatherIcon}.png`}
                    alt={h.weatherDesc}
                    className="h-6 w-6"
                  />
                  <p className="text-xs text-muted-foreground">
                    {isNow ? "Now" : formatTime(h.forecastTime)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
