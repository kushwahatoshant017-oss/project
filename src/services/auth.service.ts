import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@config/index';
import { userRepository } from '@repositories/user.repository';
import { sessionRepository } from '@repositories/session.repository';
import { JwtPayload } from '@typings/index';
import { ApiError } from '@utils/apiError';
import { generateRandomToken, hashToken } from '@utils/encryption';
import { emailService } from './email.service';
import { auditService } from './audit.service';
import logger from '@utils/logger';
import prisma from '@database/client';

export class AuthService {
  async register(email: string, password: string, firstName?: string, lastName?: string) {
    email = email.toLowerCase().trim();
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const user = await userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    const verificationToken = generateRandomToken();
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: hashToken(verificationToken),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    try {
      await emailService.sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      logger.error('Failed to send verification email', { error, userId: user.id });
    }

    await auditService.log(user.id, 'USER_REGISTERED', 'User', user.id, { email });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
      ...tokens,
    };
  }

  async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    email = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    if (user.deletedAt) {
      throw ApiError.forbidden('Account has been deleted');
    }

    if (!user.passwordHash) {
      throw ApiError.unauthorized('Account uses Google login. Please sign in with Google.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    await userRepository.updateLastLogin(user.id);
    await auditService.log(user.id, 'USER_LOGIN', 'User', user.id, { email });

    const tokens = await this.generateTokens(user.id, user.email, user.role, ipAddress, userAgent);

    return {
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatarUrl: user.avatarUrl, unitSystem: user.unitSystem },
      ...tokens,
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const session = await sessionRepository.findByRefreshToken(refreshToken);
      if (session) {
        await sessionRepository.revokeSession(session.id);
      }
    } else {
      await sessionRepository.revokeAllUserSessions(userId);
    }

    await auditService.log(userId, 'USER_LOGOUT', 'User', userId, {});
  }

  async refreshTokens(refreshToken: string) {
    const session = await sessionRepository.findByRefreshToken(refreshToken);
    if (!session || session.isRevoked || session.expiresAt < new Date()) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    await sessionRepository.revokeSession(session.id);

    const user = await userRepository.findById(session.userId);
    if (!user || !user.isActive || user.deletedAt) {
      throw ApiError.unauthorized('User account is not active');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { ...tokens, user: { id: user.id, email: user.email, role: user.role } };
  }

  async verifyEmail(token: string) {
    const hashedToken = hashToken(token);
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token: hashedToken },
    });

    if (!verificationToken) {
      throw ApiError.badRequest('Invalid verification token');
    }

    if (verificationToken.isUsed) {
      throw ApiError.badRequest('Verification token already used');
    }

    if (verificationToken.expiresAt < new Date()) {
      throw ApiError.badRequest('Verification token has expired');
    }

    await prisma.emailVerificationToken.update({
      where: { id: verificationToken.id },
      data: { isUsed: true },
    });

    await userRepository.update(verificationToken.userId, { isEmailVerified: true } as any);

    await auditService.log(verificationToken.userId, 'EMAIL_VERIFIED', 'User', verificationToken.userId, {});
  }

  async forgotPassword(email: string) {
    email = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return;
    }

    const resetToken = generateRandomToken();
    const hashedToken = hashToken(resetToken);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    try {
      await emailService.sendPasswordResetEmail(user.email, resetToken);
    } catch (error) {
      logger.error('Failed to send password reset email', { error, userId: user.id });
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = hashToken(token);
    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetTokenRecord) {
      throw ApiError.badRequest('Invalid reset token');
    }

    if (resetTokenRecord.isUsed) {
      throw ApiError.badRequest('Reset token already used');
    }

    if (resetTokenRecord.expiresAt < new Date()) {
      throw ApiError.badRequest('Reset token has expired');
    }

    const passwordHash = await bcrypt.hash(newPassword, config.bcrypt.saltRounds);

    await prisma.passwordResetToken.update({
      where: { id: resetTokenRecord.id },
      data: { isUsed: true },
    });

    await userRepository.update(resetTokenRecord.userId, { passwordHash } as any);
    await sessionRepository.revokeAllUserSessions(resetTokenRecord.userId);

    await auditService.log(resetTokenRecord.userId, 'PASSWORD_RESET', 'User', resetTokenRecord.userId, {});
  }

  async googleAuth(profile: any) {
    let user = await userRepository.findByGoogleId(profile.id);

    if (!user) {
      user = await userRepository.findByEmail(profile.emails[0].value);
      if (user) {
        await userRepository.update(user.id, { googleId: profile.id, isEmailVerified: true } as any);
      } else {
        user = await userRepository.create({
          email: profile.emails[0].value,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          googleId: profile.id,
          isEmailVerified: true,
          avatarUrl: profile.photos?.[0]?.value,
        });
      }
    }

    if (!user) {
      throw ApiError.internal('Failed to create or find user');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatarUrl: user.avatarUrl }, ...tokens };
  }

  private async generateTokens(userId: string, email: string, role: string, ipAddress?: string, userAgent?: string) {
    const payload: JwtPayload = {
      userId,
      email,
      role: role as any,
      permissions: [],
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
      issuer: config.jwt.issuer,
    } as jwt.SignOptions);

    const refreshToken = generateRandomToken(48);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sessionRepository.create({
      userId,
      refreshToken,
      expiresAt,
      ipAddress,
      userAgent,
    } as any);

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }
}

export const authService = new AuthService();
