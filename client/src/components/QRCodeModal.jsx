import { X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

function QRCodeModal({ url, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold dark:text-white light:text-gray-900">QR Code</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg flex justify-center">
          <QRCodeSVG 
            value={url} 
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <p className="text-sm text-slate-400 dark:text-slate-400 light:text-gray-600 mt-4 text-center">
          Scan this QR code to access the file
        </p>
      </div>
    </div>
  )
}

export default QRCodeModal
