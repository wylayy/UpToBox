import { X } from 'lucide-react'

function FilePreview({ file, onClose }) {
  const renderPreview = () => {
    if (file.mimetype.startsWith('image/')) {
      return (
        <img 
          src={file.downloadUrl} 
          alt={file.name}
          className="max-w-full max-h-[70vh] object-contain rounded-lg"
        />
      )
    }

    if (file.mimetype.startsWith('video/')) {
      return (
        <video 
          controls 
          className="max-w-full max-h-[70vh] rounded-lg"
          autoPlay
        >
          <source src={file.downloadUrl} type={file.mimetype} />
          Your browser does not support video playback.
        </video>
      )
    }

    if (file.mimetype.startsWith('audio/')) {
      return (
        <div className="p-8">
          <audio controls className="w-full" autoPlay>
            <source src={file.downloadUrl} type={file.mimetype} />
            Your browser does not support audio playback.
          </audio>
        </div>
      )
    }

    if (file.mimetype === 'application/pdf') {
      return (
        <iframe
          src={file.downloadUrl}
          className="w-full h-[70vh] rounded-lg"
          title={file.name}
        />
      )
    }

    return (
      <div className="p-8 text-center text-slate-400">
        <p>Preview not available for this file type</p>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-xl max-w-6xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700 dark:border-slate-700 light:border-gray-200">
          <h3 className="text-lg font-semibold dark:text-white light:text-gray-900 truncate flex-1">
            {file.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 rounded-lg transition-colors ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 flex items-center justify-center">
          {renderPreview()}
        </div>
      </div>
    </div>
  )
}

export default FilePreview
