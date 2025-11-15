const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs');
const { startCleanupCron } = require('./cleanup');
const { PORT, UPLOAD_DIR, MAX_FILE_SIZE, CLIENT_URL, NODE_ENV } = require('./config');
const { registerRoutes } = require('./routes');

const app = express();

// Create uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Start cleanup cron job
startCleanupCron(UPLOAD_DIR);

// Register all routes
registerRoutes(app);

// 404 handler for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    const maxMb = Math.round(MAX_FILE_SIZE / 1024 / 1024);
    return res.status(400).json({ error: `File too large. Maximum size is ${maxMb}MB` });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// File page redirect (for sharing)
app.get('/f/:fileId', (req, res) => {
  const { fileId } = req.params;
  res.redirect(`${CLIENT_URL}/file/${fileId}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Uplinkr CDN server running on port ${PORT}`);
  console.log(`🌱 Environment: ${NODE_ENV}`);
  console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
  console.log(`📊 Max file size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
});
