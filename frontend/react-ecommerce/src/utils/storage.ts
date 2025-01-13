import { logger } from './logger';

class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  // Store item with optional expiration
  public setItem(
    key: string, 
    value: any, 
    expirationMinutes?: number
  ): void {
    try {
      const item = {
        value,
        expiry: expirationMinutes 
          ? Date.now() + expirationMinutes * 60 * 1000 
          : null
      };

      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      logger.error('Error storing item in localStorage', error);
    }
  }

  // Retrieve item with expiration check
  public getItem<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);

      // Check for expiration
      if (item.expiry && Date.now() > item.expiry) {
        this.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      logger.error('Error retrieving item from localStorage', error);
      return null;
    }
  }

  // Remove specific item
  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      logger.error('Error removing item from localStorage', error);
    }
  }

  // Clear all storage
  public clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      logger.error('Error clearing localStorage', error);
    }
  }

  // Check if an item exists
  public hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  // Get all keys
  public getKeys(): string[] {
    return Object.keys(localStorage);
  }
}

// Export singleton instance
export const storageManager = StorageManager.getInstance();
