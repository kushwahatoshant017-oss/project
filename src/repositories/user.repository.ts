import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import prisma from '@database/client';

type UserCreateInput = Prisma.UserCreateInput;
type UserUpdateInput = Prisma.UserUpdateInput;

export class UserRepository extends BaseRepository<any, UserCreateInput, UserUpdateInput> {
  constructor() {
    super('user');
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({ where: { googleId } });
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  async getStats() {
    const [totalUsers, activeUsers, verifiedUsers, recentUsers] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { isActive: true, deletedAt: null } }),
      prisma.user.count({ where: { isEmailVerified: true, deletedAt: null } }),
      prisma.user.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, deletedAt: null },
      }),
    ]);

    return { totalUsers, activeUsers, verifiedUsers, recentUsers };
  }
}

export const userRepository = new UserRepository();
