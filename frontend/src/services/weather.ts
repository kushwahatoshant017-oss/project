import api from "@/lib/api"

export interface CurrentWeather {
  temperature: number
  feelsLike: number
  tempMin: number
  tempMax: number
  humidity: number
  pressure: number
  windSpeed: number
  windDeg: number
  windGust?: number
  clouds: number
  visibility: number
  weatherMain: string
  weatherDesc: string
  weatherIcon: string
  uvIndex?: number
  precipitation?: number
  sunrise: string
  sunset: string
  locationName?: string
}

export interface HourlyForecast {
  forecastTime: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDeg: number
  precipitation: number
  precipitationProb: number
  weatherMain: string
  weatherDesc: string
  weatherIcon: string
  uvIndex: number
}

export interface DailyForecast {
  forecastTime: string
  tempMin: number
  tempMax: number
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDeg: number
  precipitation: number
  precipitationProb: number
  weatherMain: string
  weatherDesc: string
  weatherIcon: string
  sunrise: string
  sunset: string
  uvIndex: number
}

export interface AQIData {
  aqi: number
  pm25: number
  pm10: number
  o3: number
  no2: number
  so2: number
  co: number
  description: string
  color: string
}

export async function getCurrentWeather(lat: number, lon: number, units = "metric") {
  const { data } = await api.get("/weather/current", { params: { lat, lon, units } })
  return data.data as CurrentWeather
}

export async function getHourlyForecast(lat: number, lon: number, hours = 48, units = "metric") {
  const { data } = await api.get("/weather/hourly", { params: { lat, lon, hours, units } })
  return data.data as HourlyForecast[]
}

export async function getDailyForecast(lat: number, lon: number, days = 7, units = "metric") {
  const { data } = await api.get("/weather/daily", { params: { lat, lon, days, units } })
  return data.data as DailyForecast[]
}

export async function getCurrentAQI(lat: number, lon: number) {
  const { data } = await api.get("/aqi/current", { params: { lat, lon } })
  return data.data as AQIData
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  country_code: string
  admin1?: string
}

export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return []
  const json = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  ).then(r => r.json())
  return json?.results || []
}
