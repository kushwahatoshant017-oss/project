import { Prisma } from '@prisma/client';
import prisma from '@database/client';

type NotificationCreateInput = Prisma.NotificationCreateInput;

export class NotificationRepository {
  async create(data: NotificationCreateInput) {
    return prisma.notification.create({ data });
  }

  async findByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);
    return { data, total, page, limit };
  }

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { status: 'READ', readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, status: { not: 'READ' } },
      data: { status: 'READ', readAt: new Date() },
    });
  }

  async countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, status: { not: 'READ' } },
    });
  }
}

export const notificationRepository = new NotificationRepository();
