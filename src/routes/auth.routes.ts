import { Router } from 'express';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validate';
import { authRateLimiter } from '@middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '@validators/auth';
import {
  register,
  login,
  logout,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '@controllers/auth.controller';

const router = Router();

router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/logout', authenticate, validate(refreshTokenSchema), logout);
router.post('/refresh', validate(refreshTokenSchema), refresh);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/forgot-password', authRateLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authRateLimiter, validate(resetPasswordSchema), resetPassword);

export default router;
