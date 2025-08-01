import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Analytics,
  ContentCopy,
  Visibility,
  Schedule,
  Launch,
  Close,
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';

const Statistics = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailDialog, setDetailDialog] = useState({ open: false, data: null });

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/urls');
      setUrls(response.data);
    } catch (err) {
      console.error('Error fetching URLs:', err);
      setError('Failed to load URL statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchUrlDetails = async (shortcode) => {
    try {
      const response = await axios.get(`/shorturls/${shortcode}/stats`);
      setDetailDialog({ open: true, data: response.data });
    } catch (err) {
      console.error('Error fetching URL details:', err);
      setError('Failed to load URL details');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const closeDetailDialog = () => {
    setDetailDialog({ open: false, data: null });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Analytics color="primary" sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" component="h1" color="primary">
              URL Statistics
            </Typography>
          </Box>

          {urls.length === 0 ? (
            <Alert severity="info">
              No shortened URLs found. Create some URLs first to see statistics.
            </Alert>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="text.secondary">
                  Total URLs: {urls.length} | 
                  Total Clicks: {urls.reduce((sum, url) => sum + url.totalClicks, 0)} |
                  Active URLs: {urls.filter(url => !url.isExpired).length}
                </Typography>
              </Box>

              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Shortcode</strong></TableCell>
                      <TableCell><strong>Original URL</strong></TableCell>
                      <TableCell align="center"><strong>Clicks</strong></TableCell>
                      <TableCell align="center"><strong>Created</strong></TableCell>
                      <TableCell align="center"><strong>Expires</strong></TableCell>
                      <TableCell align="center"><strong>Status</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {urls.map((url) => (
                      <TableRow 
                        key={url.shortcode} 
                        sx={{ '&:hover': { backgroundColor: '#fafafa' } }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontFamily="monospace">
                              {url.shortcode}
                            </Typography>
                            <Tooltip title="Copy shortcode">
                              <IconButton 
                                size="small" 
                                onClick={() => copyToClipboard(url.shortcode)}
                              >
                                <ContentCopy fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={url.originalUrl}>
                            <Typography variant="body2" sx={{ 
                              maxWidth: 200, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {url.originalUrl}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={url.totalClicks} 
                            color="primary" 
                            variant="outlined" 
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {moment(url.created).format('MMM DD, YYYY')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {moment(url.created).fromNow()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2">
                            {moment(url.expiry).format('MMM DD, YYYY')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {moment(url.expiry).fromNow()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={url.isExpired ? 'Expired' : 'Active'}
                            color={url.isExpired ? 'error' : 'success'}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => fetchUrlDetails(url.shortcode)}
                                color="primary"
                              >
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {!url.isExpired && (
                              <Tooltip title="Open Link">
                                <IconButton 
                                  size="small" 
                                  onClick={() => window.open(`http://localhost:3001/shorturls/${url.shortcode}`, '_blank')}
                                  color="secondary"
                                >
                                  <Launch fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </CardContent>
      </Card>

      {/* URL Details Dialog */}
      <Dialog 
        open={detailDialog.open} 
        onClose={closeDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Analytics color="primary" />
            <Typography variant="h6">
              URL Analytics: {detailDialog.data?.shortcode}
            </Typography>
          </Box>
          <IconButton onClick={closeDetailDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {detailDialog.data && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Original URL:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                  {detailDialog.data.originalUrl}
                </Typography>
              </Box>

              <Box sx={{ mb: 3, display: 'flex', gap: 4 }}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Total Clicks:</strong>
                  </Typography>
                  <Chip 
                    label={detailDialog.data.totalClicks} 
                    color="primary" 
                    size="large"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Created:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {moment(detailDialog.data.created).format('MMMM DD, YYYY HH:mm')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Expires:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {moment(detailDialog.data.expiry).format('MMMM DD, YYYY HH:mm')}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                <strong>Click History:</strong>
              </Typography>
              
              {detailDialog.data.clickData.length === 0 ? (
                <Alert severity="info">No clicks recorded yet</Alert>
              ) : (
                <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <List dense>
                    {detailDialog.data.clickData.map((click, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Schedule fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {moment(click.timestamp).format('MMM DD, YYYY HH:mm:ss')}
                                </Typography>
                                <Chip 
                                  label={click.source || 'Direct'} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Box>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                Location: {click.location}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < detailDialog.data.clickData.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Statistics;