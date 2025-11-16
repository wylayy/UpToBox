const multer = require('multer')
const path = require('path')
const { nanoid } = require('nanoid')
const db = require('./database')
const { uploadLimiter, downloadLimiter, apiLimiter } = require('./middleware/rateLimiter')
const { UPLOAD_DIR, MAX_FILE_SIZE, CLIENT_URL } = require('./config')
const { createFileRecord, getFileForDownload, getFileInfo } = require('./services/fileService')

function registerRoutes(app) {
  // Routes
  app.get('/', (req, res) => {
    res.json({
      name: 'Uplinkr CDN',
      version: '1.0.0',
      status: 'running'
    })
  })

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })
  })

  // File storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOAD_DIR)
    },
    filename: (req, file, cb) => {
      const fileId = nanoid(10)
      const ext = path.extname(file.originalname)
      const filename = `${fileId}${ext}`
      cb(null, filename)
    }
  })

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: MAX_FILE_SIZE
    },
    fileFilter: (req, file, cb) => {
      // Allow all file types
      cb(null, true)
    }
  })

  // Upload endpoint
  app.post('/api/upload', uploadLimiter, upload.single('file'), (req, res) => {
    try {
      const result = createFileRecord({
        file: req.file,
        expiryOption: req.body.expiry,
        customFilename: req.body.customFilename,
        password: req.body.password
      })

      if (!result.ok) {
        if (result.status >= 500) {
          console.error('Upload error:', result.message)
        }
        return res.status(result.status).json({ error: result.message })
      }

      res.json({
        success: true,
        file: result.file
      })
    } catch (error) {
      console.error('Upload error:', error)
      res.status(500).json({ error: 'Upload failed' })
    }
  })

  // Download endpoint
  app.get('/api/download/:fileId', downloadLimiter, (req, res) => {
    try {
      const { fileId } = req.params
      const result = getFileForDownload(fileId, req)

      if (!result.ok) {
        return res.status(result.status).json({ error: result.message })
      }

      res.set({
        'Cache-Control': 'private, no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0'
      })

      res.download(result.filePath, result.downloadName)
    } catch (error) {
      console.error('Download error:', error)
      res.status(500).json({ error: 'Download failed' })
    }
  })

  // Get file info
  app.get('/api/file/:fileId', apiLimiter, (req, res) => {
    try {
      const { fileId } = req.params
      const result = getFileInfo(fileId)

      if (!result.ok) {
        return res.status(result.status).json({ error: result.message })
      }

      res.set('Cache-Control', 'no-store')
      res.json(result.data)
    } catch (error) {
      console.error('File info error:', error)
      res.status(500).json({ error: 'Failed to get file info' })
    }
  })

  // Get file analytics
  app.get('/api/analytics/:fileId', apiLimiter, (req, res) => {
    try {
      const { fileId } = req.params
      const analytics = db.getFileAnalytics(fileId)
      res.json({ analytics })
    } catch (error) {
      console.error('Analytics error:', error)
      res.status(500).json({ error: 'Failed to get analytics' })
    }
  })

  // Get system stats
  app.get('/api/stats', apiLimiter, (req, res) => {
    try {
      // Get stats from database
      const dbStats = db.getStats()
      const allFiles = db.getAllFiles()

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
      }

      // System information
      const os = require('os')
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
        storage: {
          uploadsDir: UPLOAD_DIR,
          uploadsSize: dbStats.total_size || 0,
          dbFileSize: dbStats.db_file_size || 0
        },
        cpus: os.cpus().length,
        cpuModel: os.cpus()[0]?.model || 'Unknown'
      }

      res.set('Cache-Control', 'no-store')
      res.json(stats)
    } catch (error) {
      console.error('Stats error:', error)
      res.status(500).json({ error: 'Failed to get stats' })
    }
  })

  // File page redirect (for sharing)
  app.get('/f/:fileId', (req, res) => {
    const { fileId } = req.params
    res.redirect(`${CLIENT_URL}/file/${fileId}`)
  })
}

module.exports = { registerRoutes }
