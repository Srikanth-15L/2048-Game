import { Logger } from './logger';

export { Logger } from './logger';
export * from './types';

// Factory function for easy setup
export function createLogger(apiUrl: string, stack: 'backend' | 'frontend') {
  return new Logger({
    apiUrl,
    defaultStack: stack,
    enableConsole: true,
    enableApi: true,
    retryAttempts: 3,
    retryDelay: 1000
  });
}