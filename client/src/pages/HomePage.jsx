import { useEffect, Suspense, lazy } from 'react'
import FileUploader from '../components/FileUploader'
const SystemStats = lazy(() => import('../components/SystemStats'))
const ApiDocumentation = lazy(() => import('../components/ApiDocumentation'))
import { Zap, Shield, Cloud } from 'lucide-react'

function HomePage() {
  useEffect(() => {
    document.title = 'Uplinkr - Fast & Secure File Sharing'
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Share Files Instantly
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Fast, secure, and simple file sharing. Upload your files and get a shareable link in seconds.
        </p>
      </div>

      {/* Upload Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <FileUploader />
      </div>


      {/* Features Section */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
        <div className="card text-center">
          <div className="inline-block p-3 bg-blue-600/20 rounded-full mb-4">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
          <p className="text-slate-300">
            Upload and share files in seconds with our high-speed infrastructure
          </p>
        </div>
        <div className="card text-center">
          <div className="inline-block p-3 bg-green-600/20 rounded-full mb-4">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
          <p className="text-slate-300">
            Your files are stored securely with unique IDs that only you know
          </p>
        </div>
        <div className="card text-center">
          <div className="inline-block p-3 bg-purple-600/20 rounded-full mb-4">
            <Cloud className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">CDN Powered</h3>
          <p className="text-slate-300">
            Fast downloads from anywhere in the world with CDN technology
          </p>
        </div>
      </div>

      {/* System Stats Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <Suspense fallback={<div className="card text-center text-slate-400">Loading system stats...</div>}>
          <SystemStats />
        </Suspense>
      </div>

      {/* API Documentation Section */}
      <div className="max-w-6xl mx-auto mb-16">
        <Suspense fallback={<div className="card text-center text-slate-400">Loading API examples...</div>}>
          <ApiDocumentation />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="text-center mt-16 text-slate-400 space-y-3 pb-8">
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
        <p className="text-xs opacity-70">Built with React, Express, and TailwindCSS</p>
      </footer>
    </div>
  )
}

export default HomePage
