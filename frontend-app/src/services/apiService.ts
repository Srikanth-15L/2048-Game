import axios, { AxiosResponse } from 'axios';
import { createLogger } from 'logging-middleware';
import { CreateUrlRequest, CreateUrlResponse, UrlStatsResponse, UrlEntry, ApiError } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const logger = createLogger('http://20.244.56.144', 'frontend');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    logger.info('api', `Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    logger.error('api', `Request error: ${error.message}`);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    logger.info('api', `Received ${response.status} response from ${response.config.url}`);
    return response;
  },
  (error) => {
    logger.error('api', `Response error: ${error.response?.status} - ${error.message}`);
    return Promise.reject(error);
  }
);

export class ApiService {
  
  async createShortUrl(request: CreateUrlRequest): Promise<CreateUrlResponse> {
    try {
      logger.info('api', `Creating short URL for: ${request.url}`);
      const response: AxiosResponse<CreateUrlResponse> = await apiClient.post('/shorturls', request);
      logger.info('api', `Short URL created successfully: ${response.data.shortLink}`);
      return response.data;
    } catch (error: any) {
      logger.error('api', `Failed to create short URL: ${error.response?.data?.message || error.message}`);
      throw this.handleApiError(error);
    }
  }

  async getUrlStats(shortcode: string): Promise<UrlStatsResponse> {
    try {
      logger.info('api', `Fetching statistics for shortcode: ${shortcode}`);
      const response: AxiosResponse<UrlStatsResponse> = await apiClient.get(`/shorturls/${shortcode}/stats`);
      logger.info('api', `Statistics retrieved for ${shortcode}: ${response.data.totalClicks} clicks`);
      return response.data;
    } catch (error: any) {
      logger.error('api', `Failed to fetch statistics: ${error.response?.data?.message || error.message}`);
      throw this.handleApiError(error);
    }
  }

  async getAllUrls(): Promise<UrlEntry[]> {
    try {
      logger.info('api', 'Fetching all URLs');
      const response: AxiosResponse<UrlEntry[]> = await apiClient.get('/api/urls');
      logger.info('api', `Retrieved ${response.data.length} URLs`);
      return response.data;
    } catch (error: any) {
      logger.error('api', `Failed to fetch URLs: ${error.response?.data?.message || error.message}`);
      throw this.handleApiError(error);
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    try {
      logger.info('api', 'Performing health check');
      const response = await apiClient.get('/health');
      logger.info('api', `Health check successful: ${response.data.status}`);
      return response.data;
    } catch (error: any) {
      logger.error('api', `Health check failed: ${error.response?.data?.message || error.message}`);
      throw this.handleApiError(error);
    }
  }

  private handleApiError(error: any): Error {
    if (error.response?.data) {
      const apiError: ApiError = error.response.data;
      return new Error(apiError.message || apiError.error || 'API request failed');
    }
    return new Error(error.message || 'Network error occurred');
  }
}

export const apiService = new ApiService();