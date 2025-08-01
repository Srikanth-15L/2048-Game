import { Request, Response } from 'express';
import { createLogger } from 'logging-middleware';
import { UrlService } from '../services/UrlService';
import { createUrlSchema, shortcodeParamSchema } from '../utils/validation';

const logger = createLogger('http://20.244.56.144', 'backend');
const urlService = new UrlService();

export class UrlController {
  
  async createShortUrl(req: Request, res: Response): Promise<void> {
    try {
      await logger.info('controller', `POST /shorturls - ${req.ip}`);
      
      // Validate request body
      const { error, value } = createUrlSchema.validate(req.body);
      
      if (error) {
        await logger.warn('controller', `Validation error: ${error.details[0].message}`);
        res.status(400).json({ 
          error: 'Validation error',
          message: error.details[0].message 
        });
        return;
      }

      const result = await urlService.createShortUrl(value);
      
      await logger.info('controller', `Short URL created successfully: ${result.shortLink}`);
      res.status(201).json(result);
      
    } catch (error: any) {
      await logger.error('controller', `Error creating short URL: ${error.message}`);
      
      if (error.message === 'Shortcode already exists' || error.message === 'Shortcode is already in use') {
        res.status(409).json({ 
          error: 'Conflict',
          message: error.message 
        });
      } else {
        res.status(500).json({ 
          error: 'Internal server error',
          message: 'Failed to create short URL' 
        });
      }
    }
  }

  async redirectUrl(req: Request, res: Response): Promise<void> {
    try {
      const { shortcode } = req.params;
      await logger.info('controller', `GET /shorturls/${shortcode} - ${req.ip}`);
      
      // Validate shortcode parameter
      const { error } = shortcodeParamSchema.validate({ shortcode });
      
      if (error) {
        await logger.warn('controller', `Invalid shortcode format: ${shortcode}`);
        res.status(400).json({ 
          error: 'Invalid shortcode format',
          message: error.details[0].message 
        });
        return;
      }

      const clientInfo = {
        ip: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('User-Agent') || 'unknown'
      };

      const originalUrl = await urlService.getOriginalUrl(shortcode, clientInfo);
      
      await logger.info('controller', `Redirecting ${shortcode} to ${originalUrl}`);
      res.redirect(302, originalUrl);
      
    } catch (error: any) {
      await logger.error('controller', `Error redirecting URL: ${error.message}`);
      
      if (error.message === 'Shortcode not found') {
        res.status(404).json({ 
          error: 'Not found',
          message: 'Shortcode not found' 
        });
      } else if (error.message === 'Shortened URL has expired') {
        res.status(410).json({ 
          error: 'Gone',
          message: 'Shortened URL has expired' 
        });
      } else {
        res.status(500).json({ 
          error: 'Internal server error',
          message: 'Failed to redirect URL' 
        });
      }
    }
  }

  async getUrlStats(req: Request, res: Response): Promise<void> {
    try {
      const { shortcode } = req.params;
      await logger.info('controller', `GET /shorturls/${shortcode}/stats - ${req.ip}`);
      
      // Validate shortcode parameter
      const { error } = shortcodeParamSchema.validate({ shortcode });
      
      if (error) {
        await logger.warn('controller', `Invalid shortcode format: ${shortcode}`);
        res.status(400).json({ 
          error: 'Invalid shortcode format',
          message: error.details[0].message 
        });
        return;
      }

      const stats = await urlService.getUrlStats(shortcode);
      
      await logger.info('controller', `Statistics retrieved for ${shortcode}`);
      res.status(200).json(stats);
      
    } catch (error: any) {
      await logger.error('controller', `Error retrieving stats: ${error.message}`);
      
      if (error.message === 'Shortcode not found') {
        res.status(404).json({ 
          error: 'Not found',
          message: 'Shortcode not found' 
        });
      } else {
        res.status(500).json({ 
          error: 'Internal server error',
          message: 'Failed to retrieve statistics' 
        });
      }
    }
  }

  async getAllUrls(req: Request, res: Response): Promise<void> {
    try {
      await logger.info('controller', `GET /api/urls - ${req.ip}`);
      
      const urls = await urlService.getAllUrls();
      
      await logger.info('controller', `Retrieved ${urls.length} URLs`);
      res.status(200).json(urls);
      
    } catch (error: any) {
      await logger.error('controller', `Error retrieving all URLs: ${error.message}`);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to retrieve URLs' 
      });
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    await logger.info('controller', `GET /health - ${req.ip}`);
    res.status(200).json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
}