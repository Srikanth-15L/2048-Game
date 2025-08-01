export interface UrlEntry {
  id: string;
  shortcode: string;
  originalUrl: string;
  created: string;
  expiry: string;
  clicks: ClickData[];
}

export interface ClickData {
  timestamp: string;
  source: string;
  location: string;
  ip?: string;
  userAgent?: string;
}

export interface CreateUrlRequest {
  url: string;
  validity?: number; // in minutes
  shortcode?: string;
}

export interface CreateUrlResponse {
  shortLink: string;
  expiry: string;
}

export interface UrlStatsResponse {
  shortcode: string;
  originalUrl: string;
  created: string;
  expiry: string;
  totalClicks: number;
  clickData: ClickData[];
}