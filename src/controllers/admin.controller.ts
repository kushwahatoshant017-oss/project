import { Request, Response } from 'express';
import { adminService } from '@services/admin.service';
import { sendSuccess, sendPaginated } from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';
import { parsePagination } from '@utils/helpers';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query as any);
  const search = req.query.search as string | undefined;
  const role = req.query.role as string | undefined;

  const result = await adminService.getUsers(page, limit, search, role);
  sendPaginated(res, result.data, result.total, result.page, result.limit, 'Users retrieved');
});

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await adminService.getDetailedStats();
  sendSuccess(res, result, 'Stats retrieved');
});
