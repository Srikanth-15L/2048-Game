import { Router } from 'express';
import { UrlController } from '../controllers/UrlController';

const router = Router();
const urlController = new UrlController();

// Create short URL
router.post('/shorturls', (req, res) => urlController.createShortUrl(req, res));

// Redirect short URL
router.get('/shorturls/:shortcode', (req, res) => urlController.redirectUrl(req, res));

// Get URL statistics
router.get('/shorturls/:shortcode/stats', (req, res) => urlController.getUrlStats(req, res));

// Get all URLs (for debugging/admin)
router.get('/api/urls', (req, res) => urlController.getAllUrls(req, res));

// Health check
router.get('/health', (req, res) => urlController.healthCheck(req, res));

export default router;