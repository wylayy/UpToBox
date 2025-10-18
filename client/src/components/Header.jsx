import { Link } from 'react-router-dom'
import { Cloud } from 'lucide-react'

function Header() {
  return (
    <header className="border-b border-white/10 backdrop-blur-lg bg-white/5">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              UpToBox
            </h1>
            <p className="text-xs text-slate-400">Fast & Secure File Sharing</p>
          </div>
        </Link>
        
        <a 
          href="https://waylay.biz.id" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 px-4 py-2 rounded-lg hover:border-blue-500/50 transition-all group"
        >
          <span className="text-sm text-slate-300">Powered by</span>
          <span className="font-bold text-primary-400 group-hover:text-primary-300 transition-colors">WaylayCloud</span>
        </a>
      </div>
    </header>
  )
}

export default Header
