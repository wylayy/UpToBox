# 🚀 UpToBox - Modern File Sharing Platform

<div align="center">

![UpToBox Logo](https://img.shields.io/badge/UpToBox-CDN-0ea5e9?style=for-the-badge&logo=cloudflare)

**Fast, Secure, and Beautiful File Sharing**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/wylay/uptobox)

[Features](#-features) • [Quick Start](#-quick-start) • [API Docs](#-api-documentation) • [Deploy](#-deployment)

</div>

---

## Features

### 🎨 UI/UX Excellence
- 🌙 **Dark Mode Design** - Beautiful dark theme optimized for night viewing
- 🎉 **Confetti Animations** - Celebrate successful uploads
- Fully Responsive - Perfect on desktop, tablet, and mobile
- Modern Glassmorphism - Beautiful backdrop blur effects
- File Type Icons - Color-coded icons for different file types
- Skeleton Loading - Smooth loading states
- Smooth Animations - Delightful micro-interactions

### Upload Features
- Drag & Drop - Intuitive file upload
- Progress Bar - Real-time upload progress
- File Expiry - Set expiration (1 day, 7 days, 1 month, never)
- Instant Copy - One-click link copying
- Toast Notifications - Beautiful feedback for all actions
- Paste Screenshots - Ctrl+V to paste and upload instantly
### 📤 **Upload Features**
- 🖱️ **Drag & Drop** - Intuitive file upload
- 📊 **Progress Bar** - Real-time upload progress
- ⏰ **File Expiry** - Set expiration (1 day, 7 days, 1 month, never)
- 📋 **Instant Copy** - One-click link copying
- 🔔 **Toast Notifications** - Beautiful feedback for all actions
- 📸 **Paste Screenshots** - Ctrl+V to paste and upload instantly

### 🔍 **Preview & Sharing**
- 👁️ **File Preview** - View images, videos, audio, PDFs in-browser
- 📱 **QR Code Generator** - Share files via QR code
- 🔗 **Direct Download Links** - Permanent download URLs
- 📊 **File Type Detection** - Automatic MIME type handling

### 📊 **Analytics & Monitoring**
- 📈 **Download Analytics** - Track downloads with charts
- 🌍 **Geolocation** - IP-based country/city tracking
- 🔗 **Referrer Tracking** - See where links are shared
- 📊 **Dashboard Charts** - Visual analytics with Recharts
- 🏆 **Top Files** - Most downloaded files leaderboard
- 📉 **File Type Distribution** - Pie chart of file types

### 🛡️ **Security & Performance**
- 🚦 **Rate Limiting** - Prevent spam and abuse
  - Upload: 10 files/hour per IP
  - Download: 50 files/hour per IP
  - API: 100 requests/15min per IP
- 🗜️ **Gzip Compression** - Faster API responses
- 💾 **Persistent Storage** - JSON-based database
- 🧹 **Auto Cleanup** - Expired files deleted hourly
- 🔐 **Helmet Security** - HTTP headers protection
- ⚡ **CORS Configured** - Secure cross-origin requests
- 📦 **No Processing** - Direct upload, no compression delays

### 🛠️ **Developer Features**
- 📚 **API Documentation** - Examples in 9+ languages
- 🔄 **Accordion UI** - Collapsible code examples
- 📋 **Copy Code** - One-click code copying
- 🏥 **Health Check** - `/health` endpoint for monitoring
- 🐳 **Docker Ready** - Full containerization support
- 📊 **System Stats** - Real-time server metrics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/wylay/uptobox.git
cd uptobox

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..

# Start development server
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

---

## 📁 Project Structure

```
uptobox/
├── server/
│   ├── index.js              # Express server
│   ├── database.js           # JSON database
│   ├── cleanup.js            # Cron job for expired files
│   └── middleware/
│       ├── rateLimiter.js    # Rate limiting config
│       └── analytics.js      # Analytics tracking
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUploader.jsx
│   │   │   ├── QRCodeModal.jsx
│   │   │   ├── FilePreview.jsx
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── ApiDocumentation.jsx
│   │   │   ├── SystemStats.jsx
│   │   │   ├── Header.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx
│   │   ├── utils/
│   │   │   ├── imageCompression.js
│   │   │   ├── confetti.js
│   │   │   └── fileIcons.js
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   └── FilePage.jsx
│   │   └── App.jsx
│   └── package.json
├── uploads/                   # Uploaded files
├── data/                      # Database storage
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Documentation

### Upload File
```bash
POST /api/upload
```

**Request:**
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@document.pdf" \
  -F "expiry=7days"
```

**Response:**
```json
{
  "success": true,
  "file": {
    "id": "abc123xyz",
    "name": "document.pdf",
    "size": 1048576,
    "url": "http://localhost:3001/f/abc123xyz",
    "downloadUrl": "http://localhost:3001/api/download/abc123xyz",
    "expiryDate": "2025-10-25T07:00:00.000Z"
  }
}
```

### Get File Info
```bash
GET /api/file/:fileId
```

### Download File
```bash
GET /api/download/:fileId
```

### Get Analytics
```bash
GET /api/analytics/:fileId
```

### System Stats
```bash
GET /api/stats
```

### Health Check
```bash
GET /health
```

See [API_EXAMPLES.md](./API_EXAMPLES.md) for examples in 11 programming languages.

---

## 🐳 Deployment

### ▲ Deploy to Vercel (Recommended)

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wylay/uptobox)

