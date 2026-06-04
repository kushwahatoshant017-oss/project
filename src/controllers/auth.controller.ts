import { Request, Response } from 'express';
import { authService } from '@services/auth.service';
import { sendSuccess, sendCreated } from '@utils/response';
import { asyncHandler } from '@middleware/errorHandler';
import { extractIpAddress, extractUserAgent } from '@utils/helpers';
import { AuthRequest } from '@typings/index';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(
    req.body.email,
    req.body.password,
    req.body.firstName,
    req.body.lastName
  );
  sendCreated(res, result, 'Registration successful. Please verify your email.');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(
    req.body.email,
    req.body.password,
    extractIpAddress(req),
    extractUserAgent(req)
  );
  sendSuccess(res, result, 'Login successful');
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const refreshToken = req.body.refreshToken;
  await authService.logout(req.user!.userId, refreshToken);
  sendSuccess(res, null, 'Logged out successfully');
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.refreshTokens(req.body.refreshToken);
  sendSuccess(res, result, 'Token refreshed successfully');
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  await authService.verifyEmail(req.body.token);
  sendSuccess(res, null, 'Email verified successfully');
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  sendSuccess(res, null, 'If the email exists, a reset link has been sent');
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.token, req.body.password);
  sendSuccess(res, null, 'Password reset successful');
});
