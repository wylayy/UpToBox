const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const db = require('../database')
const { trackDownload } = require('../middleware/analytics')
const { UPLOAD_DIR, BASE_URL, ALLOWED_MIME_TYPES } = require('../config')

const ALLOWED_EXPIRY_OPTIONS = ['1day', '7days', '1month', 'never']

function calculateExpiryDate(expiryOption) {
  if (!expiryOption || expiryOption === 'never') {
    return null
  }

  const now = new Date()
  switch (expiryOption) {
    case '1day':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    case '7days':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    case '1month':
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
    default:
      return null
  }
}

function isExpiryOptionAllowed(expiryOption) {
  return ALLOWED_EXPIRY_OPTIONS.includes(expiryOption)
}

function cleanupPhysicalFile(filename) {
  try {
    const filePath = path.join(UPLOAD_DIR, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (_err) {
    // swallow cleanup errors
  }
}

function isMimeTypeAllowed(file) {
  if (!ALLOWED_MIME_TYPES || ALLOWED_MIME_TYPES.length === 0) {
    return true
  }
  return ALLOWED_MIME_TYPES.includes(file.mimetype)
}

function createFileRecord({ file, expiryOption, customFilename, password }) {
  if (!file) {
    return {
      ok: false,
      status: 400,
      message: 'No file uploaded'
    }
  }

  const normalizedExpiry = expiryOption || 'never'

  if (!isExpiryOptionAllowed(normalizedExpiry)) {
    cleanupPhysicalFile(file.filename)
    return {
      ok: false,
      status: 400,
      message: 'Invalid expiry option'
    }
  }

  if (!isMimeTypeAllowed(file)) {
    cleanupPhysicalFile(file.filename)
    return {
      ok: false,
      status: 400,
      message: 'File type not allowed'
    }
  }

  let passwordHash = null
  let passwordSalt = null

  if (password && password.trim()) {
    passwordSalt = crypto.randomBytes(16).toString('hex')
    passwordHash = crypto
      .createHash('sha256')
      .update(passwordSalt + password)
      .digest('hex')
  }

  const fileId = path.parse(file.filename).name
  const expiryDate = calculateExpiryDate(normalizedExpiry)
  const originalName = customFilename || file.originalname

  const fileData = {
    id: fileId,
    originalName,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
    uploadDate: new Date().toISOString(),
    expiryDate,
    password_hash: passwordHash,
    password_salt: passwordSalt
  }

  const saved = db.addFile(fileData)
  if (!saved) {
    cleanupPhysicalFile(file.filename)
    return {
      ok: false,
      status: 500,
      message: 'Failed to save file metadata'
    }
  }

  const fileUrl = `${BASE_URL}/f/${fileId}`
  const downloadUrl = `${BASE_URL}/api/download/${fileId}`

  return {
    ok: true,
    status: 200,
    file: {
      id: fileId,
      name: originalName,
      size: file.size,
      mimetype: file.mimetype,
      type: file.mimetype,
      url: fileUrl,
      downloadUrl,
      expiryDate,
      hasPassword: !!passwordHash
    }
  }
}

function getFileRecordWithPath(fileId) {
  const fileData = db.getFile(fileId)

  if (!fileData) {
    return {
      ok: false,
      status: 404,
      message: 'File not found'
    }
  }

  const filePath = path.join(UPLOAD_DIR, fileData.filename)

  if (!fs.existsSync(filePath)) {
    db.deleteFile(fileId)
    return {
      ok: false,
      status: 404,
      message: 'File not found'
    }
  }

  return {
    ok: true,
    status: 200,
    fileData,
    filePath
  }
}

function getFileForDownload(fileId, req) {
  const baseResult = getFileRecordWithPath(fileId)

  if (!baseResult.ok) {
    return baseResult
  }

  const { fileData, filePath } = baseResult

  const hasPassword = !!fileData.password_hash

  if (hasPassword) {
    const providedPassword =
      (req.query && req.query.password) || req.headers['x-download-password']

    if (!providedPassword || !providedPassword.trim()) {
      return {
        ok: false,
        status: 401,
        message: 'Password required for this file'
      }
    }

    const computedHash = crypto
      .createHash('sha256')
      .update((fileData.password_salt || '') + providedPassword)
      .digest('hex')

    if (computedHash !== fileData.password_hash) {
      return {
        ok: false,
        status: 403,
        message: 'Invalid password'
      }
    }
  }

  try {
    const analyticsData = trackDownload(fileId, req)
    db.addAnalytics(analyticsData)
    db.incrementDownloads(fileId)
  } catch (err) {
    console.error('Analytics tracking error:', err)
  }

  return {
    ok: true,
    status: 200,
    filePath,
    downloadName: fileData.original_name
  }
}

function getFileInfo(fileId) {
  const baseResult = getFileRecordWithPath(fileId)

  if (!baseResult.ok) {
    return baseResult
  }

  const { fileData } = baseResult

  return {
    ok: true,
    status: 200,
    data: {
      id: fileData.id,
      name: fileData.original_name,
      size: fileData.size,
      mimetype: fileData.mimetype,
      uploadDate: fileData.upload_date,
      expiryDate: fileData.expiry_date,
      downloads: fileData.downloads,
      hasPassword: !!fileData.password_hash,
      url: `${BASE_URL}/f/${fileId}`,
      downloadUrl: `${BASE_URL}/api/download/${fileId}`
    }
  }
}

module.exports = {
  ALLOWED_EXPIRY_OPTIONS,
  calculateExpiryDate,
  createFileRecord,
  getFileForDownload,
  getFileInfo
}
