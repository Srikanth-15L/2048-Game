# URL Shortener Microservice - Full Stack Application

A comprehensive HTTP URL Shortener Microservice with analytical capabilities, featuring a reusable logging middleware, robust backend API, and responsive React frontend.

## Project Structure

```
url-shortener-fullstack/
├── logging-middleware/          # Reusable logging middleware package
├── backend/                     # URL Shortener microservice API
├── frontend/                    # React web application
└── README.md                   # This file
```

## Features

### Backend Microservice
- ✅ Create shortened URLs with custom or auto-generated codes
- ✅ Redirect to original URLs
- ✅ URL statistics and analytics
- ✅ Configurable expiry times
- ✅ Comprehensive logging integration
- ✅ Input validation and error handling

### Frontend Application
- ✅ Modern React UI with Material UI
- ✅ URL shortening interface
- ✅ Statistics dashboard
- ✅ Responsive design
- ✅ Real-time analytics

### Logging Middleware
- ✅ Reusable TypeScript/JavaScript package
- ✅ API integration for log transmission
- ✅ Multiple log levels (debug, info, warn, error, fatal)
- ✅ Structured logging format
- ✅ Used by both frontend and backend

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd url-shortener-fullstack
```

2. **Install Logging Middleware**
```bash
cd logging-middleware
npm install
npm run build
npm link  # For local development
```

3. **Setup Backend**
```bash
cd ../backend
npm install
npm link logging-middleware  # Link local middleware
npm run dev
```
Backend will run on `http://localhost:3001`

4. **Setup Frontend**
```bash
cd ../frontend
npm install
npm link logging-middleware  # Link local middleware
npm start
```
Frontend will run on `http://localhost:3000`

## API Endpoints

### Create Short URL
**POST** `/shorturls`
```json
{
  "url": "https://example.com/very-long-url",
  "validity": 30,
  "shortcode": "custom123"
}
```

### Redirect URL
**GET** `/shorturls/:shortcode`

### Get Statistics
**GET** `/shorturls/:shortcode/stats`

## Environment Configuration

### Backend (.env)
```
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_LOG_LEVEL=info
```

## Architecture

The application follows a microservice architecture with:

- **Logging Middleware**: Centralized logging solution
- **Backend API**: Core URL shortening logic and data management
- **Frontend**: User interface and analytics dashboard
- **Separation of Concerns**: Each component has distinct responsibilities

## Development

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests  
cd frontend && npm test

# Middleware tests
cd logging-middleware && npm test
```

### Building for Production
```bash
# Build middleware
cd logging-middleware && npm run build

# Build backend
cd backend && npm run build

# Build frontend
cd frontend && npm run build
```

## Technologies Used

- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: React, Material UI, TypeScript
- **Logging**: Custom middleware with API integration
- **Validation**: Joi (backend), React Hook Form (frontend)
- **Testing**: Jest, React Testing Library

## License

MIT License