# 🚀 UpToBox - Modern File Sharing Platform

<div align="center">

**Fast, Secure, and Beautiful File Sharing**

[![CI/CD Pipeline](https://github.com/wylay/uptobox/actions/workflows/test.yml/badge.svg)](https://github.com/wylay/uptobox/actions/workflows/test.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ Features

- 🎨 **Modern UI** - Dark mode, responsive design, glassmorphism effects
- 📤 **Easy Upload** - Drag & drop, paste screenshots (Ctrl+V), progress tracking
- ⏰ **Auto Expiry** - Files expire automatically (1 day, 7 days, 1 month, or never)
- 👁️ **File Preview** - View images, videos, audio, PDFs in browser
- 📱 **QR Code** - Share files via QR code
- 📊 **Analytics** - Download tracking, geolocation, charts
- 🔒 **Secure** - Rate limiting, helmet security, auto cleanup
- 🐳 **Docker Ready** - Full containerization support

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

## 🔌 API Documentation

### Upload File
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "file=@document.pdf" \
  -F "expiry=7days"
```

### Available Endpoints
- `POST /api/upload` - Upload file
- `GET /api/file/:fileId` - Get file info
- `GET /api/download/:fileId` - Download file
- `GET /api/analytics/:fileId` - Get analytics
- `GET /api/stats` - System stats
- `GET /health` - Health check

---

## 🐳 Deployment

### Docker

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
MAX_FILE_SIZE=104857600
NODE_ENV=production
```

---

## 🔧 Tech Stack

**Backend:** Node.js, Express, Multer, node-cron, express-rate-limit, geoip-lite

**Frontend:** React 18, TailwindCSS, React Router, Axios, Lucide Icons, react-hot-toast, qrcode.react, canvas-confetti, recharts

---

## 📝 License

MIT License

---

<div align="center">

Made with ❤️ by [wylay](https://waylay.biz.id)

</div>
