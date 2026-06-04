import { Response } from 'express';
import { userRepository } from '@repositories/user.repository';
import { sendSuccess } from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';
import { AuthRequest } from '@types/index';

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userRepository.findById(req.user!.userId);
  const { passwordHash, refreshToken, ...profile } = user;
  sendSuccess(res, profile, 'Profile retrieved successfully');
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { firstName, lastName, avatarUrl, unitSystem } = req.body;

  const updatedUser = await userRepository.update(userId, {
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
    ...(avatarUrl !== undefined && { avatarUrl }),
    ...(unitSystem !== undefined && { unitSystem }),
  } as any);

  const { passwordHash, refreshToken, ...profile } = updatedUser;
  sendSuccess(res, profile, 'Profile updated successfully');
});
