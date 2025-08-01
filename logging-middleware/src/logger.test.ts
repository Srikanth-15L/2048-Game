import { Logger } from './logger';
import { LogConfig } from './types';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    post: jest.fn()
  }))
}));

describe('Logger', () => {
  let logger: Logger;
  let mockAxios: any;
  
  const config: LogConfig = {
    apiUrl: 'http://test-api.com',
    defaultStack: 'backend',
    enableConsole: false, // Disable console for tests
    enableApi: false // Disable API for basic tests
  };

  beforeEach(() => {
    logger = new Logger(config);
    mockAxios = require('axios');
    jest.clearAllMocks();
  });

  describe('Basic logging methods', () => {
    test('should create logger with default config', () => {
      expect(logger).toBeInstanceOf(Logger);
    });

    test('should call debug method', async () => {
      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
      logger.updateConfig({ enableConsole: true });
      
      await logger.debug('service', 'Debug message');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should call info method', async () => {
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
      logger.updateConfig({ enableConsole: true });
      
      await logger.info('controller', 'Info message');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should call warn method', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      logger.updateConfig({ enableConsole: true });
      
      await logger.warn('middleware', 'Warning message');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should call error method', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      logger.updateConfig({ enableConsole: true });
      
      await logger.error('handler', 'Error message');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    test('should call fatal method', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      logger.updateConfig({ enableConsole: true });
      
      await logger.fatal('db', 'Fatal message');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Express middleware', () => {
    test('should create express middleware function', () => {
      const middleware = logger.expressMiddleware();
      expect(typeof middleware).toBe('function');
    });

    test('should call next() in middleware', () => {
      const middleware = logger.expressMiddleware();
      const req = { method: 'GET', path: '/test', ip: '127.0.0.1' };
      const res = { on: jest.fn(), statusCode: 200 };
      const next = jest.fn();

      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
    });
  });

  describe('React hook', () => {
    test('should return logging functions for frontend', () => {
      const hooks = logger.useLogger();
      
      expect(typeof hooks.debug).toBe('function');
      expect(typeof hooks.info).toBe('function');
      expect(typeof hooks.warn).toBe('function');
      expect(typeof hooks.error).toBe('function');
      expect(typeof hooks.fatal).toBe('function');
    });
  });

  describe('Configuration updates', () => {
    test('should update configuration', () => {
      logger.updateConfig({ enableConsole: true });
      // Test that config is updated by checking console output
      const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
      
      logger.info('config', 'Test message');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});