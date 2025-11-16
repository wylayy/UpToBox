import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiClient from '../utils/apiClient'
import toast from 'react-hot-toast'
import { Download, File, Calendar, ArrowLeft, AlertCircle, Loader } from 'lucide-react'

function FilePage() {
  const { fileId } = useParams()
  const [fileData, setFileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloadPassword, setDownloadPassword] = useState('')

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await apiClient.get(`/file/${fileId}`)
        setFileData(response.data)
      } catch (err) {
        setError(err.response?.data?.error || 'File not found')
      } finally {
        setLoading(false)
      }
    }

    fetchFileData()
  }, [fileId])

  useEffect(() => {
    if (fileData?.name) {
      document.title = `${fileData.name} - Download File - Uplinkr`
    } else {
      document.title = 'Uplinkr - File'
    }
  }, [fileData])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Link copied to clipboard!')
  }

  const handleDownload = async () => {
    try {
      const config = {
        responseType: 'blob',
      }

      if (fileData.hasPassword && downloadPassword) {
        config.headers = {
          'X-Download-Password': downloadPassword,
        }
      }

      const response = await apiClient.get(`/download/${fileId}`, config)
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileData.name
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      const msg = err.response?.data?.error || 'Download failed'
      toast.error(msg)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Loader className="w-12 h-12 text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading file information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card bg-red-500/20 border-red-500/50 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">File Not Found</h2>
            <p className="text-red-300 mb-6">{error}</p>
            <Link to="/" className="btn-primary inline-block">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-slate-400 hover:text-white mb-6 inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="card mt-6">
          <div className="text-center mb-8">
            <div className="inline-block p-6 bg-primary-600/20 rounded-full mb-4">
              <File className="w-16 h-16 text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{fileData.name}</h1>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">File Size</p>
              <p className="text-xl font-semibold">{formatFileSize(fileData.size)}</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">File Type</p>
              <p className="text-xl font-semibold">{fileData.mimetype}</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Uploaded</p>
              <p className="text-xl font-semibold flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {formatDate(fileData.uploadDate)}
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Downloads</p>
              <p className="text-xl font-semibold">{fileData.downloads}</p>
            </div>
            {fileData.hasPassword && (
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Password</p>
                <input
                  type="password"
                  value={downloadPassword}
                  onChange={(e) => setDownloadPassword(e.target.value)}
                  className="input w-full"
                  placeholder="Enter password to download this file"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownload}
              className="btn-primary flex-1 text-center inline-flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download File
            </button>
            <button
              onClick={() => copyToClipboard(fileData.url)}
              className="btn-secondary flex-1"
            >
              Copy Link
            </button>
            {fileData.shortUrl && (
              <button
                onClick={() => copyToClipboard(fileData.shortUrl)}
                className="btn-secondary flex-1"
              >
                Copy Short Link
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-slate-400 space-y-3 pb-8">
          <div className="flex items-center justify-center space-x-2">
            <span>Sponsored By</span>
            <a 
              href="https://waylay.biz.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-primary-400 hover:text-primary-300 transition-colors"
            >
              WaylayCloud
            </a>
          </div>
          <p className="text-sm">Built by <span className="text-primary-400 font-semibold">wylay</span> with ❤️ for community</p>
        </footer>
      </div>
    </div>
  )
}

export default FilePage
