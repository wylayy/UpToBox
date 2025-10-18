# 🚀 Deployment Guide

## Deploy to Vercel

### Quick Deploy (1-Click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wylay/uptobox)

### Manual Deployment

#### Prerequisites
- Vercel account (free tier available)
- Git repository

#### Steps

**1. Install Vercel CLI**
```bash
npm install -g vercel
```

**2. Login to Vercel**
```bash
vercel login
```

**3. Deploy to Preview**
```bash
vercel
```

**4. Deploy to Production**
```bash
vercel --prod
```

#### Environment Variables

Set these in Vercel Dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `BASE_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `MAX_FILE_SIZE` | `104857600` | Max file size in bytes (100MB) |
| `NODE_ENV` | `production` | Environment mode |

**To set via CLI:**
```bash
vercel env add BASE_URL production
vercel env add MAX_FILE_SIZE production
vercel env add NODE_ENV production
```

#### Limitations on Vercel

⚠️ **Important Considerations:**

**Free Tier:**
- Body size limit: 4.5MB
- Execution timeout: 10 seconds
- Bandwidth: 100GB/month

**Pro Tier ($20/month):**
- Body size limit: 4.5MB
- Execution timeout: 60 seconds
- Bandwidth: 1TB/month

**For Large File Uploads:**
- Consider using external storage (AWS S3, Cloudflare R2)
- Or use alternative hosting (DigitalOcean, Heroku, Railway)

---

## Deploy to Railway

### Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/wylay/uptobox)

### Manual Steps

**1. Install Railway CLI**
```bash
npm install -g @railway/cli
```

**2. Login**
```bash
railway login
```

**3. Initialize Project**
```bash
railway init
```

**4. Add Variables**
```bash
railway variables set BASE_URL=https://your-app.railway.app
railway variables set MAX_FILE_SIZE=104857600
```

**5. Deploy**
```bash
railway up
```

**Benefits:**
- ✅ No body size limits
- ✅ Persistent storage
- ✅ Custom domains
- ✅ $5 free credit/month

---

## Deploy to Docker

### Docker Compose (Recommended)

**1. Build and Run**
```bash
docker-compose up -d
```

**2. View Logs**
```bash
docker-compose logs -f
```

**3. Stop**
```bash
docker-compose down
```

### Docker Manual

**1. Build Image**
```bash
docker build -t uptobox .
```

**2. Run Container**
```bash
docker run -d \
  -p 3001:3001 \
  -v $(pwd)/uploads:/app/uploads \
  -v $(pwd)/data:/app/data \
  -e BASE_URL=http://localhost:3001 \
  -e MAX_FILE_SIZE=104857600 \
  --name uptobox-cdn \
  uptobox
```

**3. View Logs**
```bash
docker logs -f uptobox-cdn
```

---

## Deploy to VPS (Ubuntu/Debian)

### Prerequisites
- Ubuntu 20.04+ or Debian 11+
- Root or sudo access
- Domain name (optional)

### Installation

**1. Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Clone Repository**
```bash
git clone https://github.com/wylay/uptobox.git
cd uptobox
```

**3. Install Dependencies**
```bash
npm install
cd client && npm install && cd ..
```

**4. Build Frontend**
```bash
npm run build
```

**5. Create Environment File**
```bash
cp .env.example .env
nano .env
```

Set your values:
```env
PORT=3001
BASE_URL=https://yourdomain.com
MAX_FILE_SIZE=104857600
NODE_ENV=production
```

**6. Setup PM2**
```bash
sudo npm install -g pm2
pm2 start server/index.js --name uptobox
pm2 save
pm2 startup
```

**7. Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/uptobox
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**8. Enable Site**
```bash
sudo ln -s /etc/nginx/sites-available/uptobox /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**9. Setup SSL (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Server port |
| `BASE_URL` | Yes | - | Base URL for file links |
| `CLIENT_URL` | No | `http://localhost:5173` | Frontend URL for CORS |
| `MAX_FILE_SIZE` | No | `104857600` | Max file size (100MB) |
| `UPLOAD_DIR` | No | `./uploads` | Upload directory path |
| `NODE_ENV` | No | `development` | Environment mode |

---

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] BASE_URL points to correct domain
- [ ] SSL/HTTPS enabled
- [ ] Firewall configured
- [ ] Rate limits reviewed
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Custom domain configured
- [ ] Email notifications (optional)
- [ ] Analytics configured (optional)

---

## Troubleshooting

### Vercel Issues

**"Body exceeded limit"**
- Reduce MAX_FILE_SIZE
- Use Vercel Pro
- Implement client-side chunking

**"Execution timeout"**
- Optimize upload handler
- Use streaming upload
- Consider alternative hosting

### Docker Issues

**"Cannot connect to database"**
```bash
docker-compose down -v
docker-compose up -d
```

**"Permission denied: uploads"**
```bash
chmod -R 755 uploads data
```

### VPS Issues

**"pm2 not starting"**
```bash
pm2 logs uptobox
pm2 restart uptobox
```

**"Nginx 502 Bad Gateway"**
```bash
pm2 status
sudo systemctl status nginx
sudo nginx -t
```

---

## Support

- 📖 [Documentation](README.md)
- 🐛 [Issue Tracker](https://github.com/wylay/uptobox/issues)
- 💬 [Discussions](https://github.com/wylay/uptobox/discussions)

---

**Happy Deploying! 🚀**
