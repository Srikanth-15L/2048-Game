import axios, { AxiosInstance } from 'axios';
import { LogLevel, LogStack, LogPackage, LogEntry, LogConfig, LogResponse } from './types';

export class Logger {
  private config: LogConfig;
  private httpClient: AxiosInstance;

  constructor(config: LogConfig) {
    this.config = {
      enableConsole: true,
      enableApi: true,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };

    this.httpClient = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Main logging function that sends logs to API and optionally console
   */
  async log(stack: LogStack, level: LogLevel, packageName: LogPackage, message: string): Promise<void> {
    const logEntry: LogEntry = {
      stack,
      level,
      package: packageName,
      message,
      timestamp: new Date().toISOString()
    };

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // API logging
    if (this.config.enableApi) {
      await this.logToApi(logEntry);
    }
  }

  /**
   * Convenience methods for different log levels
   */
  async debug(packageName: LogPackage, message: string): Promise<void> {
    await this.log(this.config.defaultStack, 'debug', packageName, message);
  }

  async info(packageName: LogPackage, message: string): Promise<void> {
    await this.log(this.config.defaultStack, 'info', packageName, message);
  }

  async warn(packageName: LogPackage, message: string): Promise<void> {
    await this.log(this.config.defaultStack, 'warn', packageName, message);
  }

  async error(packageName: LogPackage, message: string): Promise<void> {
    await this.log(this.config.defaultStack, 'error', packageName, message);
  }

  async fatal(packageName: LogPackage, message: string): Promise<void> {
    await this.log(this.config.defaultStack, 'fatal', packageName, message);
  }

  /**
   * Express middleware function for backend applications
   */
  expressMiddleware() {
    return (req: any, res: any, next: any) => {
      const start = Date.now();
      
      // Log incoming request
      this.info('middleware', `${req.method} ${req.path} - ${req.ip}`);

      // Log response when finished
      res.on('finish', () => {
        const duration = Date.now() - start;
        const level = res.statusCode >= 400 ? 'error' : 'info';
        this.log(
          this.config.defaultStack,
          level,
          'middleware',
          `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
        );
      });

      next();
    };
  }

  /**
   * React hook for frontend applications
   */
  useLogger() {
    return {
      debug: (packageName: LogPackage, message: string) => 
        this.log('frontend', 'debug', packageName, message),
      info: (packageName: LogPackage, message: string) => 
        this.log('frontend', 'info', packageName, message),
      warn: (packageName: LogPackage, message: string) => 
        this.log('frontend', 'warn', packageName, message),
      error: (packageName: LogPackage, message: string) => 
        this.log('frontend', 'error', packageName, message),
      fatal: (packageName: LogPackage, message: string) => 
        this.log('frontend', 'fatal', packageName, message)
    };
  }

  /**
   * Private method to log to console with proper formatting
   */
  private logToConsole(logEntry: LogEntry): void {
    const timestamp = logEntry.timestamp || new Date().toISOString();
    const logMessage = `[${timestamp}] [${logEntry.stack.toUpperCase()}] [${logEntry.level.toUpperCase()}] [${logEntry.package}] ${logEntry.message}`;

    switch (logEntry.level) {
      case 'debug':
        console.debug(logMessage);
        break;
      case 'info':
        console.info(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error':
      case 'fatal':
        console.error(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  /**
   * Private method to send logs to API with retry logic
   */
  private async logToApi(logEntry: LogEntry): Promise<void> {
    let attempts = 0;
    const maxAttempts = this.config.retryAttempts || 3;

    while (attempts < maxAttempts) {
      try {
        const response = await this.httpClient.post('/evaluation-service/logs', logEntry);
        
        if (response.status === 200) {
          const data: LogResponse = response.data;
          // Optionally store the logID for tracking
          logEntry.logID = data.logID;
          return;
        }
      } catch (error) {
        attempts++;
        
        if (attempts >= maxAttempts) {
          // Final attempt failed, log to console as fallback
          console.error('Failed to send log to API after retries:', error);
          return;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay || 1000));
      }
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<LogConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}