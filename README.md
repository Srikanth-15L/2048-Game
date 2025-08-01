# URL Shortener Microservice

A robust HTTP URL Shortener Microservice with React frontend, built according to campus hiring evaluation requirements.

## Features

### Backend (Node.js/Express)
- ✅ **Mandatory Logging Integration** using Winston
- ✅ **Microservice Architecture** with single service handling API endpoints
- ✅ **Authentication-free** as specified
- ✅ **Globally unique short links**
- ✅ **Default 30-minute validity** with custom options (up to 1 year)
- ✅ **Custom shortcode support** with uniqueness validation
- ✅ **URL redirection** with click tracking
- ✅ **Comprehensive error handling**
- ✅ **Analytics and statistics** for shortened URLs

### Frontend (React + Material UI)
- ✅ **Responsive design** with Material UI components
- ✅ **Multiple URL shortening** (up to 5 concurrent URLs)
- ✅ **Client-side validation** for URLs and constraints
- ✅ **Statistics dashboard** with detailed analytics
- ✅ **Modern UX** with clean, intuitive interface
- ✅ **Real-time click tracking** and geographical data

## API Endpoints

### Create Short URL
- **POST** `/shorturls`
- **Body**: 
```json
{
  "url": "https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-sub-domain/a-really-log-page",
  "validity": 30,
  "shortcode": "abcd1"
}
```
- **Response**: 
```json
{
  "shortLink": "http://localhost:3001/shorturls/abcd1",
  "expiry": "2025-01-01T00:30:00Z"
}
```

### Retrieve/Redirect Short URL
- **GET** `/shorturls/:shortcode`
- **Response**: Redirects to original URL

### Get URL Statistics
- **GET** `/shorturls/:shortcode/stats`
- **Response**:
```json
{
  "shortcode": "abcd1",
  "originalUrl": "https://example.com",
  "created": "2025-01-01T00:00:00Z",
  "expiry": "2025-01-01T00:30:00Z",
  "totalClicks": 5,
  "clickData": [
    {
      "timestamp": "2025-01-01T00:05:00Z",
      "source": "direct",
      "location": "Unknown"
    }
  ]
}
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm start
# or for development
npm run dev
```

The backend runs on `http://localhost:3001`

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React application:
```bash
npm start
```

The frontend runs on `http://localhost:3000`

## Postman Testing Commands

### 1. Create Short URL (Basic)
```bash
curl -X POST http://localhost:3001/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-sub-domain/a-really-log-page",
    "validity": 30
  }'
```

### 2. Create Short URL with Custom Shortcode
```bash
curl -X POST http://localhost:3001/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.google.com",
    "validity": 60,
    "shortcode": "google1"
  }'
```

### 3. Access Short URL (Redirect)
```bash
curl -L http://localhost:3001/shorturls/google1
```

### 4. Get URL Statistics
```bash
curl http://localhost:3001/shorturls/google1/stats
```

### 5. Get All URLs Statistics
```bash
curl http://localhost:3001/api/urls
```

### 6. Health Check
```bash
curl http://localhost:3001/health
```

## Postman Collection

### Import these requests into Postman:

**1. Create Short URL**
- Method: POST
- URL: `http://localhost:3001/shorturls`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "url": "https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-sub-domain/a-really-log-page",
  "validity": 30,
  "shortcode": "abcd1"
}
```

**2. Access Short URL**
- Method: GET
- URL: `http://localhost:3001/shorturls/abcd1`

**3. Get Statistics**
- Method: GET
- URL: `http://localhost:3001/shorturls/abcd1/stats`

**4. Test Error Cases**
- Invalid URL:
```json
{
  "url": "not-a-valid-url",
  "validity": 30
}
```

- Duplicate shortcode:
```json
{
  "url": "https://example.com",
  "validity": 30,
  "shortcode": "abcd1"
}
```

## Testing Scenarios

1. **Basic Functionality**: Create short URL, access it, verify redirect
2. **Custom Shortcode**: Create with custom shortcode, verify uniqueness
3. **Expiry Testing**: Create short URL with 1-minute validity, wait and test expiry
4. **Analytics**: Create URL, access multiple times, check statistics
5. **Error Handling**: Test invalid URLs, duplicate shortcodes, non-existent URLs
6. **Frontend Integration**: Test the React application end-to-end

## Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Express API   │
│  (Port 3000)    │◄──►│  (Port 3001)    │
│                 │    │                 │
│ - URL Shortener │    │ - POST /shorturls
│ - Statistics    │    │ - GET /shorturls/:id
│ - Material UI   │    │ - GET /shorturls/:id/stats
└─────────────────┘    │ - Winston Logging
                       └─────────────────┘
```

## Logging

All API requests are logged using Winston with:
- Request method, URL, IP address
- User agent information
- Timestamps (ISO 8601 format)
- Error tracking and debugging information

Log files:
- `combined.log` - All logs
- `error.log` - Error logs only
- Console output for development

## Requirements Compliance

✅ **Mandatory Logging Integration**: Winston middleware logs all requests  
✅ **Microservice Architecture**: Single service with specified endpoints  
✅ **Authentication**: No authentication required as specified  
✅ **Short Link Uniqueness**: Global uniqueness enforced  
✅ **Default Validity**: 30 minutes default, customizable up to 1 year  
✅ **Custom Shortcodes**: Optional custom shortcodes with validation  
✅ **Redirection**: Proper redirect with analytics tracking  
✅ **Error Handling**: Comprehensive error responses  
✅ **React Frontend**: Material UI, responsive design, user experience focus  
✅ **Running Environment**: http://localhost:3000 for frontend  
✅ **API Integration**: Frontend consumes backend APIs  

## License

MIT License