import { Response } from 'express';
import { favoriteService } from '@services/favorite.service';
import { sendSuccess, sendCreated } from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';
import { AuthRequest } from '@types/index';

export const createFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await favoriteService.create(req.user!.userId, req.body);
  sendCreated(res, result, 'Location added to favorites');
});

export const getFavorites = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await favoriteService.findAll(req.user!.userId);
  sendSuccess(res, result, 'Favorites retrieved');
});

export const deleteFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  await favoriteService.delete(req.params.id, req.user!.userId);
  sendSuccess(res, null, 'Location removed from favorites');
});
