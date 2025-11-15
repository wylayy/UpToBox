# 🚀 Uplinkr - Modern File Sharing Platform

<div align="center">

**Fast, Secure, and Beautiful File Sharing**

[![CI/CD Pipeline](https://github.com/wylayy/Uplinkr/actions/workflows/test.yml/badge.svg)](https://github.com/wylayy/Uplinkr/actions/workflows/test.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)

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

### Development

```bash
# Clone repository
git clone https://github.com/wylay/Uplinkr.git
cd Uplinkr

# Install dependencies
npm install
cd client && npm install && cd ..

# Start development server
npm run dev
```

App will run at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Configuration

Copy the example environment file and adjust values as needed:

```bash
cp .env.example .env
nano .env
```

Key variables:

- `PORT`, `UPLOAD_DIR`, `MAX_FILE_SIZE`, `NODE_ENV`
- `BASE_URL`, `CLIENT_URL` (must match your public URL in production)
- Optional: `ALLOWED_MIME_TYPES` to restrict allowed MIME types (e.g. `image/png,image/jpeg,application/pdf`)

See **DEPLOYMENT.md** for production examples (including Cloudflare Tunnel).

### Production Deployment

For complete production deployment guide (Ubuntu/Nginx/SSL/PM2), see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

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

## 🔧 Tech Stack

**Backend:** Node.js, Express, Multer, node-cron, express-rate-limit, geoip-lite

**Frontend:** React 18, TailwindCSS, React Router, Axios, Lucide Icons, react-hot-toast, qrcode.react, canvas-confetti, recharts

---

## 📝 License

MIT License

---

<div align="center">

Made with ❤️ by [wylayy](https://waylay.biz.id)

</div>
