import prisma from '@database/client';
import logger from '@utils/logger';

class AuditService {
  async log(userId: string | null, action: string, entity?: string, entityId?: string, metadata?: Record<string, unknown>, ipAddress?: string, userAgent?: string): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          metadata: metadata || {},
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      logger.error('Failed to create audit log', { error, action, userId });
    }
  }

  async findLogs(params: { userId?: string; action?: string; entity?: string; page?: number; limit?: number }) {
    const { userId, action, entity, page = 1, limit = 50 } = params;
    const where: any = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entity) where.entity = entity;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}

export const auditService = new AuditService();
