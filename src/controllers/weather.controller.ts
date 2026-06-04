import { Request, Response } from 'express';
import { weatherService } from '@services/weather.service';
import { sendSuccess } from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';

export const getCurrentWeather = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lon, units } = req.query;
  const result = await weatherService.getCurrentWeather(
    Number(lat),
    Number(lon),
    (units as 'metric' | 'imperial') || 'metric'
  );
  sendSuccess(res, result, 'Current weather data retrieved');
});

export const getHourlyWeather = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lon, hours, units } = req.query;
  const result = await weatherService.getHourlyForecast(
    Number(lat),
    Number(lon),
    Number(hours) || 48,
    (units as 'metric' | 'imperial') || 'metric'
  );
  sendSuccess(res, result, 'Hourly forecast data retrieved');
});

export const getDailyWeather = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lon, days, units } = req.query;
  const result = await weatherService.getDailyForecast(
    Number(lat),
    Number(lon),
    Number(days) || 7,
    (units as 'metric' | 'imperial') || 'metric'
  );
  sendSuccess(res, result, 'Daily forecast data retrieved');
});

export const getWeatherHistory = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lon, startDate, endDate, units } = req.query;
  const result = await weatherService.getWeatherHistory(
    Number(lat),
    Number(lon),
    startDate as string,
    endDate as string,
    (units as 'metric' | 'imperial') || 'metric'
  );
  sendSuccess(res, result, 'Historical weather data retrieved');
});
