const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.TEST_SERVER_PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for logs (in production, you'd use a database)
const logsDatabase = [];

// Test Server API endpoint as specified in the requirements
app.post('/api/logs', (req, res) => {
  const { stack, level, package, message, timestamp, service } = req.body;
  
  // Validate required fields
  if (!stack || !level || !package || !message) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['stack', 'level', 'package', 'message']
    });
  }
  
  // Store the log entry
  const logEntry = {
    id: logsDatabase.length + 1,
    stack,
    level,
    package,
    message,
    timestamp: timestamp || new Date().toISOString(),
    service: service || 'unknown',
    received: new Date().toISOString()
  };
  
  logsDatabase.push(logEntry);
  
  // Print to console for easy viewing
  console.log(`[${level.toUpperCase()}] ${package} | ${stack} | ${message}`);
  
  res.status(200).json({
    success: true,
    logId: logEntry.id,
    message: 'Log received successfully'
  });
});

// Get all logs endpoint (for debugging/monitoring)
app.get('/api/logs', (req, res) => {
  const { level, package: pkg, limit = 100 } = req.query;
  
  let filteredLogs = logsDatabase;
  
  if (level) {
    filteredLogs = filteredLogs.filter(log => log.level === level);
  }
  
  if (pkg) {
    filteredLogs = filteredLogs.filter(log => log.package === pkg);
  }
  
  // Return most recent logs first, limited to specified count
  const logs = filteredLogs
    .slice(-parseInt(limit))
    .reverse();
  
  res.json({
    total: filteredLogs.length,
    returned: logs.length,
    logs
  });
});

// Clear logs endpoint (for testing)
app.delete('/api/logs', (req, res) => {
  const cleared = logsDatabase.length;
  logsDatabase.length = 0;
  
  res.json({
    success: true,
    message: `Cleared ${cleared} log entries`
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    logs_count: logsDatabase.length,
    timestamp: new Date().toISOString()
  });
});

// Stats endpoint
app.get('/api/stats', (req, res) => {
  const stats = {
    total_logs: logsDatabase.length,
    logs_by_level: {},
    logs_by_package: {},
    recent_activity: logsDatabase.slice(-10).map(log => ({
      timestamp: log.timestamp,
      level: log.level,
      package: log.package,
      message: log.message.substring(0, 50) + (log.message.length > 50 ? '...' : '')
    }))
  };
  
  // Count by level
  logsDatabase.forEach(log => {
    stats.logs_by_level[log.level] = (stats.logs_by_level[log.level] || 0) + 1;
  });
  
  // Count by package
  logsDatabase.forEach(log => {
    stats.logs_by_package[log.package] = (stats.logs_by_package[log.package] || 0) + 1;
  });
  
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Test Server running on http://localhost:${PORT}`);
  console.log(`Ready to receive logs at POST /api/logs`);
  console.log(`View logs at GET /api/logs`);
  console.log(`View stats at GET /api/stats`);
});

module.exports = app;