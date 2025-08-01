import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import { Analytics, Search, OpenInNew } from '@mui/icons-material';
import { createLogger } from 'logging-middleware';
import { apiService } from '../services/apiService';
import { UrlStatsResponse } from '../types';

const logger = createLogger('http://20.244.56.144', 'frontend');

export const UrlStatsCard: React.FC = () => {
  const [shortcode, setShortcode] = useState('');
  const [stats, setStats] = useState<UrlStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!shortcode.trim()) {
      setError('Please enter a shortcode');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStats(null);

    try {
      logger.info('component', `Fetching statistics for shortcode: ${shortcode}`);
      const response = await apiService.getUrlStats(shortcode.trim());
      setStats(response);
      logger.info('component', `Statistics loaded for ${shortcode}: ${response.totalClicks} clicks`);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch statistics';
      setError(errorMessage);
      logger.error('component', `Statistics fetch error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      fetchStats();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSourceIcon = (source: string) => {
    const iconMap: { [key: string]: string } = {
      chrome: '🌐',
      firefox: '🦊',
      safari: '🧭',
      edge: '🔷',
      postman: '📮',
      curl: '⚡',
      other: '🔗'
    };
    return iconMap[source] || iconMap.other;
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Analytics sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            URL Statistics
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter shortcode (e.g., abc123)"
            variant="outlined"
            size="small"
            fullWidth
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={fetchStats}
            disabled={isLoading || !shortcode.trim()}
            sx={{ minWidth: 120 }}
          >
            {isLoading ? <CircularProgress size={20} /> : 'Get Stats'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {stats && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                📊 Overview
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={`${stats.totalClicks} clicks`} 
                  color="primary" 
                  variant="filled" 
                />
                <Chip 
                  label={`Created: ${formatDate(stats.created)}`}
                  variant="outlined" 
                />
                <Chip 
                  label={`Expires: ${formatDate(stats.expiry)}`}
                  color={new Date(stats.expiry) < new Date() ? 'error' : 'success'}
                  variant="outlined" 
                />
              </Box>
              
              <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Original URL:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      wordBreak: 'break-all', 
                      fontFamily: 'monospace',
                      flex: 1
                    }}
                  >
                    {stats.originalUrl}
                  </Typography>
                  <Button
                    size="small"
                    href={stats.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<OpenInNew />}
                  >
                    Open
                  </Button>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              🎯 Click Details
            </Typography>
            
            {stats.clickData.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No clicks recorded yet
              </Typography>
            ) : (
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {stats.clickData.map((click, index) => (
                  <ListItem key={index} divider={index < stats.clickData.length - 1}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{getSourceIcon(click.source)}</span>
                          <Typography variant="body1">
                            {click.source}
                          </Typography>
                          <Chip 
                            label={click.location} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                      }
                      secondary={formatDate(click.timestamp)}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};