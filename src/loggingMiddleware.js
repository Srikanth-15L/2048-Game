const axios = require('axios');

// Configuration for the Test Server
const TEST_SERVER_URL = process.env.TEST_SERVER_URL || 'http://localhost:3002';
const TEST_SERVER_ENDPOINT = '/api/logs';

/**
 * Reusable Log function that makes API calls to the Test Server
 * Matches the structure: Log(stack, level, package, message)
 * 
 * @param {string} stack - The current execution context/stack trace
 * @param {string} level - Log level (info, warn, error, debug)
 * @param {string} package - The package/module name where the log originated
 * @param {string} message - Descriptive message about what's happening
 */
async function Log(stack, level, package, message) {
  try {
    const logData = {
      stack,
      level,
      package,
      message,
      timestamp: new Date().toISOString(),
      service: 'url-shortener-microservice'
    };

    // Make API call to Test Server
    await axios.post(`${TEST_SERVER_URL}${TEST_SERVER_ENDPOINT}`, logData, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Also log locally for development/debugging
    console.log(`[${level.toUpperCase()}] ${package}: ${message}`, { stack });
    
  } catch (error) {
    // Fallback: if Test Server is unavailable, log locally
    console.error('Failed to send log to Test Server:', error.message);
    console.log(`[${level.toUpperCase()}] ${package}: ${message}`, { stack });
  }
}

/**
 * Express middleware for logging HTTP requests
 */
function loggingMiddleware(req, res, next) {
  const startTime = Date.now();
  const stack = `${req.method} ${req.path}`;
  const package = 'http-middleware';
  
  // Log incoming request
  Log(
    stack,
    'info',
    package,
    `Incoming ${req.method} request to ${req.path} from ${req.ip || 'unknown'}`
  );

  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    const responseStack = `${req.method} ${req.path} -> ${res.statusCode}`;
    
    Log(
      responseStack,
      res.statusCode >= 400 ? 'error' : 'info',
      package,
      `Response ${res.statusCode} for ${req.method} ${req.path} (${duration}ms)`
    );
    
    return originalJson.call(this, data);
  };

  // Override res.status().json() pattern
  const originalStatus = res.status;
  res.status = function(code) {
    const result = originalStatus.call(this, code);
    
    // If this is an error status, log it
    if (code >= 400) {
      Log(
        `${req.method} ${req.path} -> ${code}`,
        code >= 500 ? 'error' : 'warn',
        package,
        `HTTP ${code} response for ${req.method} ${req.path}`
      );
    }
    
    return result;
  };

  next();
}

/**
 * Utility functions for different log levels with proper context
 */
const Logger = {
  info: (stack, package, message) => Log(stack, 'info', package, message),
  warn: (stack, package, message) => Log(stack, 'warn', package, message),
  error: (stack, package, message) => Log(stack, 'error', package, message),
  debug: (stack, package, message) => Log(stack, 'debug', package, message)
};

module.exports = {
  Log,
  loggingMiddleware,
  Logger
};