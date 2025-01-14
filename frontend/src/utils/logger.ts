type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = 'info';

  private constructor() {
    // Set log level based on environment
    this.logLevel = import.meta.env.PROD ? 'warn' : 'debug';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, ...messages: any[]): void {
    const timestamp = new Date().toISOString();
    const logLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];

    if (logLevels.indexOf(level) >= logLevels.indexOf(this.logLevel)) {
      switch (level) {
        case 'debug':
          console.debug(`[${timestamp}] DEBUG:`, ...messages);
          break;
        case 'info':
          console.info(`[${timestamp}] INFO:`, ...messages);
          break;
        case 'warn':
          console.warn(`[${timestamp}] WARN:`, ...messages);
          break;
        case 'error':
          console.error(`[${timestamp}] ERROR:`, ...messages);
          break;
      }
    }
  }

  public debug(...messages: any[]): void {
    this.log('debug', ...messages);
  }

  public info(...messages: any[]): void {
    this.log('info', ...messages);
  }

  public warn(...messages: any[]): void {
    this.log('warn', ...messages);
  }

  public error(...messages: any[]): void {
    this.log('error', ...messages);
  }

  // Log with custom context
  public logWithContext(
    level: LogLevel, 
    context: string, 
    ...messages: any[]
  ): void {
    this.log(level, `[${context}]`, ...messages);
  }

  // Track errors with optional additional info
  public trackError(
    error: Error, 
    context?: Record<string, any>
  ): void {
    this.error('Tracked Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      context
    });
  }

  // Set log level dynamically
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

// Export singleton instance
export const logger = Logger.getInstance();
