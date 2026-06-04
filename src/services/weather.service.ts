import config from '@config/index';
import { weatherRepository } from '@repositories/weather.repository';
import redisClient from '@database/redis';
import { ApiError } from '@utils/apiError';
import logger from '@utils/logger';

export class WeatherService {
  private readonly CACHE_TTL = 300;
  private readonly FORECAST_CACHE_TTL = 600;

  async getCurrentWeather(lat: number, lon: number, units: 'metric' | 'imperial' = 'metric') {
    const cacheKey = `weather:current:${lat}:${lon}:${units}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return cached;

    const result = await this.fetchFromOpenMeteo(lat, lon, units);
    await redisClient.set(cacheKey, result, this.CACHE_TTL);

    try {
      await weatherRepository.create(result);
    } catch (error) {
      logger.error('Failed to persist weather data', { error, lat, lon });
    }

    return result;
  }

  async getHourlyForecast(lat: number, lon: number, hours: number, units: 'metric' | 'imperial' = 'metric') {
    const cacheKey = `weather:hourly:${lat}:${lon}:${hours}:${units}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return cached;

    const result = await this.fetchHourlyFromOpenMeteo(lat, lon, hours, units);
    await redisClient.set(cacheKey, result, this.FORECAST_CACHE_TTL);

    return result;
  }

