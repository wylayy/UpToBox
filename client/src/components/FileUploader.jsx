import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Check, AlertCircle, Clock, QrCode, Eye } from 'lucide-react'
import apiClient from '../utils/apiClient'
import toast from 'react-hot-toast'
import { celebrateUpload } from '../utils/confetti'
import { getFileIcon, getFileColor, canPreview } from '../utils/fileIcons'
import QRCodeModal from './QRCodeModal'
import FilePreview from './FilePreview'

function FileUploader() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [expiry, setExpiry] = useState('never')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState(null)
  const [previewFile, setPreviewFile] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null)
    setUploading(true)
    setUploadProgress(0)

    for (const file of acceptedFiles) {
      // Fix blob filename - rename to something more descriptive
      let fileToUpload = file
      let customFileName = null
      
      if (file.name === 'blob' || file.name.startsWith('blob.')) {
        const ext = file.type.split('/')[1] || 'png'
        const timestamp = new Date().getTime()
        customFileName = `image-${timestamp}.${ext}`
        
        fileToUpload = new File([file], customFileName, { type: file.type })
        console.log(`📝 Renamed blob to: ${customFileName}`)
      }
      
      const displayName = customFileName || file.name
      const loadingToast = toast.loading(`Uploading ${displayName}...`)
      
      try {
        const formData = new FormData()
        formData.append('file', fileToUpload)
        formData.append('expiry', expiry)

        if (password) {
          formData.append('password', password)
        }
        
        // Send custom filename if we renamed it
        if (customFileName) {
          formData.append('customFilename', customFileName)
        }
        
        // Debug: verify filename in FormData
        console.log('📤 Uploading file:', {
          name: fileToUpload.name,
          customFileName: customFileName,
          size: fileToUpload.size,
          type: fileToUpload.type
        })

        const response = await apiClient.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress(percentCompleted)
          }
        })

        if (response.data.success) {
          console.log('✅ Upload response:', response.data.file)
          setUploadedFiles(prev => [...prev, response.data.file])
          toast.success(`${displayName} uploaded successfully!`, { id: loadingToast })
          celebrateUpload() // 🎉 Confetti animation!
        }
      } catch (err) {
        console.error('Upload error:', err)
        const errorMsg = err.response?.data?.error || 'Upload failed'
        setError(errorMsg)
        toast.error(errorMsg, { id: loadingToast })
      }
    }

    setUploading(false)
    setUploadProgress(0)
  }, [expiry])

  // Handle paste event for screenshots
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items
    if (!items) return

    const files = []
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) files.push(file)
      }
    }

    if (files.length > 0) {
      onDrop(files)
      toast.success('📋 Image pasted! Uploading...')
    }
  }, [onDrop])

  // Add paste listener
  useEffect(() => {
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  })

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Link copied to clipboard!')
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Expiry Selection */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-3">
          <Clock className="w-5 h-5 text-primary-400" />
          <h3 className="font-semibold">File Expiry</h3>
        </div>
        <select 
          value={expiry} 
          onChange={(e) => setExpiry(e.target.value)}
          className="input w-full"
          disabled={uploading}
        >
          <option value="1day">1 Day</option>
          <option value="7days">7 Days</option>
          <option value="1month">1 Month</option>
          <option value="never">Never Expire</option>
        </select>
        <p className="text-xs text-slate-400 mt-2">
          Files will be automatically deleted after the expiry period
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input w-full mt-3"
          placeholder="Optional password to protect downloads"
          disabled={uploading}
        />
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`card border-2 border-dashed cursor-pointer transition-all duration-300 hover:border-primary-500 hover:bg-white/5 ${
          isDragActive ? 'border-primary-500 bg-white/5 scale-105' : 'border-white/20'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block p-4 bg-primary-600/20 rounded-full mb-4">
            <Upload className="w-12 h-12 text-primary-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold mb-2">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-slate-400 mb-1">or click to select files</p>
          <p className="text-xs text-slate-500 mb-4">
            💡 Tip: Press <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Ctrl+V</kbd> to paste screenshots
          </p>
          <button className="btn-primary px-4 py-2 text-sm" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Select Files'}
          </button>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && uploadProgress > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-sm text-slate-400">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="card bg-red-500/20 border-red-500/50 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Check className="w-5 h-5 text-green-400 mr-2" />
            Uploaded Files
          </h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => {
              const FileIcon = getFileIcon(file.mimetype || file.type)
              const iconColor = getFileColor(file.mimetype || file.type)
              
              return (
                <div
                  key={index}
                  className="bg-slate-800/50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="bg-primary-600/20 p-2 rounded">
                      <FileIcon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:space-x-2 sm:gap-2 sm:ml-4">
                    {canPreview(file.mimetype || file.type) && (
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="p-2 hover:bg-slate-700 rounded transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setQrCodeUrl(file.url)}
                      className="p-2 hover:bg-slate-700 rounded transition-colors"
                      title="QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(file.url)}
                      className="btn-secondary text-xs sm:text-sm py-1 px-3"
                    >
                      Copy Link
                    </button>
                    {file.shortUrl && (
                      <button
                        onClick={() => copyToClipboard(file.shortUrl)}
                        className="btn-secondary text-xs sm:text-sm py-1 px-3"
                      >
                        Copy Short
                      </button>
                    )}
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="btn-primary text-xs sm:text-sm py-1 px-3"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrCodeUrl && (
        <QRCodeModal 
          url={qrCodeUrl} 
          onClose={() => setQrCodeUrl(null)} 
        />
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreview 
          file={previewFile} 
          onClose={() => setPreviewFile(null)} 
        />
      )}
    </div>
  )
}

export default FileUploader
