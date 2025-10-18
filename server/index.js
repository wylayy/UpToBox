const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { nanoid } = require('nanoid');
const db = require('./database');
const { startCleanupCron } = require('./cleanup');
const { uploadLimiter, downloadLimiter, apiLimiter } = require('./middleware/rateLimiter');
const { trackDownload } = require('./middleware/analytics');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024; // 100MB default
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

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

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const fileId = nanoid(10);
    const ext = path.extname(file.originalname);
    const filename = `${fileId}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types
    cb(null, true);
  }
});

// Start cleanup cron job
startCleanupCron(UPLOAD_DIR);

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'UpToBox CDN',
    version: '1.0.0',
    status: 'running'
  });
});

// Helper function to calculate expiry date
function calculateExpiryDate(expiryOption) {
  if (!expiryOption || expiryOption === 'never') {
    return null;
  }

  const now = new Date();
  switch (expiryOption) {
    case '1day':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case '7days':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case '1month':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return null;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Upload endpoint
app.post('/api/upload', uploadLimiter, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = path.parse(req.file.filename).name;
    const expiryOption = req.body.expiry || 'never';
    const expiryDate = calculateExpiryDate(expiryOption);
    
    // Use custom filename if provided (for renamed blob files)
    const originalName = req.body.customFilename || req.file.originalname;

    const fileData = {
      id: fileId,
      originalName: originalName,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date().toISOString(),
      expiryDate: expiryDate
    };

    // Save to database
    const saved = db.addFile(fileData);
    if (!saved) {
      return res.status(500).json({ error: 'Failed to save file metadata' });
    }

    const fileUrl = `${BASE_URL}/f/${fileId}`;
    const downloadUrl = `${BASE_URL}/api/download/${fileId}`;

    res.json({
      success: true,
      file: {
        id: fileId,
        name: originalName,
        size: req.file.size,
        mimetype: req.file.mimetype,
        type: req.file.mimetype,
        url: fileUrl,
        downloadUrl: downloadUrl,
        expiryDate: expiryDate
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Download endpoint
app.get('/api/download/:fileId', downloadLimiter, (req, res) => {
  try {
    const { fileId } = req.params;
    const fileData = db.getFile(fileId);

    if (!fileData) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(UPLOAD_DIR, fileData.filename);

    if (!fs.existsSync(filePath)) {
      db.deleteFile(fileId);
      return res.status(404).json({ error: 'File not found' });
    }

    // Track analytics
    const analyticsData = trackDownload(fileId, req);
    db.addAnalytics(analyticsData);

    // Increment download counter
    db.incrementDownloads(fileId);

    res.download(filePath, fileData.original_name);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Get file info
app.get('/api/file/:fileId', apiLimiter, (req, res) => {
  try {
    const { fileId } = req.params;
    const fileData = db.getFile(fileId);

    if (!fileData) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(UPLOAD_DIR, fileData.filename);

    if (!fs.existsSync(filePath)) {
      db.deleteFile(fileId);
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({
      id: fileData.id,
      name: fileData.original_name,
      size: fileData.size,
      mimetype: fileData.mimetype,
      uploadDate: fileData.upload_date,
      expiryDate: fileData.expiry_date,
      downloads: fileData.downloads,
      url: `${BASE_URL}/f/${fileId}`,
      downloadUrl: `${BASE_URL}/api/download/${fileId}`
    });
  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

// Get file analytics
app.get('/api/analytics/:fileId', apiLimiter, (req, res) => {
  try {
    const { fileId } = req.params;
    const analytics = db.getFileAnalytics(fileId);
    res.json({ analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Get system stats
app.get('/api/stats', apiLimiter, (req, res) => {
  try {
    // Get stats from database
    const dbStats = db.getStats();
    const allFiles = db.getAllFiles();

    const stats = {
      totalFiles: dbStats.total_files || 0,
      totalSize: dbStats.total_size || 0,
      totalDownloads: dbStats.total_downloads || 0,
      files: allFiles.map(file => ({
        id: file.id,
        name: file.original_name,
        size: file.size,
        downloads: file.downloads,
        uploadDate: file.upload_date,
        expiryDate: file.expiry_date
      }))
    };

    // System information
    const os = require('os');
    stats.system = {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      uptime: process.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem()
      },
      cpus: os.cpus().length,
      cpuModel: os.cpus()[0]?.model || 'Unknown'
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// File page redirect (for sharing)
app.get('/f/:fileId', (req, res) => {
  const { fileId } = req.params;
  res.redirect(`${CLIENT_URL}/file/${fileId}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 UpToBox CDN server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
  console.log(`📊 Max file size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
});
