import { Prisma } from '@prisma/client';
import prisma from '@database/client';

type AQIDataCreateInput = Prisma.AQIDataCreateInput;

export class AQIRepository {
  async create(data: AQIDataCreateInput) {
    return prisma.aQIData.create({ data });
  }

  async findLatest(lat: number, lon: number) {
    return prisma.aQIData.findFirst({
      where: {
        latitude: { gte: lat - 0.01, lte: lat + 0.01 },
        longitude: { gte: lon - 0.01, lte: lon + 0.01 },
      },
      orderBy: { fetchedAt: 'desc' },
    });
  }
}

export const aqiRepository = new AQIRepository();
