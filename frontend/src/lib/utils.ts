import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTemp(temp: number, unit: "metric" | "imperial" = "metric"): string {
  return `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}`
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString("en-US", options)
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}
