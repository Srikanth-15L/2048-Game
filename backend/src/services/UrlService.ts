import shortid from 'shortid';
import moment from 'moment';
import { createLogger } from 'logging-middleware';
import { UrlEntry, ClickData, CreateUrlRequest, CreateUrlResponse, UrlStatsResponse } from '../models/UrlModel';

const logger = createLogger('http://20.244.56.144', 'backend');

export class UrlService {
  private urls: Map<string, UrlEntry> = new Map();

  async createShortUrl(request: CreateUrlRequest): Promise<CreateUrlResponse> {
    await logger.info('service', `Creating short URL for: ${request.url}`);

    const shortcode = request.shortcode || this.generateShortcode();
    
    // Check if shortcode already exists
    if (this.urls.has(shortcode)) {
      await logger.warn('service', `Shortcode collision detected: ${shortcode}`);
      throw new Error('Shortcode already exists');
    }

    // Validate shortcode uniqueness
    if (!this.isShortcodeUnique(shortcode)) {
      await logger.error('service', `Shortcode already in use: ${shortcode}`);
      throw new Error('Shortcode is already in use');
    }

    const validity = request.validity || 30;
    const now = moment();
    const expiry = now.clone().add(validity, 'minutes');

    const urlEntry: UrlEntry = {
      id: shortid.generate(),
      shortcode,
      originalUrl: request.url,
      created: now.toISOString(),
      expiry: expiry.toISOString(),
      clicks: []
    };

    this.urls.set(shortcode, urlEntry);
    
    await logger.info('service', `Short URL created successfully: ${shortcode}`);

    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    
    return {
      shortLink: `${baseUrl}/shorturls/${shortcode}`,
      expiry: expiry.toISOString()
    };
  }

  async getOriginalUrl(shortcode: string, clientInfo: { ip: string; userAgent: string }): Promise<string> {
    await logger.info('service', `Retrieving URL for shortcode: ${shortcode}`);

    const urlEntry = this.urls.get(shortcode);
    
    if (!urlEntry) {
      await logger.warn('service', `Shortcode not found: ${shortcode}`);
      throw new Error('Shortcode not found');
    }

    // Check if URL has expired
    if (moment().isAfter(moment(urlEntry.expiry))) {
      await logger.warn('service', `Accessing expired URL: ${shortcode}`);
      throw new Error('Shortened URL has expired');
    }

    // Record click
    const clickData: ClickData = {
      timestamp: new Date().toISOString(),
      source: this.extractSource(clientInfo.userAgent),
      location: 'Unknown', // Could be enhanced with IP geolocation
      ip: clientInfo.ip,
      userAgent: clientInfo.userAgent
    };

    urlEntry.clicks.push(clickData);
    
    await logger.info('service', `URL accessed successfully: ${shortcode} -> ${urlEntry.originalUrl}`);

    return urlEntry.originalUrl;
  }

  async getUrlStats(shortcode: string): Promise<UrlStatsResponse> {
    await logger.info('service', `Retrieving statistics for shortcode: ${shortcode}`);

    const urlEntry = this.urls.get(shortcode);
    
    if (!urlEntry) {
      await logger.warn('service', `Statistics requested for non-existent shortcode: ${shortcode}`);
      throw new Error('Shortcode not found');
    }

    const stats: UrlStatsResponse = {
      shortcode: urlEntry.shortcode,
      originalUrl: urlEntry.originalUrl,
      created: urlEntry.created,
      expiry: urlEntry.expiry,
      totalClicks: urlEntry.clicks.length,
      clickData: urlEntry.clicks.map(click => ({
        timestamp: click.timestamp,
        source: click.source,
        location: click.location
      }))
    };

    await logger.info('service', `Statistics retrieved for shortcode: ${shortcode}, total clicks: ${stats.totalClicks}`);

    return stats;
  }

  async getAllUrls(): Promise<UrlEntry[]> {
    await logger.info('service', 'Retrieving all URLs');
    return Array.from(this.urls.values());
  }

  private generateShortcode(): string {
    let shortcode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortcode = shortid.generate().substring(0, 6);
      attempts++;
      
      if (attempts > maxAttempts) {
        throw new Error('Unable to generate unique shortcode');
      }
    } while (!this.isShortcodeUnique(shortcode));

    return shortcode;
  }

  private isShortcodeUnique(shortcode: string): boolean {
    return !this.urls.has(shortcode);
  }

  private extractSource(userAgent: string): string {
    if (!userAgent) return 'unknown';
    
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('chrome')) return 'chrome';
    if (ua.includes('firefox')) return 'firefox';
    if (ua.includes('safari')) return 'safari';
    if (ua.includes('edge')) return 'edge';
    if (ua.includes('opera')) return 'opera';
    if (ua.includes('postman')) return 'postman';
    if (ua.includes('curl')) return 'curl';
    
    return 'other';
  }
}