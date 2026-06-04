import { userRepository } from '@repositories/user.repository';
import prisma from '@database/client';

export class AdminService {
  async getUsers(page: number, limit: number, search?: string, role?: string) {
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isEmailVerified: true,
          isActive: true,
          unitSystem: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              sessions: true,
              favoriteLocations: true,
              alerts: true,
              notifications: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async getStats() {
    return userRepository.getStats();
  }

  async getDetailedStats() {
    const [userStats, weatherCount, forecastCount, alertCount, favoriteCount] = await Promise.all([
      userRepository.getStats(),
      prisma.weatherData.count(),
      prisma.forecast.count(),
      prisma.alert.count({ where: { isActive: true } }),
      prisma.favoriteLocation.count({ where: { isActive: true } }),
    ]);

    return {
      users: userStats,
      weather: { totalRecords: weatherCount },
      forecast: { totalRecords: forecastCount },
      alerts: { active: alertCount },
      favorites: { total: favoriteCount },
    };
  }
}

export const adminService = new AdminService();
