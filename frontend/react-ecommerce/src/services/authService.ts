import { api, APIError } from '../utils/api';
import { storageManager } from '../utils/storage';
import { logger } from '../utils/logger';

// Authentication-related interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // User login
  public async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await api.post<{
        user: User;
        tokens: AuthTokens;
      }>('/auth/login', credentials);

      // Store tokens securely
      this.storeTokens(response.tokens);

      // Log successful login
      logger.info('User logged in successfully', { 
        userId: response.user.id 
      });

      return response;
    } catch (error) {
      if (error instanceof APIError) {
        logger.error('Login failed', { 
          message: error.message, 
          status: error.status 
        });
      }
      throw error;
    }
  }

  // User registration
  public async register(
    credentials: RegisterCredentials
  ): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const response = await api.post<{
        user: User;
        tokens: AuthTokens;
      }>('/auth/register', credentials);

      // Store tokens securely
      this.storeTokens(response.tokens);

      // Log successful registration
      logger.info('User registered successfully', { 
        userId: response.user.id 
      });

      return response;
    } catch (error) {
      if (error instanceof APIError) {
        logger.error('Registration failed', { 
          message: error.message, 
          status: error.status 
        });
      }
      throw error;
    }
  }

  // Logout user
  public async logout(): Promise<void> {
    try {
      // Invalidate refresh token on server
      await api.post('/auth/logout');

      // Clear local storage
      this.clearTokens();

      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout failed', error);
      // Force clear tokens even if server call fails
      this.clearTokens();
    }
  }

  // Password reset request
  public async requestPasswordReset(
    email: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        '/auth/reset-password-request', 
        { email }
      );

      logger.info('Password reset requested', { email });
      return response;
    } catch (error) {
      logger.error('Password reset request failed', error);
      throw error;
    }
  }

  // Confirm password reset
  public async confirmPasswordReset(
    token: string, 
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        '/auth/reset-password-confirm', 
        { token, newPassword }
      );

      logger.info('Password reset confirmed');
      return response;
    } catch (error) {
      logger.error('Password reset confirmation failed', error);
      throw error;
    }
  }

  // Get current authenticated user
  public async getCurrentUser(): Promise<User | null> {
    try {
      const user = await api.get<User>('/auth/me');
      return user;
    } catch (error) {
      // If getting user fails, likely due to invalid token
      this.clearTokens();
      return null;
    }
  }

  // Token management methods
  private storeTokens(tokens: AuthTokens): void {
    storageManager.setItem('accessToken', tokens.accessToken);
    storageManager.setItem('refreshToken', tokens.refreshToken, 30 * 24 * 60); // 30 days
  }

  private clearTokens(): void {
    storageManager.removeItem('accessToken');
    storageManager.removeItem('refreshToken');
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!storageManager.getItem('accessToken');
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
