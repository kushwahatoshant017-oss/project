import { Response } from 'express';
import { alertService } from '@services/alert.service';
import { sendSuccess, sendCreated } from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';
import { AuthRequest } from '@types/index';

export const createAlert = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await alertService.create(req.user!.userId, req.body);
  sendCreated(res, result, 'Alert created successfully');
});

export const getAlerts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await alertService.findAll(req.user!.userId);
  sendSuccess(res, result, 'Alerts retrieved');
});

export const deleteAlert = asyncHandler(async (req: AuthRequest, res: Response) => {
  await alertService.delete(req.params.id, req.user!.userId);
  sendSuccess(res, null, 'Alert deleted');
});
