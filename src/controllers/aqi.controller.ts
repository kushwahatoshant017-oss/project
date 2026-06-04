import { Request, Response } from 'express';
import { aqiService } from '@services/aqi.service';
import { sendSuccess } from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';

export const getCurrentAQI = asyncHandler(async (req: Request, res: Response) => {
  const { lat, lon } = req.query;
  const result = await aqiService.getCurrentAQI(Number(lat), Number(lon));
  sendSuccess(res, {
    ...result,
    description: aqiService.getAQIDescription(result.aqi),
    color: aqiService.getAQIColor(result.aqi),
  }, 'AQI data retrieved');
});