  async getDailyForecast(lat: number, lon: number, days: number, units: 'metric' | 'imperial' = 'metric') {
    const cacheKey = `weather:daily:${lat}:${lon}:${days}:${units}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return cached;

    const result = await this.fetchDailyFromOpenMeteo(lat, lon, days, units);
    await redisClient.set(cacheKey, result, this.FORECAST_CACHE_TTL);

    return result;
  }

  async getWeatherHistory(lat: number, lon: number, startDate: string, endDate: string, units: 'metric' | 'imperial' = 'metric') {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end.getTime() - start.getTime() > 30 * 24 * 60 * 60 * 1000) {
      throw ApiError.badRequest('Date range must not exceed 30 days');
    }

    const dbResults = await weatherRepository.findHistory(lat, lon, start, end);
    if (dbResults.length > 0) {
      return dbResults;
    }

    return this.fetchHistoryFromOpenMeteo(lat, lon, startDate, endDate, units);
  }

  private async fetchFromOpenMeteo(lat: number, lon: number, units: 'metric' | 'imperial'): Promise<any> {
    const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
    const speedUnit = units === 'imperial' ? 'mph' : 'kmh';

    const url = `${config.weather.openMeteoBaseUrl}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&temperature_unit=${tempUnit}&wind_speed_unit=${speedUnit}`;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      const data: any = await response.json();

      if (!response.ok) {
        throw new Error(data.reason || 'Open-Meteo API error');
      }

      return this.mapOpenMeteoCurrent(data, lat, lon);
    } catch (error: any) {
      logger.error('Open-Meteo API error, falling back to OpenWeatherMap', { error: error.message });

      if (config.weather.openweathermapApiKey && config.weather.openweathermapApiKey !== 'your-openweathermap-api-key') {
        return this.fetchFromOpenWeatherMap(lat, lon, units);
      }

      if (config.nodeEnv === 'development') {
        logger.warn('Weather APIs unavailable, returning mock data');
        return this.getMockCurrentWeather(lat, lon, units);
      }

      throw ApiError.internal('Failed to fetch weather data');
    }
  }

  private async fetchFromOpenWeatherMap(lat: number, lon: number, units: 'metric' | 'imperial'): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.weather.openweathermapApiKey}&units=${units}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'OpenWeatherMap API error');
    }

    return {
      latitude: lat,
      longitude: lon,
      locationName: data.name,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      windGust: data.wind.gust,
      clouds: data.clouds.all,
      visibility: data.visibility,
      weatherMain: data.weather[0].main,
      weatherDesc: data.weather[0].description,
      weatherIcon: data.weather[0].icon,
      rain1h: data.rain?.['1h'],
      snow1h: data.snow?.['1h'],
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      fetchedFrom: 'OpenWeatherMap',
      fetchedAt: new Date(),
    };
  }

  private mapOpenMeteoCurrent(data: any, lat: number, lon: number): any {
    const current = data.current;
    const weatherCodes: Record<number, { main: string; desc: string; icon: string }> = {
      0: { main: 'Clear', desc: 'Clear sky', icon: '01d' },
      1: { main: 'Clear', desc: 'Mainly clear', icon: '01d' },
      2: { main: 'Clouds', desc: 'Partly cloudy', icon: '02d' },
      3: { main: 'Clouds', desc: 'Overcast', icon: '04d' },
      45: { main: 'Fog', desc: 'Foggy', icon: '50d' },
      48: { main: 'Fog', desc: 'Depositing rime fog', icon: '50d' },
      51: { main: 'Drizzle', desc: 'Light drizzle', icon: '09d' },
      53: { main: 'Drizzle', desc: 'Moderate drizzle', icon: '09d' },
      55: { main: 'Drizzle', desc: 'Dense drizzle', icon: '09d' },
      56: { main: 'Drizzle', desc: 'Light freezing drizzle', icon: '09d' },
      57: { main: 'Drizzle', desc: 'Dense freezing drizzle', icon: '09d' },
      61: { main: 'Rain', desc: 'Slight rain', icon: '10d' },
      63: { main: 'Rain', desc: 'Moderate rain', icon: '10d' },
      65: { main: 'Rain', desc: 'Heavy rain', icon: '10d' },
      66: { main: 'Rain', desc: 'Light freezing rain', icon: '10d' },
      67: { main: 'Rain', desc: 'Heavy freezing rain', icon: '10d' },
      71: { main: 'Snow', desc: 'Slight snow fall', icon: '13d' },
      73: { main: 'Snow', desc: 'Moderate snow fall', icon: '13d' },
      75: { main: 'Snow', desc: 'Heavy snow fall', icon: '13d' },
      77: { main: 'Snow', desc: 'Snow grains', icon: '13d' },
      80: { main: 'Rain', desc: 'Slight rain showers', icon: '09d' },
      81: { main: 'Rain', desc: 'Moderate rain showers', icon: '09d' },
      82: { main: 'Rain', desc: 'Violent rain showers', icon: '09d' },
      85: { main: 'Snow', desc: 'Slight snow showers', icon: '13d' },
      86: { main: 'Snow', desc: 'Heavy snow showers', icon: '13d' },
      95: { main: 'Thunderstorm', desc: 'Thunderstorm', icon: '11d' },
      96: { main: 'Thunderstorm', desc: 'Thunderstorm with slight hail', icon: '11d' },
      99: { main: 'Thunderstorm', desc: 'Thunderstorm with heavy hail', icon: '11d' },
    };

    const weather = weatherCodes[current.weather_code] || { main: 'Unknown', desc: 'Unknown', icon: '01d' };

    return {
      latitude: lat,
      longitude: lon,
      locationName: data.timezone || 'Unknown',
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      pressure: 0,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDeg: current.wind_direction_10m,
      windGust: current.wind_gusts_10m,
      clouds: 0,
      visibility: 10000,
      weatherMain: weather.main,
      weatherDesc: weather.desc,
      weatherIcon: weather.icon,
      uvIndex: current.uv_index,
      precipitation: current.precipitation,
      sunrise: new Date(),
      sunset: new Date(),
      fetchedFrom: 'Open-Meteo',
      fetchedAt: new Date(),
    };
  }

  private getMockCurrentWeather(lat: number, lon: number, units: 'metric' | 'imperial'): any {
    const celsius = units === 'metric';
    const seed = Math.abs(lat * 10 + lon * 7);
    const tempBase = (seed % 35) + (celsius ? -2 : 28);
    const temp = Math.round((tempBase + 10) * 10) / 10;
    const speed = Math.round((seed % 40) * 10) / 10;
    const humidity = Math.round(40 + (seed % 50));
    const pressure = Math.round(990 + (seed % 40));
    const clouds = Math.round(seed % 100);
    const uvIndex = Math.round((seed % 110) * 10) / 10;
    const precip = Math.round((seed % 100) * 10) / 10;
    const weatherOptions = [
      { main: 'Clear', desc: 'Clear sky', icon: '01d' },
      { main: 'Clouds', desc: 'Partly cloudy', icon: '02d' },
      { main: 'Clouds', desc: 'Overcast', icon: '04d' },
      { main: 'Rain', desc: 'Light rain', icon: '10d' },
      { main: 'Drizzle', desc: 'Light drizzle', icon: '09d' },
    ];
    const weather = weatherOptions[Math.floor(seed % weatherOptions.length)];
    const locations: Record<string, string> = {
      '51.5074_-0.1278': 'London',
      '48.8566_2.3522': 'Paris',
      '40.7128_-74.0060': 'New York',
      '35.6762_139.6503': 'Tokyo',
      '37.7749_-122.4194': 'San Francisco',
      '52.5200_13.4050': 'Berlin',
      '41.9028_12.4964': 'Rome',
      '55.7558_37.6173': 'Moscow',
      '39.9042_116.4074': 'Beijing',
      '19.0760_72.8777': 'Mumbai',
    };
    const key = `${lat}_${lon}`;
    const locationName = locations[key] || `Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
    return {
      latitude: lat,
      longitude: lon,
      locationName,
      temperature: temp,
      feelsLike: Math.round((temp - 2 - (seed % 5)) * 10) / 10,
      tempMin: Math.round((temp - 3 - (seed % 4)) * 10) / 10,
      tempMax: Math.round((temp + 2 + (seed % 4)) * 10) / 10,
      pressure,
      humidity,
      windSpeed: speed,
      windDeg: Math.round(seed % 360),
      windGust: Math.round((speed * 1.5) * 10) / 10,
      clouds,
      visibility: 5000 + Math.round(seed % 5000),
      weatherMain: weather.main,
      weatherDesc: weather.desc,
      weatherIcon: weather.icon,
      uvIndex,
      precipitation: precip > 5 ? precip : 0,
      sunrise: new Date(),
      sunset: new Date(),
      fetchedFrom: 'Mock',
      fetchedAt: new Date(),
    };
  }

