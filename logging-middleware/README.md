# Logging Middleware

A reusable TypeScript logging middleware package for the URL Shortener full-stack application. This package provides structured logging capabilities with API integration, console output, and framework-specific helpers.

## Features

- ✅ **TypeScript Support**: Full type safety and IntelliSense
- ✅ **API Integration**: Sends logs to evaluation service API
- ✅ **Console Output**: Formatted console logging
- ✅ **Express Middleware**: Ready-to-use Express.js middleware
- ✅ **React Hook**: Frontend logging utilities
- ✅ **Retry Logic**: Automatic retry on API failures
- ✅ **Configurable**: Flexible configuration options

## Installation

```bash
npm install
npm run build
npm link  # For local development
```

## Usage

### Basic Setup

```typescript
import { createLogger } from 'logging-middleware';

// For backend applications
const logger = createLogger('http://20.244.56.144', 'backend');

// For frontend applications  
const logger = createLogger('http://20.244.56.144', 'frontend');
```

### Backend Usage (Express.js)

```typescript
import express from 'express';
import { createLogger } from 'logging-middleware';

const app = express();
const logger = createLogger('http://20.244.56.144', 'backend');

// Add logging middleware
app.use(logger.expressMiddleware());

// Manual logging
app.get('/api/test', async (req, res) => {
  await logger.info('controller', 'Processing test request');
  
  try {
    // Your logic here
    await logger.info('service', 'Test operation completed successfully');
    res.json({ message: 'Success' });
  } catch (error) {
    await logger.error('service', `Test operation failed: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Frontend Usage (React)

```typescript
import React, { useEffect } from 'react';
import { createLogger } from 'logging-middleware';

const logger = createLogger('http://20.244.56.144', 'frontend');

function MyComponent() {
  const log = logger.useLogger();

  useEffect(() => {
    log.info('component', 'MyComponent mounted');
    
    return () => {
      log.info('component', 'MyComponent unmounted');
    };
  }, []);

  const handleClick = async () => {
    try {
      log.info('component', 'Button clicked');
      // Your logic here
    } catch (error) {
      log.error('component', `Button click failed: ${error.message}`);
    }
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## API Reference

### Logger Class

#### Constructor

```typescript
new Logger(config: LogConfig)
```

#### Methods

- `log(stack, level, package, message)` - Main logging method
- `debug(package, message)` - Debug level logging
- `info(package, message)` - Info level logging  
- `warn(package, message)` - Warning level logging
- `error(package, message)` - Error level logging
- `fatal(package, message)` - Fatal level logging
- `expressMiddleware()` - Returns Express middleware function
- `useLogger()` - Returns React hooks object
- `updateConfig(newConfig)` - Update logger configuration

### Types

#### LogLevel
```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
```

#### LogStack
```typescript
type LogStack = 'backend' | 'frontend';
```

#### LogPackage
```typescript
type LogPackage = 
  // Backend only
  | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' 
  | 'repository' | 'route' | 'service'
  // Frontend only
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  // Shared
  | 'auth' | 'config' | 'middleware' | 'utils';
```

#### LogConfig
```typescript
interface LogConfig {
  apiUrl: string;                 // API endpoint URL
  enableConsole?: boolean;        // Enable console output (default: true)
  enableApi?: boolean;           // Enable API logging (default: true)
  defaultStack: LogStack;        // Default stack for convenience methods
  retryAttempts?: number;        // API retry attempts (default: 3)
  retryDelay?: number;          // Retry delay in ms (default: 1000)
}
```

## Package Constraints

The middleware enforces package naming constraints as specified in the evaluation requirements:

**Backend Only Packages:**
- `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`

**Frontend Only Packages:**
- `api`, `component`, `hook`, `page`, `state`, `style`

**Shared Packages:**
- `auth`, `config`, `middleware`, `utils`

## Development

### Build
```bash
npm run build
```

### Test
```bash
npm test
```

### Watch Mode
```bash
npm run dev
```

## License

MIT