const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const winston = require('winston');
const Joi = require('joi');
const shortid = require('shortid');
const moment = require('moment');

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
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: moment().toISOString()
  });
  next();
});

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
  logger.info('Create short URL request received', { body: req.body });
  
  const { error, value } = createUrlSchema.validate(req.body);
  
  if (error) {
    logger.error('Validation error', { error: error.details });
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
      logger.error('Shortcode collision', { shortcode });
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
  
  logger.info('Short URL created successfully', { shortcode, originalUrl: url });
  
  res.status(201).json({
    shortLink,
    expiry: expiryDate
  });
});

// Retrieve/Redirect Short URL - GET /shorturls/:shortcode
app.get('/shorturls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
  
  logger.info('Short URL access attempt', { shortcode });

  const urlData = urlDatabase.get(shortcode);
  
  if (!urlData) {
    logger.error('Shortcode not found', { shortcode });
    return res.status(404).json({
      error: 'Short URL not found',
      message: 'The requested shortcode does not exist'
    });
  }

  // Check if URL has expired
  if (moment().isAfter(moment(urlData.expiry))) {
    logger.error('Short URL expired', { shortcode, expiry: urlData.expiry });
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

  logger.info('Redirecting to original URL', { shortcode, originalUrl: urlData.url });
  
  // Redirect to original URL
  res.redirect(urlData.url);
});

// Get URL Statistics - GET /shorturls/:shortcode/stats
app.get('/shorturls/:shortcode/stats', (req, res) => {
  const { shortcode } = req.params;
  
  logger.info('Statistics request', { shortcode });

  const urlData = urlDatabase.get(shortcode);
  const stats = statsDatabase.get(shortcode);
  
  if (!urlData || !stats) {
    logger.error('Shortcode not found for stats', { shortcode });
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

  logger.info('Statistics retrieved', { shortcode, totalClicks: stats.totalClicks });
  
  res.json(response);
});

// Get all URLs (for the frontend statistics page)
app.get('/api/urls', (req, res) => {
  logger.info('All URLs statistics request');
  
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
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end'
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn('404 - Route not found', { path: req.path });
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  logger.info(`URL Shortener Microservice running on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;