  private async fetchHourlyFromOpenMeteo(lat: number, lon: number, hours: number, units: 'metric' | 'imperial'): Promise<any> {
    const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
    const speedUnit = units === 'imperial' ? 'mph' : 'kmh';

    const url = `${config.weather.openMeteoBaseUrl}/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,relative_humidity_2m&forecast_hours=${hours}&temperature_unit=${tempUnit}&wind_speed_unit=${speedUnit}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(data.reason || 'Open-Meteo API error');
    }

    return {
      latitude: lat,
      longitude: lon,
      timezone: data.timezone,
      hourly: this.formatHourlyData(data.hourly),
      fetchedFrom: 'Open-Meteo',
      fetchedAt: new Date(),
    };
  }

  private async fetchDailyFromOpenMeteo(lat: number, lon: number, days: number, units: 'metric' | 'imperial'): Promise<any> {
    const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';
    const speedUnit = units === 'imperial' ? 'mph' : 'kmh';

    const url = `${config.weather.openMeteoBaseUrl}/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,weather_code,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunrise,sunset&forecast_days=${days}&temperature_unit=${tempUnit}&wind_speed_unit=${speedUnit}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(data.reason || 'Open-Meteo API error');
    }

    return {
      latitude: lat,
      longitude: lon,
      timezone: data.timezone,
      daily: this.formatDailyData(data.daily),
      fetchedFrom: 'Open-Meteo',
      fetchedAt: new Date(),
    };
  }

  private async fetchHistoryFromOpenMeteo(lat: number, lon: number, startDate: string, endDate: string, units: 'metric' | 'imperial'): Promise<any> {
    const tempUnit = units === 'imperial' ? 'fahrenheit' : 'celsius';

    const url = `${config.weather.openMeteoBaseUrl}/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&temperature_unit=${tempUnit}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(data.reason || 'Open-Meteo API error');
    }

    return {
      latitude: lat,
      longitude: lon,
      timezone: data.timezone,
      daily: this.formatDailyData(data.daily),
      fetchedFrom: 'Open-Meteo Archive',
    };
  }

  private formatHourlyData(hourly: any): any[] {
    if (!hourly || !hourly.time) return [];

    return hourly.time.map((time: string, index: number) => ({
      time,
      temperature: hourly.temperature_2m[index],
      feelsLike: hourly.apparent_temperature[index],
      precipitationProb: hourly.precipitation_probability[index],
      precipitation: hourly.precipitation[index],
      weatherCode: hourly.weather_code[index],
      windSpeed: hourly.wind_speed_10m[index],
      windDirection: hourly.wind_direction_10m[index],
      windGusts: hourly.wind_gusts_10m[index],
      uvIndex: hourly.uv_index[index],
      humidity: hourly.relative_humidity_2m[index],
    }));
  }

  private formatDailyData(daily: any): any[] {
    if (!daily || !daily.time) return [];

    return daily.time.map((time: string, index: number) => ({
      date: time,
      tempMax: daily.temperature_2m_max[index],
      tempMin: daily.temperature_2m_min[index],
      apparentTempMax: daily.apparent_temperature_max?.[index],
      apparentTempMin: daily.apparent_temperature_min?.[index],
      precipitationSum: daily.precipitation_sum[index],
      precipitationProb: daily.precipitation_probability_max?.[index],
      weatherCode: daily.weather_code[index],
      windSpeedMax: daily.wind_speed_10m_max[index],
      windGustsMax: daily.wind_gusts_10m_max?.[index],
      uvIndexMax: daily.uv_index_max?.[index],
      sunrise: daily.sunrise?.[index],
      sunset: daily.sunset?.[index],
    }));
  }
}

export const weatherService = new WeatherService();
