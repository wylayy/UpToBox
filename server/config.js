require('dotenv').config()

const PORT = process.env.PORT || 3001
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE, 10) || 100 * 1024 * 1024 // 100MB default
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const NODE_ENV = process.env.NODE_ENV || 'development'
const ALLOWED_MIME_TYPES = process.env.ALLOWED_MIME_TYPES
  ? process.env.ALLOWED_MIME_TYPES.split(',').map((t) => t.trim()).filter(Boolean)
  : null

const CLAMAV_ENABLED = process.env.CLAMAV_ENABLED === 'true'
const CLAMSCAN_PATH = process.env.CLAMSCAN_PATH || 'clamscan'

module.exports = {
  PORT,
  UPLOAD_DIR,
  MAX_FILE_SIZE,
  BASE_URL,
  CLIENT_URL,
  NODE_ENV,
  ALLOWED_MIME_TYPES,
  CLAMAV_ENABLED,
  CLAMSCAN_PATH
}
