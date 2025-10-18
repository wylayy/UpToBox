import { useEffect, useState } from 'react'
import axios from 'axios'
import { Server, HardDrive, Files, Download, Cpu, Activity, RefreshCw } from 'lucide-react'

function SystemStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  if (loading && !stats) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-primary-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm mb-1">Total Files</p>
              <p className="text-3xl font-bold">{stats?.totalFiles || 0}</p>
            </div>
            <div className="bg-blue-600/30 p-3 rounded-lg">
              <Files className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm mb-1">Total Storage</p>
              <p className="text-3xl font-bold">{formatBytes(stats?.totalSize || 0)}</p>
            </div>
            <div className="bg-purple-600/30 p-3 rounded-lg">
              <HardDrive className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm mb-1">Total Downloads</p>
              <p className="text-3xl font-bold">{stats?.totalDownloads || 0}</p>
            </div>
            <div className="bg-green-600/30 p-3 rounded-lg">
              <Download className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      {stats?.system && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Server className="w-5 h-5 mr-2 text-primary-400" />
              System Information
            </h3>
            <button 
              onClick={fetchStats}
              className="text-slate-400 hover:text-white transition-colors"
              title="Refresh stats"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Cpu className="w-4 h-4 text-primary-400 mr-2" />
                <p className="text-slate-400 text-sm">Platform</p>
              </div>
              <p className="text-lg font-semibold">
                {stats.system.platform} ({stats.system.arch})
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Activity className="w-4 h-4 text-green-400 mr-2" />
                <p className="text-slate-400 text-sm">Node.js Version</p>
              </div>
              <p className="text-lg font-semibold">{stats.system.nodeVersion}</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Activity className="w-4 h-4 text-blue-400 mr-2" />
                <p className="text-slate-400 text-sm">Server Uptime</p>
              </div>
              <p className="text-lg font-semibold">{formatUptime(stats.system.uptime)}</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 md:col-span-3">
              <div className="flex items-center mb-2">
                <Cpu className="w-4 h-4 text-purple-400 mr-2" />
                <p className="text-slate-400 text-sm">CPU Information</p>
              </div>
              <p className="text-lg font-semibold mb-1">{stats.system.cpuModel}</p>
              <p className="text-sm text-slate-400">{stats.system.cpus} cores</p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 md:col-span-3">
              <div className="flex items-center mb-2">
                <HardDrive className="w-4 h-4 text-yellow-400 mr-2" />
                <p className="text-slate-400 text-sm">Memory Usage</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {formatBytes(stats.system.memory.used)}</span>
                  <span>Total: {formatBytes(stats.system.memory.total)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.system.memory.used / stats.system.memory.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Files */}
      {stats?.files && stats.files.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Files className="w-5 h-5 mr-2 text-primary-400" />
            Recent Files ({stats.files.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-2 px-3 text-slate-400 text-sm">File Name</th>
                  <th className="text-left py-2 px-3 text-slate-400 text-sm">Size</th>
                  <th className="text-left py-2 px-3 text-slate-400 text-sm">Downloads</th>
                  <th className="text-left py-2 px-3 text-slate-400 text-sm">Upload Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.files.slice(0, 10).map((file) => (
                  <tr key={file.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-3 font-medium truncate max-w-xs">{file.name}</td>
                    <td className="py-3 px-3 text-slate-400">{formatBytes(file.size)}</td>
                    <td className="py-3 px-3 text-slate-400">{file.downloads}</td>
                    <td className="py-3 px-3 text-slate-400 text-sm">
                      {new Date(file.uploadDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default SystemStats
