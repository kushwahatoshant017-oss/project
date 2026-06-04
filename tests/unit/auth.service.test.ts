import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('@repositories/user.repository');
jest.mock('@repositories/session.repository');
jest.mock('@database/client');
jest.mock('@utils/logger');
jest.mock('@services/email.service');
jest.mock('@services/audit.service');

describe('AuthService', () => {
  let authService: any;

  beforeAll(async () => {
    jest.isolateModules(() => {
      authService = require('@services/auth.service').authService;
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw error if email already exists', async () => {
      const userRepository = require('@repositories/user.repository').userRepository;
      userRepository.findByEmail.mockResolvedValue({ id: 'existing-id', email: 'test@test.com' });

      await expect(authService.register('test@test.com', 'Password1@')).rejects.toThrow('Email already registered');
    });

    it('should register a new user successfully', async () => {
      const userRepository = require('@repositories/user.repository').userRepository;
      const emailService = require('@services/email.service').emailService;

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue({
        id: 'new-id',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
      });

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);
      jest.spyOn(authService, 'generateTokens').mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 900,
      });

      emailService.sendVerificationEmail.mockResolvedValue(undefined);

      const result = await authService.register('test@test.com', 'Password1@', 'Test', 'User');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@test.com');
    });
  });

  describe('login', () => {
    it('should throw error for invalid email', async () => {
      const userRepository = require('@repositories/user.repository').userRepository;
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login('wrong@test.com', 'Password1@')).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for invalid password', async () => {
      const userRepository = require('@repositories/user.repository').userRepository;
      userRepository.findByEmail.mockResolvedValue({
        id: 'test-id',
        email: 'test@test.com',
        passwordHash: 'hashed-password',
        isActive: true,
        deletedAt: null,
      });

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login('test@test.com', 'WrongPassword1@')).rejects.toThrow('Invalid email or password');
    });
  });
});
