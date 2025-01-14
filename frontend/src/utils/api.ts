import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  InternalAxiosRequestConfig 
} from 'axios';
import { environmentConfig } from '../config/env';
import { logger } from './logger';
import { storageManager } from './storage';
import { performanceMonitor } from './performance';

// Define custom error types
export class APIError extends Error {
  public status?: number;
  public code?: string;

  constructor(
    message: string, 
    status?: number, 
    code?: string
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

// Rate limiting configuration
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class APIService {
  private static instance: APIService;
  private axiosInstance: AxiosInstance;
  private requestCount: number = 0;
  private rateLimitConfig: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 60 * 1000 // 1 minute
  };
  private requestQueue: Promise<any>[] = [];

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: environmentConfig.env.apiBaseUrl,
      timeout: 10000, // 10 seconds
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Rate limiting
        await this.checkRateLimit();

        // Add authentication token
        const token = storageManager.getItem<string>('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request details
        logger.debug('API Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers
        });

        return config;
      },
      (error) => {
        logger.error('Request Interceptor Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful response
        logger.debug('API Response:', {
          url: response.config.url,
          status: response.status,
          data: response.data
        });

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Token refresh logic
        if (
          error.response?.status === 401 && 
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            
            // Update token in storage and headers
            storageManager.setItem('authToken', newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Logout user if token refresh fails
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        // Transform error to custom APIError
        const apiError = new APIError(
          error.response?.data?.message || 'An unexpected error occurred',
          error.response?.status,
          error.response?.data?.code
        );

        logger.error('API Error:', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  private async checkRateLimit(): Promise<void> {
    // Simple rate limiting mechanism
    if (this.requestCount >= this.rateLimitConfig.maxRequests) {
      // Wait for existing requests to complete
      await Promise.all(this.requestQueue);
      this.requestCount = 0;
    }

    this.requestCount++;
  }

  // Generic request method with performance tracking
  private async request<T>(
    method: string, 
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      data,
      ...config
    };

    return performanceMonitor.measureAsync(
      `API ${method.toUpperCase()} ${url}`,
      async () => {
        try {
          const response = await this.axiosInstance(requestConfig);
          return response.data;
        } catch (error) {
          if (error instanceof APIError) {
            throw error;
          }
          throw new APIError('Network error');
        }
      }
    );
  }

  // Public API methods
  public get<T>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>('get', url, undefined, config);
  }

  public post<T>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>('post', url, data, config);
  }

  public put<T>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>('put', url, data, config);
  }

  public delete<T>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>('delete', url, undefined, config);
  }

  // Authentication methods
  private async refreshToken(): Promise<string> {
    try {
      const response = await this.post<{ token: string }>('/auth/refresh');
      return response.token;
    } catch (error) {
      throw new APIError('Token refresh failed');
    }
  }

  private logout(): void {
    // Clear authentication state
    storageManager.removeItem('authToken');
    // Optionally redirect to login page or dispatch logout action
  }

  // Abort ongoing requests
  public cancelAllRequests(): void {
    this.axiosInstance.interceptors.request.handlers.forEach(handler => {
      if (handler.fulfilled) {
        handler.fulfilled = null;
      }
    });
  }

  // Update rate limit configuration
  public setRateLimitConfig(config: Partial<RateLimitConfig>): void {
    this.rateLimitConfig = { ...this.rateLimitConfig, ...config };
  }
}

// Export singleton instance
export const api = APIService.getInstance();
