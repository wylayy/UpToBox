import { 
  FileText, FileImage, FileVideo, FileAudio, FileArchive, 
  FileCode, FileSpreadsheet, File, FileType 
} from 'lucide-react'

export function getFileIcon(mimetype) {
  if (!mimetype) return File

  // Images
  if (mimetype.startsWith('image/')) return FileImage
  
  // Videos
  if (mimetype.startsWith('video/')) return FileVideo
  
  // Audio
  if (mimetype.startsWith('audio/')) return FileAudio
  
  // Documents
  if (mimetype.includes('pdf') || 
      mimetype.includes('document') || 
      mimetype.includes('word')) return FileText
  
  // Spreadsheets
  if (mimetype.includes('sheet') || 
      mimetype.includes('excel')) return FileSpreadsheet
  
  // Archives
  if (mimetype.includes('zip') || 
      mimetype.includes('rar') || 
      mimetype.includes('7z') || 
      mimetype.includes('tar')) return FileArchive
  
  // Code files
  if (mimetype.includes('javascript') || 
      mimetype.includes('json') || 
      mimetype.includes('html') || 
      mimetype.includes('css') || 
      mimetype.includes('xml')) return FileCode
  
  // Default
  return FileType
}

export function getFileColor(mimetype) {
  if (!mimetype) return 'text-slate-400'
  
  if (mimetype.startsWith('image/')) return 'text-green-400'
  if (mimetype.startsWith('video/')) return 'text-red-400'
  if (mimetype.startsWith('audio/')) return 'text-purple-400'
  if (mimetype.includes('pdf')) return 'text-red-400'
  if (mimetype.includes('document') || mimetype.includes('word')) return 'text-blue-400'
  if (mimetype.includes('sheet') || mimetype.includes('excel')) return 'text-green-400'
  if (mimetype.includes('zip') || mimetype.includes('rar')) return 'text-yellow-400'
  if (mimetype.includes('javascript') || mimetype.includes('json')) return 'text-cyan-400'
  
  return 'text-slate-400'
}

export function canPreview(mimetype) {
  if (!mimetype) return false
  
  return mimetype.startsWith('image/') || 
         mimetype.startsWith('video/') || 
         mimetype.startsWith('audio/') ||
         mimetype === 'application/pdf' ||
         mimetype.startsWith('text/')
}
