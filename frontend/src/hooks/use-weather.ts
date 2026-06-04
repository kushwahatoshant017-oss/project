"use client"

import { useQuery } from "@tanstack/react-query"
import { getCurrentWeather, getHourlyForecast, getDailyForecast, getCurrentAQI } from "@/services/weather"

export function useCurrentWeather(lat: number | null, lon: number | null, units = "metric") {
  return useQuery({
    queryKey: ["current-weather", lat, lon, units],
    queryFn: () => getCurrentWeather(lat!, lon!, units),
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 5,
  })
}

export function useHourlyForecast(lat: number | null, lon: number | null, hours = 48, units = "metric") {
  return useQuery({
    queryKey: ["hourly-forecast", lat, lon, hours, units],
    queryFn: () => getHourlyForecast(lat!, lon!, hours, units),
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 10,
  })
}

export function useDailyForecast(lat: number | null, lon: number | null, days = 7, units = "metric") {
  return useQuery({
    queryKey: ["daily-forecast", lat, lon, days, units],
    queryFn: () => getDailyForecast(lat!, lon!, days, units),
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 10,
  })
}

export function useCurrentAQI(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ["current-aqi", lat, lon],
    queryFn: () => getCurrentAQI(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 1000 * 60 * 10,
  })
}
