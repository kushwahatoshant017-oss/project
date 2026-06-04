import { Prisma } from '@prisma/client';
import prisma from '@database/client';

type WeatherDataCreateInput = Prisma.WeatherDataCreateInput;

export class WeatherRepository {
  async create(data: WeatherDataCreateInput) {
    return prisma.weatherData.create({ data });
  }

  async findLatest(lat: number, lon: number) {
    return prisma.weatherData.findFirst({
      where: {
        latitude: { gte: lat - 0.01, lte: lat + 0.01 },
        longitude: { gte: lon - 0.01, lte: lon + 0.01 },
      },
      orderBy: { fetchedAt: 'desc' },
    });
  }

  async findHistory(lat: number, lon: number, startDate: Date, endDate: Date) {
    return prisma.weatherData.findMany({
      where: {
        latitude: { gte: lat - 0.01, lte: lat + 0.01 },
        longitude: { gte: lon - 0.01, lte: lon + 0.01 },
        fetchedAt: { gte: startDate, lte: endDate },
      },
      orderBy: { fetchedAt: 'asc' },
    });
  }

  async deleteOldRecords(before: Date) {
    const result = await prisma.weatherData.deleteMany({
      where: { fetchedAt: { lt: before } },
    });
    return result.count;
  }
}

export const weatherRepository = new WeatherRepository();
