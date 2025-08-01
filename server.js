const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const winston = require('winston');
const Joi = require('joi');
const shortid = require('shortid');
const moment = require('moment');
const { Log, loggingMiddleware, Logger } = require('./src/loggingMiddleware');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure Winston logger as required by the evaluation
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'url-shortener' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Logging middleware - MANDATORY as per requirements
// Uses the new structured Log function that calls the Test Server
app.use(loggingMiddleware);

// In-memory storage (in production, use a database)
const urlDatabase = new Map();
const statsDatabase = new Map();

// Validation schemas
const createUrlSchema = Joi.object({
  url: Joi.string().uri().required(),
  validity: Joi.number().integer().min(1).max(525600).default(30), // max 1 year in minutes
  shortcode: Joi.string().alphanum().min(4).max(10).optional()
});

// Utility functions
function generateUniqueShortcode() {
  let shortcode;
  do {
    shortcode = shortid.generate().substring(0, 6);
  } while (urlDatabase.has(shortcode));
  return shortcode;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// API Endpoints

// Create Short URL - POST /shorturls
app.post('/shorturls', (req, res) => {
  Log('POST /shorturls', 'info', 'url-creation', `Creating short URL for: ${req.body.url || 'unknown URL'}`);
  
  const { error, value } = createUrlSchema.validate(req.body);
  
  if (error) {
    Log('POST /shorturls validation', 'error', 'validation', `Validation failed: ${error.details.map(d => d.message).join(', ')}`);
    return res.status(400).json({
      error: 'Invalid request',
      details: error.details.map(detail => detail.message)
    });
  }

  const { url, validity, shortcode: customShortcode } = value;

  // Check if custom shortcode is provided and unique
  let shortcode = customShortcode;
  if (shortcode) {
    if (urlDatabase.has(shortcode)) {
      Log('POST /shorturls shortcode-check', 'error', 'url-creation', `Shortcode collision detected: ${shortcode} already exists`);
      return res.status(400).json({
        error: 'Shortcode already exists',
        message: 'The provided shortcode is already in use'
      });
    }
  } else {
    shortcode = generateUniqueShortcode();
  }

  // Calculate expiry time
  const expiryDate = moment().add(validity, 'minutes').toISOString();
  
  // Store URL data
  const urlData = {
    url,
    shortcode,
    validity,
    expiry: expiryDate,
    created: moment().toISOString(),
    clicks: 0
  };

  urlDatabase.set(shortcode, urlData);
  
  // Initialize stats
  statsDatabase.set(shortcode, {
    totalClicks: 0,
    clickData: []
  });

  const shortLink = `http://localhost:${PORT}/shorturls/${shortcode}`;
  
  Log('POST /shorturls success', 'info', 'url-creation', `Short URL created successfully: ${shortcode} -> ${url}`);
  
  res.status(201).json({
    shortLink,
    expiry: expiryDate
  });
});

// Retrieve/Redirect Short URL - GET /shorturls/:shortcode
app.get('/shorturls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  
  Log('GET /shorturls/:shortcode', 'info', 'url-redirect', `Short URL access attempt for: ${shortcode}`);

  const urlData = urlDatabase.get(shortcode);
  
  if (!urlData) {
    Log('GET /shorturls/:shortcode', 'error', 'url-redirect', `Shortcode not found: ${shortcode}`);
    return res.status(404).json({
      error: 'Short URL not found',
      message: 'The requested shortcode does not exist'
    });
  }

  // Check if URL has expired
  if (moment().isAfter(moment(urlData.expiry))) {
    Log('GET /shorturls/:shortcode', 'error', 'url-redirect', `Short URL expired: ${shortcode}, expiry was ${urlData.expiry}`);
    return res.status(410).json({
      error: 'Short URL expired',
      message: 'This short link has expired'
    });
  }

  // Record click data for analytics
  const clickData = {
    timestamp: moment().toISOString(),
    source: req.get('Referer') || 'direct',
    userAgent: req.get('User-Agent'),
    ip: req.ip
  };

  const stats = statsDatabase.get(shortcode);
  stats.totalClicks++;
  stats.clickData.push(clickData);
  statsDatabase.set(shortcode, stats);

  // Update URL click count
  urlData.clicks++;
  urlDatabase.set(shortcode, urlData);

  Log('GET /shorturls/:shortcode success', 'info', 'url-redirect', `Redirecting ${shortcode} to original URL: ${urlData.url}`);
  
  // Redirect to original URL
  res.redirect(urlData.url);
});

// Get URL Statistics - GET /shorturls/:shortcode/stats
app.get('/shorturls/:shortcode/stats', (req, res) => {
  const { shortcode } = req.params;
  
  Log('GET /shorturls/:shortcode/stats', 'info', 'analytics', `Statistics request for shortcode: ${shortcode}`);

  const urlData = urlDatabase.get(shortcode);
  const stats = statsDatabase.get(shortcode);
  
  if (!urlData || !stats) {
    Log('GET /shorturls/:shortcode/stats', 'error', 'analytics', `Shortcode not found for stats: ${shortcode}`);
    return res.status(404).json({
      error: 'Short URL not found',
      message: 'The requested shortcode does not exist'
    });
  }

  const response = {
    shortcode,
    originalUrl: urlData.url,
    created: urlData.created,
    expiry: urlData.expiry,
    totalClicks: stats.totalClicks,
    clickData: stats.clickData.map(click => ({
      timestamp: click.timestamp,
      source: click.source,
      location: 'Unknown' // In production, use IP geolocation service
    }))
  };

  Log('GET /shorturls/:shortcode/stats success', 'info', 'analytics', `Statistics retrieved for ${shortcode}: ${stats.totalClicks} total clicks`);
  
  res.json(response);
});

// Get all URLs (for the frontend statistics page)
app.get('/api/urls', (req, res) => {
  Log('GET /api/urls', 'info', 'analytics', 'All URLs statistics request received');
  
  const allUrls = Array.from(urlDatabase.entries()).map(([shortcode, data]) => {
    const stats = statsDatabase.get(shortcode);
    return {
      shortcode,
      originalUrl: data.url,
      created: data.created,
      expiry: data.expiry,
      totalClicks: stats.totalClicks,
      isExpired: moment().isAfter(moment(data.expiry))
    };
  });

  res.json(allUrls);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: moment().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  Log('error-handler', 'error', 'backend', `Unhandled error occurred: ${err.message}, Stack: ${err.stack}`);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end'
  });
});

// 404 handler
app.use('*', (req, res) => {
  Log('404-handler', 'warn', 'backend', `404 - Route not found: ${req.path}`);
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  Log('server-startup', 'info', 'backend', `URL Shortener Microservice running on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;