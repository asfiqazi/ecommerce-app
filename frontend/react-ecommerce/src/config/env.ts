// Environment configuration management

interface Environment {
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  apiBaseUrl: string;
  stripePublishableKey: string;
  enableMockData: boolean;
}

class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  public readonly env: Environment;

  private constructor() {
    this.env = {
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
      isTest: import.meta.env.MODE === 'test',
      apiBaseUrl: this.getEnvVariable('VITE_API_BASE_URL', 'http://localhost:3000/api'),
      stripePublishableKey: this.getEnvVariable('VITE_STRIPE_PUBLISHABLE_KEY', ''),
      enableMockData: this.getEnvVariable('VITE_ENABLE_MOCK_DATA', 'false') === 'true'
    };
  }

  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  private getEnvVariable(key: string, defaultValue: string): string {
    const value = import.meta.env[key];
    return value !== undefined ? value : defaultValue;
  }

  // Validate critical environment variables
  public validateConfig(): void {
    const { apiBaseUrl, stripePublishableKey } = this.env;

    if (!apiBaseUrl) {
      console.warn('API Base URL is not configured');
    }

    if (!stripePublishableKey && this.env.isProduction) {
      console.error('Stripe publishable key is missing in production');
    }
  }
}

// Export singleton instance
export const environmentConfig = EnvironmentConfig.getInstance();