**Manual Deploy:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Deploy to production
vercel --prod
```

**Environment Variables (Vercel):**

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
BASE_URL=https://your-project.vercel.app
MAX_FILE_SIZE=104857600
NODE_ENV=production
```

**Features on Vercel:**
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless Functions
- ✅ Auto-scaling
- ✅ Zero configuration
- ✅ Free tier available

**Important Notes:**
- Vercel has file upload limits (4.5MB body size for free tier)
- For larger files, consider using Vercel Pro or alternative hosting
- Uploaded files are ephemeral (use external storage like AWS S3 for persistence)

---

### 🐳 Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Environment Variables

Create `.env` file:
```env
PORT=3001
BASE_URL=http://localhost:3001
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=104857600
UPLOAD_DIR=./uploads
NODE_ENV=production
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `BASE_URL` to your domain
- [ ] Setup reverse proxy (Nginx)
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall
- [ ] Setup automated backups
- [ ] Configure monitoring
- [ ] Review rate limits

---

## 🎯 Usage Examples

### Via Web Interface
1. Open http://localhost:5173
2. Drag & drop files or click to select
3. Choose expiry time
4. Get instant shareable link!

### Via API (JavaScript)
```javascript
const formData = new FormData()
formData.append('file', fileInput.files[0])
formData.append('expiry', '7days')

const response = await fetch('http://localhost:3001/api/upload', {
  method: 'POST',
  body: formData
})

const data = await response.json()
console.log(data.file.url) // Share this URL!
```

### Via cURL
```bash
curl -F "file=@photo.jpg" \
     -F "expiry=1day" \
     http://localhost:3001/api/upload
```

---

## 🎨 Features Showcase

### 📊 Analytics Dashboard
- Download statistics with charts
- Geolocation tracking
- Referrer analysis
- File type distribution

### 📸 Screenshot Upload
- Paste screenshots with Ctrl+V
- Auto-rename blob files
- Instant upload without delays

### 🎉 Upload Celebration
- Confetti animation on success
- Visual feedback
- Enhanced user experience

### 📱 QR Code Sharing
- Instant QR code generation
- Mobile-friendly sharing
- High-quality QR codes

---

## 🔧 Tech Stack

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Multer** - File upload handling
- **node-cron** - Scheduled tasks
- **express-rate-limit** - Rate limiting
- **geoip-lite** - IP geolocation
- **compression** - Gzip compression
- **helmet** - Security headers

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **react-hot-toast** - Notifications
- **qrcode.react** - QR codes
- **canvas-confetti** - Animations
- **recharts** - Charts
- **react-dropzone** - Drag & drop support

---

## 📈 Performance

- **Upload Progress**: Real-time feedback
- **Direct Upload**: No processing delays
- **Lazy Loading**: Efficient rendering
- **Gzip**: Compressed API responses
- **Caching**: Optimized assets
- **Rate Limiting**: Prevent abuse

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

## 📝 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Built By

**Built by wylay with ❤️ for community**

Sponsored by [WaylayCloud](https://waylay.biz.id)

---

## 🙏 Acknowledgments

- Icon set by Lucide
- Charts by Recharts
- UI inspired by modern design systems

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ using React, Express, and TailwindCSS

</div>
