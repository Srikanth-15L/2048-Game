import React, { useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import { Link as LinkIcon, Analytics } from '@mui/icons-material';
import { createLogger } from 'logging-middleware';
import { UrlShortenerForm } from './components/UrlShortenerForm';
import { UrlStatsCard } from './components/UrlStatsCard';

const logger = createLogger('http://20.244.56.144', 'frontend');

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = React.useState(0);

  useEffect(() => {
    logger.info('component', 'URL Shortener App initialized');
    
    return () => {
      logger.info('component', 'URL Shortener App unmounted');
    };
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    logger.info('component', `Tab changed to: ${newValue === 0 ? 'URL Shortener' : 'Statistics'}`);
  };

  const handleUrlCreated = () => {
    logger.info('component', 'URL created successfully, user can now view statistics');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <LinkIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              URL Shortener Microservice
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Full Stack Application
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              HTTP URL Shortener
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Transform long URLs into short, manageable links with comprehensive analytics
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            <strong>Features:</strong> Custom shortcodes, configurable expiry times, 
            click tracking, and real-time analytics. Default validity is 30 minutes.
          </Alert>

          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange} 
              centered
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab 
                icon={<LinkIcon />} 
                label="URL Shortener" 
                id="tab-0"
                aria-controls="tabpanel-0"
              />
              <Tab 
                icon={<Analytics />} 
                label="Statistics" 
                id="tab-1"
                aria-controls="tabpanel-1"
              />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <UrlShortenerForm onUrlCreated={handleUrlCreated} />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <UrlStatsCard />
          </TabPanel>

          <Box sx={{ textAlign: 'center', mt: 6, py: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Backend API: {process.env.REACT_APP_API_URL || 'http://localhost:3001'} | 
              Built with React + Material UI + Express.js + TypeScript
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
