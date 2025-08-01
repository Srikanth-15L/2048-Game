# URL Shortener Frontend - React TypeScript Application

A modern, responsive React frontend for the URL Shortener microservice, built with **TypeScript**, Material UI, and comprehensive logging integration.

## 🚀 Features

- ✅ **React + TypeScript** - Modern React application with full type safety
- ✅ **Material UI** - Beautiful, responsive design following Google's Material Design
- ✅ **URL Shortening Interface** - Intuitive form for creating short URLs
- ✅ **Real-time Statistics** - Comprehensive analytics dashboard
- ✅ **Logging Integration** - Uses custom logging middleware package
- ✅ **Form Validation** - Client-side validation with react-hook-form
- ✅ **Responsive Design** - Works perfectly on desktop and mobile
- ✅ **Error Handling** - User-friendly error messages and loading states

## 📁 Project Structure

```
frontend-app/
├── src/
│   ├── components/        # React components
│   │   ├── UrlShortenerForm.tsx
│   │   └── UrlStatsCard.tsx
│   ├── services/          # API services
│   │   └── apiService.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   └── index.tsx         # Entry point
├── public/
├── package.json
├── tsconfig.json
└── .env
```

## 🛠 Technology Stack

- **Language**: TypeScript
- **Framework**: React 18
- **UI Library**: Material UI (MUI)
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Logging**: Custom logging middleware
- **Build Tool**: Create React App

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
cd frontend-app
npm install
```

### 2. Link Logging Middleware
```bash
npm link logging-middleware
```

### 3. Environment Configuration
The `.env` file is already configured:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_LOG_LEVEL=info
```

### 4. Start Development Server
```bash
npm start
```

The application will run on `http://localhost:3000`

## 🎨 User Interface

### URL Shortener Tab
- **URL Input**: Enter any HTTP/HTTPS URL
- **Validity Period**: Set expiry time (1 minute to 1 year)
- **Custom Shortcode**: Optional custom shortcode
- **Real-time Validation**: Instant feedback on form inputs
- **Success Display**: Shows generated short URL with copy functionality

### Statistics Tab
- **Shortcode Search**: Enter shortcode to view analytics
- **Overview Metrics**: Total clicks, creation/expiry dates
- **Click Details**: Individual click tracking with timestamps
- **Source Detection**: Browser/client identification
- **Visual Indicators**: Chips and icons for better UX

## 📱 Responsive Design

The application is fully responsive and provides optimal experience across devices:

- **Desktop**: Full-width layout with side-by-side elements
- **Tablet**: Adjusted spacing and component sizing
- **Mobile**: Stacked layout with touch-friendly interactions

## 🔍 Form Validation

### URL Validation
- Must be valid HTTP/HTTPS URL
- Real-time validation feedback
- Required field indicator

### Validity Period
- Integer between 1 and 525,600 minutes
- Default value: 30 minutes
- Input type restrictions

### Custom Shortcode
- Alphanumeric characters only
- 1-20 characters length
- Optional field

## 📊 Logging Integration

The frontend uses the custom logging middleware package:

```typescript
import { createLogger } from 'logging-middleware';

const logger = createLogger('http://20.244.56.144', 'frontend');

// Usage in components
logger.info('component', 'Form submitted');
logger.error('api', 'Request failed');
```

**Log Levels**: debug, info, warn, error, fatal
**Log Packages**: component, api, page, hook, etc.

## 🌐 API Integration

The frontend communicates with the backend via a dedicated API service:

```typescript
// Create short URL
const response = await apiService.createShortUrl({
  url: 'https://example.com',
  validity: 30,
  shortcode: 'custom123'
});

// Get statistics
const stats = await apiService.getUrlStats('custom123');
```

## ⚡ Performance Features

- **React Functional Components** - Modern hooks-based architecture
- **Efficient Re-rendering** - Optimized state management
- **Form Optimization** - React Hook Form for better performance
- **Code Splitting** - Automatic code splitting via Create React App
- **Caching** - HTTP response caching through Axios

## 🎯 User Experience

### Loading States
- Loading spinners during API calls
- Disabled form elements during submission
- Progress indicators for better feedback

### Error Handling
- User-friendly error messages
- Fallback UI for failed requests
- Retry mechanisms where appropriate

### Success Feedback
- Success notifications for completed actions
- Visual confirmation of URL creation
- Copy-to-clipboard functionality

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🏗 Building for Production

```bash
# Create production build
npm run build

# Serve build locally (optional)
npx serve -s build
```

## 🚀 Production Deployment

### Environment Variables
Set the following for production:
```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_LOG_LEVEL=warn
```

### Build and Deploy
```bash
npm run build
# Deploy the build/ folder to your hosting service
```

### Hosting Options
- **Netlify**: Drag & drop the build folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload to S3 bucket with static hosting
- **GitHub Pages**: Use gh-pages package

## 🎨 Theming & Customization

The application uses Material UI's theming system:

```typescript
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 }
      }
    }
  }
});
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security Features

- **Input Validation**: All user inputs are validated
- **XSS Protection**: React's built-in XSS protection
- **CORS Handling**: Proper CORS configuration
- **Environment Variables**: Sensitive data in environment variables

## 🤝 Contributing

1. Follow React and TypeScript best practices
2. Use Material UI components consistently
3. Add proper TypeScript types
4. Include comprehensive logging
5. Write tests for new components
6. Update documentation

## 📄 License

MIT License

## 🔗 Related Projects

- [Backend Microservice](../backend) - Express.js TypeScript API
- [Logging Middleware](../logging-middleware) - Custom logging package
