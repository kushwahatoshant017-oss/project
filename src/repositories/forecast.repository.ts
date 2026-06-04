import { Prisma } from '@prisma/client';
import prisma from '@database/client';

type ForecastCreateInput = Prisma.ForecastCreateInput;

export class ForecastRepository {
  async createMany(data: ForecastCreateInput[]) {
    return prisma.forecast.createMany({ data });
  }

  async findForecasts(lat: number, lon: number, forecastType: string, from: Date, to: Date) {
    return prisma.forecast.findMany({
      where: {
        latitude: { gte: lat - 0.01, lte: lat + 0.01 },
        longitude: { gte: lon - 0.01, lte: lon + 0.01 },
        forecastType,
        forecastTime: { gte: from, lte: to },
      },
      orderBy: { forecastTime: 'asc' },
    });
  }

  async findLatestForecast(lat: number, lon: number, forecastType: string) {
    return prisma.forecast.findFirst({
      where: {
        latitude: { gte: lat - 0.01, lte: lat + 0.01 },
        longitude: { gte: lon - 0.01, lte: lon + 0.01 },
        forecastType,
      },
      orderBy: { fetchedAt: 'desc' },
    });
  }

  async deleteOldForecasts(before: Date) {
    const result = await prisma.forecast.deleteMany({
      where: { fetchedAt: { lt: before } },
    });
    return result.count;
  }
}

export const forecastRepository = new ForecastRepository();
