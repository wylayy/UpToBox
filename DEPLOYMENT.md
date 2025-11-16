#  Uplinkr Deployment Guide

This guide explains how to deploy Uplinkr to production in a few different ways:

- Docker Compose (simplest, recommended)
- Bare metal (Node.js + PM2 + Nginx)
- Cloudflare Tunnel (cloudflared) to expose Uplinkr securely without opening ports

---

## 1. Application overview

Uplinkr consists of:

- Backend: Node.js + Express (server/index.js)
  - Listens on PORT (default 3001)
  - Uses environment variables:
    - UPLOAD_DIR (default ./uploads)
    - MAX_FILE_SIZE
    - BASE_URL (public URL of the backend)
    - CLIENT_URL (public URL of the frontend, used for redirects /f/:fileId)
- Frontend: React + Vite (client/)
  - Built to static files in client/dist
  - In production usually served by Nginx or by a static host/CDN

Prerequisites:

- Node.js 18+
- npm
- (optional) Docker & Docker Compose
- (optional) Nginx
- (optional) Cloudflare account + cloudflared if using tunnels

---

## 2. Environment variables

Copy the example file and adjust values:

```bash
cp .env.example .env
nano .env
```

Common settings:

```bash
PORT=3001
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600          # 100 MB
BASE_URL=https://uplinkr.example.com
CLIENT_URL=https://uplinkr.example.com
```

For local development you can use http://localhost:3001 and http://localhost:5173.

---

## 3. Deploy with Docker Compose (recommended)

1. Clone repository and install dependencies

```bash
git clone https://github.com/wylay/Uplinkr.git
cd Uplinkr

npm run install:all
npm run build   # builds frontend
```

2. Configure .env (as above).

3. Start with Docker Compose

```bash
docker-compose up -d --build
```

This will:

- Build the Uplinkr image
- Run the backend on port 3001 inside the container
- Mount ./uploads and ./data to /app/uploads and /app/data

4. Health check

```bash
curl http://localhost:3001/health
```

You should see JSON with status: "healthy".

---

## 4. Bare-metal deployment (Node.js + PM2 + Nginx)

1. Clone and install

```bash
sudo mkdir -p /var/www/uplinkr
sudo chown -R $USER:$USER /var/www/uplinkr

cd /var/www/uplinkr
git clone https://github.com/wylay/Uplinkr.git .
npm run install:all
```

2. Configure environment and build frontend

```bash
cp .env.example .env
nano .env      # set BASE_URL and CLIENT_URL to your domain

npm run build  # builds React app into client/dist
```

3. Run backend with PM2

```bash
sudo npm install -g pm2

pm2 start server/index.js --name uplinkr
pm2 save
pm2 startup      # follow the printed command
```

4. Configure Nginx

Use nginx.conf in the repo as base:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/uplinkr.conf
sudo ln -s /etc/nginx/sites-available/uplinkr.conf /etc/nginx/sites-enabled/uplinkr.conf

sudo nginx -t
sudo systemctl reload nginx
```

Make sure paths inside nginx.conf match your install, for example:

- Root: /var/www/uplinkr/client/dist
- Logs: /var/log/nginx/uplinkr-access.log and /var/log/nginx/uplinkr-error.log

5. Check

- Visit https://your-domain/
- Check pm2 status and Nginx logs if something fails.

---

## 5. Deployment via Cloudflare Tunnel (cloudflared)

If you use Cloudflare for DNS, you can expose Uplinkr without opening ports by using Cloudflare Tunnel.

### 5.1 Prerequisites

- Domain managed by Cloudflare, for example uplinkr.example.com
- Uplinkr already running locally on the server:
  - Either via Nginx on port 80/443
  - Or directly via Node on port 3001
- cloudflared installed on the server

Install cloudflared (Ubuntu example):

```bash
# See Cloudflare docs for the latest instructions
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared jammy main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update && sudo apt install -y cloudflared
```

### 5.2 Login and create tunnel

```bash
cloudflared tunnel login          # authorize with Cloudflare in the browser
cloudflared tunnel create uplinkr-tunnel
```

This creates a tunnel and a credentials JSON file under /etc/cloudflared/.

### 5.3 Configure ingress

Create /etc/cloudflared/config.yml:

```yaml
tunnel: uplinkr-tunnel
credentials-file: /etc/cloudflared/<TUNNEL_ID>.json

ingress:
  # If you use Nginx listening on 80/443 as reverse proxy for Uplinkr
  - hostname: uplinkr.example.com
    service: http://localhost:80

  # Or, if you expose the Node server directly without Nginx:
  # - hostname: uplinkr.example.com
  #   service: http://localhost:3001

  # Fallback rule
  - service: http_status:404
```

Replace:

- <TUNNEL_ID> with the actual file name created by cloudflared.
- uplinkr.example.com with your real domain.

### 5.4 Route DNS through the tunnel

```bash
cloudflared tunnel route dns uplinkr-tunnel uplinkr.example.com
```

Cloudflare will create a special CNAME record for the tunnel.

### 5.5 Run the tunnel as a service

Test first:

```bash
cloudflared tunnel run uplinkr-tunnel
```

If it works, install as a system service:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

Now Cloudflare will connect to your tunnel, and traffic to https://uplinkr.example.com will be routed to your server (Nginx or Node) via the tunnel.

### 5.6 Environment variables for tunneled setup

When using a public domain via Cloudflare Tunnel, set in .env:

```bash
BASE_URL=https://uplinkr.example.com
CLIENT_URL=https://uplinkr.example.com
```

Then restart the backend (PM2 or Docker) so it picks up the new values.

### 5.7 Development tunnel (optional)

For local development, you can expose the Vite dev server (with hot reload) via a temporary Cloudflare Tunnel, without Nginx:

```bash
# In the project directory
npm run dev          # starts Vite on http://localhost:5173

# In another terminal
cloudflared tunnel --url http://localhost:5173
```

Cloudflare will print a temporary URL (for example `https://random-string.trycloudflare.com`) that you can open in the browser or share.

This mode is only for temporary debugging; you usually do **not** need to change `BASE_URL` / `CLIENT_URL` in `.env` for this.

---

## 6. Troubleshooting

Health check:

```bash
curl http://localhost:3001/health
```

PM2:

```bash
pm2 status
pm2 logs uplinkr --lines 100
```

Nginx:

```bash
sudo tail -f /var/log/nginx/uplinkr-access.log
sudo tail -f /var/log/nginx/uplinkr-error.log
```

Cloudflared:

```bash
sudo journalctl -u cloudflared -f
cloudflared tunnel list
cloudflared tunnel info uplinkr-tunnel
```

If something still does not work, usually the problem is in one of these:

- BASE_URL / CLIENT_URL in .env
- local firewall rules
- Cloudflare Tunnel ingress configuration

---

Made with love for reliable Uplinkr deployments.
