import { authService } from '../authService';
import { api } from '../../utils/api';
import { storageManager } from '../../utils/storage';
import { logger } from '../../utils/logger';

// Mock dependencies
jest.mock('../../utils/api');
jest.mock('../../utils/storage');
jest.mock('../../utils/logger');

describe('AuthService', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date().toISOString()
  };

  const mockTokens = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login and store tokens', async () => {
      // Mock API response
      (api.post as jest.Mock).mockResolvedValue({
        user: mockUser,
        tokens: mockTokens
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      // Verify API call
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });

      // Verify token storage
      expect(storageManager.setItem).toHaveBeenCalledWith(
        'accessToken', 
        mockTokens.accessToken
      );
      expect(storageManager.setItem).toHaveBeenCalledWith(
        'refreshToken', 
        mockTokens.refreshToken,
        expect.any(Number)
      );

      // Verify return value
      expect(result).toEqual({ user: mockUser, tokens: mockTokens });
    });

    it('should handle login failure', async () => {
      // Mock API error
      (api.post as jest.Mock).mockRejectedValue(new Error('Login failed'));

      await expect(authService.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow('Login failed');

      // Verify logger called
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should successfully register and store tokens', async () => {
      // Mock API response
      (api.post as jest.Mock).mockResolvedValue({
        user: mockUser,
        tokens: mockTokens
      });

      const result = await authService.register({
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      });

      // Verify API call
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      });

      // Verify token storage
      expect(storageManager.setItem).toHaveBeenCalledWith(
        'accessToken', 
        mockTokens.accessToken
      );

      // Verify return value
      expect(result).toEqual({ user: mockUser, tokens: mockTokens });
    });
  });

  describe('logout', () => {
    it('should clear tokens on logout', async () => {
      // Mock API response
      (api.post as jest.Mock).mockResolvedValue({});

      await authService.logout();

      // Verify token removal
      expect(storageManager.removeItem).toHaveBeenCalledWith('accessToken');
      expect(storageManager.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('password reset', () => {
    it('should request password reset', async () => {
      // Mock API response
      (api.post as jest.Mock).mockResolvedValue({ 
        message: 'Reset link sent' 
      });

      const result = await authService.requestPasswordReset(
        'test@example.com'
      );

      // Verify API call
      expect(api.post).toHaveBeenCalledWith(
        '/auth/reset-password-request', 
        { email: 'test@example.com' }
      );

      // Verify return value
      expect(result).toEqual({ message: 'Reset link sent' });
    });

    it('should confirm password reset', async () => {
      // Mock API response
      (api.post as jest.Mock).mockResolvedValue({ 
        message: 'Password reset successful' 
      });

      const result = await authService.confirmPasswordReset(
        'reset-token', 
        'newpassword123'
      );

      // Verify API call
      expect(api.post).toHaveBeenCalledWith(
        '/auth/reset-password-confirm', 
        { 
          token: 'reset-token', 
          newPassword: 'newpassword123' 
        }
      );

      // Verify return value
      expect(result).toEqual({ message: 'Password reset successful' });
    });
  });

  describe('authentication state', () => {
    it('should check authentication status', () => {
      // Mock token in storage
      (storageManager.getItem as jest.Mock).mockReturnValue('mock-token');

      expect(authService.isAuthenticated()).toBe(true);

      // Mock no token
      (storageManager.getItem as jest.Mock).mockReturnValue(null);

      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
