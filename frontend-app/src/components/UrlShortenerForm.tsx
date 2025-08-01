import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  Chip,
  Stack
} from '@mui/material';
import { Link as LinkIcon, ContentCopy } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { createLogger } from 'logging-middleware';
import { apiService } from '../services/apiService';
import { CreateUrlRequest, CreateUrlResponse } from '../types';

const logger = createLogger('http://20.244.56.144', 'frontend');

interface FormData {
  url: string;
  validity: number;
  shortcode?: string;
}

interface Props {
  onUrlCreated?: (response: CreateUrlResponse) => void;
}

export const UrlShortenerForm: React.FC<Props> = ({ onUrlCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CreateUrlResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      url: '',
      validity: 30,
      shortcode: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      logger.info('component', 'Submitting URL shortener form');
      
      const request: CreateUrlRequest = {
        url: data.url,
        validity: data.validity,
        ...(data.shortcode && { shortcode: data.shortcode })
      };

      const response = await apiService.createShortUrl(request);
      setResult(response);
      
      logger.info('component', `URL shortened successfully: ${response.shortLink}`);
      
      if (onUrlCreated) {
        onUrlCreated(response);
      }

      // Reset form after successful submission
      reset();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create short URL';
      setError(errorMessage);
      logger.error('component', `Form submission error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      logger.info('component', 'Short URL copied to clipboard');
    } catch (err) {
      logger.warn('component', 'Failed to copy to clipboard');
    }
  };

  const validateUrl = (value: string) => {
    const urlPattern = /^https?:\/\/.+/;
    return urlPattern.test(value) || 'Please enter a valid HTTP or HTTPS URL';
  };

  const validateShortcode = (value?: string) => {
    if (!value) return true;
    const alphanumPattern = /^[a-zA-Z0-9]+$/;
    return alphanumPattern.test(value) || 'Shortcode must contain only letters and numbers';
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <LinkIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" component="h1">
          URL Shortener
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <FormLabel>Original URL *</FormLabel>
            <Controller
              name="url"
              control={control}
              rules={{
                required: 'URL is required',
                validate: validateUrl
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="https://example.com/very-long-url"
                  variant="outlined"
                  fullWidth
                  error={!!errors.url}
                  helperText={errors.url?.message}
                  disabled={isLoading}
                />
              )}
            />
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Validity (minutes)</FormLabel>
              <Controller
                name="validity"
                control={control}
                rules={{
                  required: 'Validity is required',
                  min: { value: 1, message: 'Minimum 1 minute' },
                  max: { value: 525600, message: 'Maximum 1 year (525600 minutes)' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    variant="outlined"
                    error={!!errors.validity}
                    helperText={errors.validity?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Custom Shortcode (optional)</FormLabel>
              <Controller
                name="shortcode"
                control={control}
                rules={{
                  validate: validateShortcode,
                  maxLength: { value: 20, message: 'Maximum 20 characters' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="custom123"
                    variant="outlined"
                    error={!!errors.shortcode}
                    helperText={errors.shortcode?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </FormControl>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ py: 1.5 }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              'Shorten URL'
            )}
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Paper 
          elevation={1} 
          sx={{ 
            mt: 3, 
            p: 3, 
            backgroundColor: 'success.light',
            color: 'success.contrastText'
          }}
        >
          <Typography variant="h6" gutterBottom>
            ✅ URL Shortened Successfully!
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body1" sx={{ flex: 1, fontFamily: 'monospace' }}>
              {result.shortLink}
            </Typography>
            <Button
              size="small"
              onClick={() => copyToClipboard(result.shortLink)}
              startIcon={<ContentCopy />}
            >
              Copy
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label={`Expires: ${new Date(result.expiry).toLocaleDateString()}`}
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`${new Date(result.expiry).toLocaleTimeString()}`}
              size="small"
              variant="outlined"
            />
          </Box>
        </Paper>
      )}
    </Paper>
  );
};