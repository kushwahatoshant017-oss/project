import { Router } from 'express';
import { validate } from '@middleware/validate';
import { weatherQuerySchema, forecastQuerySchema, hourlyForecastQuerySchema, historyQuerySchema } from '@validators/weather';
import { getCurrentWeather, getHourlyWeather, getDailyWeather, getWeatherHistory } from '@controllers/weather.controller';
import { authenticate } from '@middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/current', validate(weatherQuerySchema, 'query'), getCurrentWeather);
router.get('/hourly', validate(hourlyForecastQuerySchema, 'query'), getHourlyWeather);
router.get('/daily', validate(forecastQuerySchema, 'query'), getDailyWeather);
router.get('/history', validate(historyQuerySchema, 'query'), getWeatherHistory);

export default router;
