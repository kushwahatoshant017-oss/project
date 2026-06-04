import { Prisma } from '@prisma/client';
import prisma from '@database/client';

type AlertCreateInput = Prisma.AlertCreateInput;

export class AlertRepository {
  async create(data: AlertCreateInput) {
    return prisma.alert.create({ data });
  }

  async findByUser(userId: string, isActive?: boolean) {
    const where: any = { userId };
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    return prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByIdAndUser(id: string, userId: string) {
    return prisma.alert.findFirst({
      where: { id, userId },
    });
  }

  async update(id: string, data: Partial<Prisma.AlertUpdateInput>) {
    return prisma.alert.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return prisma.alert.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async findAlertsNeedingCheck() {
    return prisma.alert.findMany({
      where: { isActive: true },
      include: { user: true },
    });
  }
}

export const alertRepository = new AlertRepository();
