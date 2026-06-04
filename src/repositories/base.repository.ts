import { PrismaClient } from '@prisma/client';
import prisma from '@database/client';

export abstract class BaseRepository<T, CreateDto, UpdateDto = Partial<CreateDto>> {
  protected prisma: PrismaClient;

  constructor(protected modelName: keyof typeof prisma) {
    this.prisma = prisma;
  }

  protected get model(): any {
    return this.prisma[this.modelName];
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    }) as Promise<T | null>;
  }

  async findByIdOrThrow(id: string, errorMessage?: string): Promise<T> {
    const record = await this.findById(id);
    if (!record) {
      const { ApiError } = require('@utils/apiError');
      throw ApiError.notFound(errorMessage || `${String(this.modelName)} not found`);
    }
    return record;
  }

  async findMany(params?: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<T[]> {
    return this.model.findMany({
      where: { deletedAt: null, ...params?.where },
      orderBy: params?.orderBy || { createdAt: 'desc' },
      skip: params?.skip,
      take: params?.take,
      include: params?.include,
    }) as Promise<T[]>;
  }

  async findAll(params?: {
    where?: any;
    orderBy?: any;
    include?: any;
  }): Promise<T[]> {
    return this.model.findMany({
      where: { deletedAt: null, ...params?.where },
      orderBy: params?.orderBy || { createdAt: 'desc' },
      include: params?.include,
    }) as Promise<T[]>;
  }

  async create(data: CreateDto): Promise<T> {
    return this.model.create({
      data,
    }) as Promise<T>;
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    }) as Promise<T>;
  }

  async softDelete(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as Promise<T>;
  }

  async hardDelete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    }) as Promise<T>;
  }

  async count(where?: any): Promise<number> {
    return this.model.count({
      where: { deletedAt: null, ...where },
    }) as Promise<number>;
  }

  async exists(where: any): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }

  async paginate(params: {
    page: number;
    limit: number;
    where?: any;
    orderBy?: any;
    include?: any;
  }): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const { page, limit, where, orderBy, include } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where: { deletedAt: null, ...where },
        orderBy: orderBy || { createdAt: 'desc' },
        skip,
        take: limit,
        include,
      }),
      this.model.count({
        where: { deletedAt: null, ...where },
      }),
    ]);

    return { data, total, page, limit };
  }
}
