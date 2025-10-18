# 🚀 Deployment Guide

Complete guide for deploying UpToBox to production.

---

## 📋 Prerequisites

- Ubuntu/Debian server (20.04+ recommended)
- Node.js 18+ installed
- Nginx installed
- SSL certificate (Let's Encrypt recommended)
- Domain name pointed to your server

---

## 🔧 Server Setup

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### 2. Clone and Setup Project

```bash
# Create app directory
sudo mkdir -p /var/www/uptobox
cd /var/www/uptobox

# Clone repository
git clone https://github.com/yourusername/uptobox.git .

# Install dependencies
npm install
cd client && npm install && cd ..

# Build frontend
npm run build

# Create required directories
mkdir -p uploads data

# Set permissions
sudo chown -R $USER:$USER /var/www/uptobox
chmod -R 755 /var/www/uptobox
```

### 3. Configure Environment

```bash
# Create .env file
cat > .env << EOF
PORT=3001
BASE_URL=https://your-domain.com
MAX_FILE_SIZE=104857600
NODE_ENV=production
EOF
```

---

## 🔐 SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

---

## 🌐 Nginx Configuration

### 1. Copy Configuration

```bash
# For production with SSL
sudo cp nginx.conf /etc/nginx/sites-available/uptobox

# Edit configuration
sudo nano /etc/nginx/sites-available/uptobox
```

### 2. Update Configuration

Replace the following in `nginx.conf`:
- `your-domain.com` → Your actual domain
- SSL certificate paths (if not using Let's Encrypt)
- Root path if different from `/var/www/uptobox`

### 3. Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/uptobox /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🚀 Start Application

### Using PM2 (Recommended)

```bash
# Start app with PM2
pm2 start server/index.js --name uptobox

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command output

# View logs
pm2 logs uptobox

# Monitor
pm2 monit
```

### Using Systemd

Create service file:

```bash
sudo nano /etc/systemd/system/uptobox.service
```

Add content:

```ini
[Unit]
Description=UpToBox File Sharing Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/uptobox
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable uptobox
sudo systemctl start uptobox
sudo systemctl status uptobox
```

---

## 🔥 Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if not already)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

---

## 📊 Monitoring & Maintenance

### Check Application Status

```bash
# PM2
pm2 status
pm2 logs uptobox --lines 100

# Systemd
sudo systemctl status uptobox
sudo journalctl -u uptobox -n 100 -f
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/uptobox-access.log

# Error logs
sudo tail -f /var/log/nginx/uptobox-error.log
```

### Disk Usage

```bash
# Check uploads folder size
du -sh /var/www/uptobox/uploads

# Check database size
du -sh /var/www/uptobox/data
```

---

## 🔄 Updates & Deployment

```bash
# Navigate to project
cd /var/www/uptobox

# Pull latest changes
git pull

# Install dependencies
npm install
cd client && npm install && cd ..

# Build frontend
npm run build

# Restart application
pm2 restart uptobox
# OR
sudo systemctl restart uptobox
```

---

## 🔧 Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs uptobox --err

# Check if port is in use
sudo lsof -i :3001

# Check file permissions
ls -la /var/www/uptobox
```

### Nginx errors

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### File upload issues

```bash
# Check upload directory permissions
ls -la /var/www/uptobox/uploads

# Fix permissions
sudo chown -R www-data:www-data /var/www/uptobox/uploads
chmod -R 755 /var/www/uptobox/uploads
```

---

## 🎯 Performance Optimization

### Enable Gzip in Nginx

Add to nginx.conf server block:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### PM2 Cluster Mode

```bash
# Use multiple CPU cores
pm2 start server/index.js -i max --name uptobox
```

### Database Backup

```bash
# Create backup script
cat > /var/www/uptobox/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/uptobox"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/data-$DATE.tar.gz /var/www/uptobox/data
tar -czf $BACKUP_DIR/uploads-$DATE.tar.gz /var/www/uptobox/uploads

# Keep only last 7 backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /var/www/uptobox/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/uptobox/backup.sh") | crontab -
```

---

## 🔒 Security Checklist

- [ ] SSL/HTTPS enabled
- [ ] Firewall configured (UFW)
- [ ] Nginx rate limiting enabled
- [ ] Strong server passwords
- [ ] Regular system updates
- [ ] Fail2ban installed (optional)
- [ ] Backup system configured
- [ ] Monitor disk space
- [ ] Log rotation enabled

---

## 📱 Health Monitoring

Test your deployment:

```bash
# Health check
curl https://your-domain.com/health

# Upload test
curl -F "file=@test.txt" https://your-domain.com/api/upload

# Get stats
curl https://your-domain.com/api/stats
```

---

## 🆘 Support

For issues and questions:
- Check logs first
- Review this deployment guide
- Check GitHub issues
- Contact: your-email@example.com

---

**Made with ❤️ by wylay**
