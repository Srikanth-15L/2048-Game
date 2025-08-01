# URL Shortener Backend - TypeScript/Express Microservice

A robust HTTP URL Shortener Microservice built with **TypeScript**, Express.js, and comprehensive logging integration.

## 🚀 Features

- ✅ **TypeScript/JavaScript Implementation** - Fully developed in TypeScript with proper type safety
- ✅ **RESTful API** - Clean API endpoints following REST principles
- ✅ **Microservice Architecture** - Single responsibility, scalable design
- ✅ **Logging Integration** - Uses custom logging middleware package
- ✅ **Validation** - Comprehensive input validation with Joi
- ✅ **Error Handling** - Robust error handling and appropriate HTTP status codes
- ✅ **Click Tracking** - Detailed analytics for shortened URLs
- ✅ **Custom Shortcodes** - Support for user-defined shortcodes
- ✅ **Configurable Expiry** - URLs with custom validity periods

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   └── UrlController.ts
│   ├── services/          # Business logic
│   │   └── UrlService.ts
│   ├── routes/            # Route definitions
│   │   └── urlRoutes.ts
│   ├── models/            # Type definitions
│   │   └── UrlModel.ts
│   ├── middleware/        # Custom middleware
│   │   └── errorHandler.ts
│   ├── utils/            # Utilities
│   │   └── validation.ts
│   └── server.ts         # Main server file
├── package.json
├── tsconfig.json
├── nodemon.json
└── .env
```

## 🛠 Technology Stack

- **Language**: TypeScript/JavaScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Validation**: Joi
- **Logging**: Custom logging middleware
- **Development**: Nodemon, ts-node

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Link Logging Middleware
```bash
npm link logging-middleware
```

### 3. Environment Configuration
The `.env` file is already configured:
```env
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001
LOG_LEVEL=info
```

### 4. Start Development Server
```bash
# Development with auto-restart
npm run dev

# Production build and start
npm run build
npm start
```

## 📡 API Endpoints

### Create Short URL
**POST** `/shorturls`

**Request Body:**
```json
{
  "url": "https://example.com/very-long-url",
  "validity": 30,
  "shortcode": "custom123"
}
```

**Response (201):**
```json
{
  "shortLink": "http://localhost:3001/shorturls/custom123",
  "expiry": "2025-01-15T10:30:00.000Z"
}
```

### Redirect Short URL
**GET** `/shorturls/:shortcode`

Redirects (302) to the original URL and tracks the click.

### Get URL Statistics
**GET** `/shorturls/:shortcode/stats`

**Response (200):**
```json
{
  "shortcode": "custom123",
  "originalUrl": "https://example.com/very-long-url",
  "created": "2025-01-15T10:00:00.000Z",
  "expiry": "2025-01-15T10:30:00.000Z",
  "totalClicks": 5,
  "clickData": [
    {
      "timestamp": "2025-01-15T10:05:00.000Z",
      "source": "chrome",
      "location": "Unknown"
    }
  ]
}
```

### Health Check
**GET** `/health`

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "uptime": 3600
}
```

### Get All URLs (Debug)
**GET** `/api/urls`

Returns array of all stored URLs.

## 🔍 Validation Rules

### URL Validation
- Must be valid HTTP/HTTPS URL
- Required field

### Validity Period
- Integer between 1 and 525,600 minutes (1 year)
- Default: 30 minutes

### Custom Shortcode
- Optional field
- Alphanumeric characters only
- 1-20 characters length
- Must be globally unique

## 📊 Logging Integration

The backend uses the custom logging middleware package:

```typescript
import { createLogger } from 'logging-middleware';

const logger = createLogger('http://20.244.56.144', 'backend');

// Usage in services
await logger.info('service', 'Creating short URL');
await logger.error('controller', 'Validation failed');
```

**Log Levels**: debug, info, warn, error, fatal
**Log Packages**: service, controller, middleware, route, etc.

## ⚡ Performance Features

- **In-Memory Storage** - Fast access using Map data structure
- **Efficient Shortcode Generation** - Using shortid library
- **Request/Response Logging** - Automatic logging via middleware
- **Error Boundaries** - Graceful error handling

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🔒 Error Handling

The API returns appropriate HTTP status codes:

- **200** - Success
- **201** - Created
- **302** - Redirect
- **400** - Bad Request (validation errors)
- **404** - Not Found
- **409** - Conflict (duplicate shortcode)
- **410** - Gone (expired URL)
- **500** - Internal Server Error

## 📈 Example Usage with curl

```bash
# Create short URL
curl -X POST http://localhost:3001/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://very-long-example-url.com",
    "validity": 60,
    "shortcode": "test123"
  }'

# Access short URL
curl -L http://localhost:3001/shorturls/test123

# Get statistics
curl http://localhost:3001/shorturls/test123/stats

# Health check
curl http://localhost:3001/health
```

## 🚀 Production Deployment

1. Build the TypeScript code:
```bash
npm run build
```

2. Set production environment variables:
```env
NODE_ENV=production
PORT=3001
BASE_URL=https://your-domain.com
```

3. Start the server:
```bash
npm start
```

## 📝 API Documentation

Full API documentation is available via the running server. All endpoints support JSON request/response format with comprehensive error messages.

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper type definitions
3. Include comprehensive logging
4. Write tests for new features
5. Update documentation

## 📄 License

MIT License