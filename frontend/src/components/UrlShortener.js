import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  Paper,
  IconButton,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Delete,
  ContentCopy,
  CheckCircle,
  Link as LinkIcon,
  Timer,
  Code,
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';

const UrlShortener = () => {
  const [urls, setUrls] = useState([
    { id: 1, url: '', validity: 30, shortcode: '' }
  ]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { id: Date.now(), url: '', validity: 30, shortcode: '' }]);
    }
  };

  const removeUrlField = (id) => {
    if (urls.length > 1) {
      setUrls(urls.filter(url => url.id !== id));
    }
  };

  const updateUrl = (id, field, value) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, [field]: value } : url
    ));
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateForm = () => {
    const errors = [];
    urls.forEach((urlObj, index) => {
      if (!urlObj.url.trim()) {
        errors.push(`URL ${index + 1} is required`);
      } else if (!isValidUrl(urlObj.url)) {
        errors.push(`URL ${index + 1} is not valid`);
      }
      if (urlObj.validity < 1 || urlObj.validity > 525600) {
        errors.push(`Validity for URL ${index + 1} must be between 1 and 525600 minutes`);
      }
      if (urlObj.shortcode && (urlObj.shortcode.length < 4 || urlObj.shortcode.length > 10)) {
        errors.push(`Shortcode for URL ${index + 1} must be between 4 and 10 characters`);
      }
    });
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setSnackbar({
        open: true,
        message: errors.join(', '),
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    const newResults = [];

    try {
      for (const urlObj of urls) {
        const payload = {
          url: urlObj.url,
          validity: parseInt(urlObj.validity)
        };

        if (urlObj.shortcode.trim()) {
          payload.shortcode = urlObj.shortcode.trim();
        }

        const response = await axios.post('/shorturls', payload);
        newResults.push({
          id: urlObj.id,
          originalUrl: urlObj.url,
          shortLink: response.data.shortLink,
          expiry: response.data.expiry,
          success: true
        });
      }

      setResults(newResults);
      setSnackbar({
        open: true,
        message: `Successfully created ${newResults.length} short URL(s)!`,
        severity: 'success'
      });

      // Reset form
      setUrls([{ id: Date.now(), url: '', validity: 30, shortcode: '' }]);

    } catch (error) {
      console.error('Error creating short URLs:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create short URL',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: 'Copied to clipboard!',
      severity: 'success'
    });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            URL Shortener
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Shorten up to 5 URLs concurrently with custom settings and analytics
          </Typography>

          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {urls.map((urlObj, index) => (
              <Paper
                key={urlObj.id}
                elevation={1}
                sx={{ p: 3, mb: 2, backgroundColor: '#fafafa' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    URL {index + 1}
                  </Typography>
                  {urls.length > 1 && (
                    <IconButton 
                      onClick={() => removeUrlField(urlObj.id)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Long URL"
                      placeholder="https://very-very-very-long-and-descriptive-subdomain..."
                      value={urlObj.url}
                      onChange={(e) => updateUrl(urlObj.id, 'url', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      error={urlObj.url && !isValidUrl(urlObj.url)}
                      helperText={urlObj.url && !isValidUrl(urlObj.url) ? 'Please enter a valid URL' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Validity (minutes)"
                      type="number"
                      value={urlObj.validity}
                      onChange={(e) => updateUrl(urlObj.id, 'validity', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Timer color="primary" />
                          </InputAdornment>
                        ),
                        inputProps: { min: 1, max: 525600 }
                      }}
                      helperText="Default: 30 minutes, Max: 1 year"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Custom Shortcode (Optional)"
                      placeholder="abcd1"
                      value={urlObj.shortcode}
                      onChange={(e) => updateUrl(urlObj.id, 'shortcode', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Code color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      helperText="4-10 alphanumeric characters"
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))}

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              {urls.length < 5 && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addUrlField}
                >
                  Add Another URL
                </Button>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                loading={loading}
                disabled={loading || urls.some(url => !url.url.trim())}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Creating...' : 'Shorten URLs'}
              </Button>
            </Box>
          </Box>

          {results.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" gutterBottom color="primary">
                Your Shortened URLs
              </Typography>
              {results.map((result, index) => (
                <Paper key={result.id} elevation={1} sx={{ p: 3, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Original: {result.originalUrl}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" color="primary">
                          {result.shortLink}
                        </Typography>
                        <Tooltip title="Copy to clipboard">
                          <IconButton 
                            size="small" 
                            onClick={() => copyToClipboard(result.shortLink)}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Chip
                        icon={<CheckCircle />}
                        label={`Expires: ${moment(result.expiry).format('MMM DD, HH:mm')}`}
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UrlShortener;