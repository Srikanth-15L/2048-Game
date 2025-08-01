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
}

export interface CreateUrlRequest {
  url: string;
  validity?: number;
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

export interface ApiError {
  error: string;
  message: string;
}