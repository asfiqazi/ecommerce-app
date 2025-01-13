// Performance monitoring and logging utility

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];

  private constructor() {
    // Enable performance tracking in development
    if (import.meta.env.DEV) {
      this.enablePerformanceLogging();
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Measure function execution time
  public measure<T>(
    name: string, 
    fn: () => T, 
    threshold: number = 100
  ): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now()
    };

    this.metrics.push(metric);

    // Log slow functions
    if (duration > threshold) {
      console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  // Async function performance tracking
  public async measureAsync<T>(
    name: string, 
    fn: () => Promise<T>, 
    threshold: number = 100
  ): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now()
    };

    this.metrics.push(metric);

    // Log slow async functions
    if (duration > threshold) {
      console.warn(`Performance warning: ${name} took ${duration.toFixed(2)}ms`);
    }

    return result;
  }

  // Get all recorded metrics
  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Clear recorded metrics
  public clearMetrics(): void {
    this.metrics = [];
  }

  // Enable performance logging
  private enablePerformanceLogging(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
      });
    }
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Utility decorator for performance tracking
export function Performance() {
  return function (
    target: any, 
    propertyKey: string, 
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      return performanceMonitor.measure(
        `${target.constructor.name}.${propertyKey}`, 
        () => originalMethod.apply(this, args)
      );
    };

    return descriptor;
  };
}
