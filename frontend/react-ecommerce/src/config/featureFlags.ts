import { environmentConfig } from './env';

// Define feature flag types
type FeatureFlagValue = boolean | string | number;

interface FeatureFlags {
  enableNewCheckout: boolean;
  enableProductRecommendations: boolean;
  enableWishlist: boolean;
  productSearchThreshold: number;
}

class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private flags: FeatureFlags;

  private constructor() {
    this.flags = {
      // Default feature flags
      enableNewCheckout: false,
      enableProductRecommendations: false,
      enableWishlist: false,
      productSearchThreshold: 10
    };

    this.initializeFlags();
  }

  public static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  private initializeFlags(): void {
    const { isDevelopment, isProduction } = environmentConfig.env;

    // Override flags based on environment
    if (isDevelopment) {
      this.flags.enableNewCheckout = true;
      this.flags.enableProductRecommendations = true;
    }

    if (isProduction) {
      // Gradual rollout or A/B testing
      this.flags.enableNewCheckout = this.shouldEnableFlag('newCheckout', 0.5);
      this.flags.enableProductRecommendations = this.shouldEnableFlag('recommendations', 0.3);
    }
  }

  // Deterministic feature flag rollout
  private shouldEnableFlag(
    flagName: string, 
    probability: number
  ): boolean {
    // Use a simple hash to create consistent flag behavior
    const hash = this.simpleHash(flagName);
    return hash < probability;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Normalize to 0-1 range
    return Math.abs(hash) / 0x7FFFFFFF;
  }

  // Get a specific feature flag
  public getFlag<K extends keyof FeatureFlags>(
    flagName: K
  ): FeatureFlags[K] {
    return this.flags[flagName];
  }

  // Check if a feature is enabled
  public isEnabled(flagName: keyof FeatureFlags): boolean {
    const value = this.flags[flagName];
    return typeof value === 'boolean' ? value : false;
  }

  // Manually override a flag (useful for testing)
  public setFlag<K extends keyof FeatureFlags>(
    flagName: K, 
    value: FeatureFlags[K]
  ): void {
    this.flags[flagName] = value;
  }
}

// Export singleton instance
export const featureFlagManager = FeatureFlagManager.getInstance();
