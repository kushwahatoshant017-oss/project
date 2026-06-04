import { Prisma } from '@prisma/client';
import prisma from '@database/client';

type FavoriteCreateInput = Prisma.FavoriteLocationCreateInput;

export class FavoriteRepository {
  async create(data: FavoriteCreateInput) {
    return prisma.favoriteLocation.create({ data });
  }

  async findByUser(userId: string) {
    return prisma.favoriteLocation.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdAndUser(id: string, userId: string) {
    return prisma.favoriteLocation.findFirst({
      where: { id, userId, isActive: true },
    });
  }

  async softDelete(id: string) {
    return prisma.favoriteLocation.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findByCoordinates(userId: string, lat: number, lon: number) {
    return prisma.favoriteLocation.findFirst({
      where: {
        userId,
        latitude: { gte: lat - 0.01, lte: lat + 0.01 },
        longitude: { gte: lon - 0.01, lte: lon + 0.01 },
        isActive: true,
      },
    });
  }

  async findInactiveByCoordinates(userId: string, lat: number, lon: number) {
    return prisma.favoriteLocation.findFirst({
      where: {
        userId,
        latitude: { gte: lat - 0.01, lte: lat + 0.01 },
        longitude: { gte: lon - 0.01, lte: lon + 0.01 },
        isActive: false,
      },
    });
  }

  async reactivate(id: string, data: { locationName?: string; label?: string }) {
    return prisma.favoriteLocation.update({
      where: { id },
      data: { isActive: true, ...data },
    });
  }
}

export const favoriteRepository = new FavoriteRepository();
