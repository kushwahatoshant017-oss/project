import { Prisma } from '@prisma/client';
import prisma from '@database/client';

type SessionCreateInput = Prisma.SessionCreateInput;

export class SessionRepository {
  async create(data: SessionCreateInput) {
    return prisma.session.create({ data });
  }

  async findByRefreshToken(refreshToken: string) {
    return prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });
  }

  async revokeSession(id: string) {
    return prisma.session.update({
      where: { id },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserSessions(userId: string) {
    return prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async cleanExpired() {
    const result = await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  }
}

export const sessionRepository = new SessionRepository();
