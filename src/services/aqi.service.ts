import config from '@config/index';
import { aqiRepository } from '@repositories/aqi.repository';
import redisClient from '@database/redis';
import logger from '@utils/logger';

export class AQIService {
  private readonly CACHE_TTL = 600;

  async getCurrentAQI(lat: number, lon: number) {
    const cacheKey = `aqi:current:${lat}:${lon}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return cached;

    let result;

    if (config.weather.openweathermapApiKey) {
      try {
        result = await this.fetchFromOpenWeatherMap(lat, lon);
      } catch (error) {
        logger.error('OpenWeatherMap AQI failed, trying Open-Meteo', { error, lat, lon });
        result = await this.fetchFromOpenMeteo(lat, lon);
      }
    } else {
      result = await this.fetchFromOpenMeteo(lat, lon);
    }

    await redisClient.set(cacheKey, result, this.CACHE_TTL);

    try {
      await aqiRepository.create(result);
    } catch (error) {
      logger.error('Failed to persist AQI data', { error, lat, lon });
    }

    return result;
  }

  private async fetchFromOpenWeatherMap(lat: number, lon: number): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${config.weather.openweathermapApiKey}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'OpenWeatherMap AQI API error');
    }

    const list = data.list[0];
    const components = list.components;

    return {
      latitude: lat,
      longitude: lon,
      aqi: list.main.aqi,
      pm25: components.pm2_5,
      pm10: components.pm10,
      o3: components.o3,
      no2: components.no2,
      so2: components.so2,
      co: components.co,
      nh3: components.nh3,
      fetchedFrom: 'OpenWeatherMap',
      fetchedAt: new Date(),
    };
  }

  private async fetchFromOpenMeteo(lat: number, lon: number): Promise<any> {
    const url = `${config.weather.openMeteoBaseUrl}/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,ozone,carbon_monoxide`;

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 10000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      const data: any = await response.json();

      if (!response.ok) {
        throw new Error(data.reason || 'Open-Meteo AQI API error');
      }

      const current = data.current;

      const aqiValue = current.european_aqi || current.us_aqi || 0;
      const aqiCategory = this.categorizeAQI(aqiValue);

      return {
        latitude: lat,
        longitude: lon,
        aqi: aqiCategory,
        pm25: current.pm2_5,
        pm10: current.pm10,
        o3: current.ozone,
        no2: current.nitrogen_dioxide,
        so2: current.sulphur_dioxide,
        co: current.carbon_monoxide,
        fetchedFrom: 'Open-Meteo',
        fetchedAt: new Date(),
      };
    } catch (error: any) {
      logger.error('Open-Meteo AQI API error, returning mock data', { error: error.message, lat, lon });

      if (config.nodeEnv === 'development') {
        return this.getMockAQI(lat, lon);
      }

      throw error;
    }
  }

  private getMockAQI(lat: number, lon: number): any {
    const seed = Math.abs(lat * 10 + lon * 7);
    const aqi = Math.max(1, Math.min(5, Math.round(1 + (seed % 40) / 10)));
    return {
      latitude: lat,
      longitude: lon,
      aqi,
      pm25: Math.round((5 + (seed % 80)) * 10) / 10,
      pm10: Math.round((10 + (seed % 120)) * 10) / 10,
      o3: Math.round((20 + (seed % 100)) * 10) / 10,
      no2: Math.round((5 + (seed % 60)) * 10) / 10,
      so2: Math.round((1 + (seed % 20)) * 10) / 10,
      co: Math.round((200 + (seed % 600)) * 10) / 10,
      fetchedFrom: 'Mock',
      fetchedAt: new Date(),
    };
  }

  private categorizeAQI(value: number): number {
    if (value <= 20) return 1;
    if (value <= 40) return 2;
    if (value <= 60) return 3;
    if (value <= 80) return 4;
    return 5;
  }

  getAQIDescription(aqi: number): string {
    const descriptions: Record<number, string> = {
      1: 'Good',
      2: 'Fair',
      3: 'Moderate',
      4: 'Poor',
      5: 'Very Poor',
    };
    return descriptions[aqi] || 'Unknown';
  }

  getAQIColor(aqi: number): string {
    const colors: Record<number, string> = {
      1: '#00e400',
      2: '#ffff00',
      3: '#ff7e00',
      4: '#ff0000',
      5: '#7e0023',
    };
    return colors[aqi] || '#808080';
  }
}

export const aqiService = new AQIService();
