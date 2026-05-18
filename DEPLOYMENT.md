# LANsnix Deployment Guide

**Created by [Yasir Ispawoo](https://github.com/ispawoo)**

This guide will help you deploy LANsnix from this codebase to production.

## 🚀 Quick Deployment

### Option 1: Docker Compose (Recommended)

```bash
# 1. Navigate to project directory
cd lansnix

# 2. Copy environment file
cp .env.example .env

# 3. (Optional) Edit configuration
nano .env

# 4. Build and start services
docker compose up -d

# 5. Check logs
docker compose logs -f

# 6. Access dashboard
open http://localhost:3000
```

### Option 2: Build from Source

#### Backend

```bash
cd backend

# Install dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y libpcap-dev

# Download Go modules
go mod download

# Build binary
go build -o lansnix ./cmd/server

# Run (requires sudo for network access)
sudo ./lansnix
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 📦 Building Release Binaries

### Linux AMD64

```bash
cd backend
CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o lansnix-linux-amd64 ./cmd/server
```

### Linux ARM64 (Raspberry Pi)

```bash
cd backend
CGO_ENABLED=1 GOOS=linux GOARCH=arm64 go build -ldflags="-w -s" -o lansnix-linux-arm64 ./cmd/server
```

## 🐳 Docker Images

### Build Images

```bash
# Build both images
docker compose build

# Build individually
docker build -t lansnix-backend:latest ./backend
docker build -t lansnix-frontend:latest ./frontend
```

### Push to Docker Hub

```bash
# Tag images
docker tag lansnix-backend:latest ispawoo/lansnix-backend:1.0.0
docker tag lansnix-frontend:latest ispawoo/lansnix-frontend:1.0.0

# Push to Docker Hub
docker push ispawoo/lansnix-backend:1.0.0
docker push ispawoo/lansnix-frontend:1.0.0
```

## 🔧 Production Configuration

### Environment Variables

Create `.env` file with production values:

```bash
# Network Settings
SCAN_INTERVAL=60
SUBNET=auto
INTERFACE=auto

# Port Scanning
PORT_SCAN_ENABLED=true
PORT_RANGES=22,80,443,3389,445,21,53

# API Settings
API_HOST=0.0.0.0
API_PORT=8080
FRONTEND_PORT=3000

# Database
DB_PATH=/var/lib/lansnix/lansnix.db

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Security
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
```

### Systemd Service

Create `/etc/systemd/system/lansnix.service`:

```ini
[Unit]
Description=LANsnix - Realtime LAN Discovery & Monitoring Platform
After=network.target
Documentation=https://github.com/ispawoo/lansnix

[Service]
Type=simple
User=root
WorkingDirectory=/opt/lansnix
ExecStart=/usr/local/bin/lansnix
Restart=on-failure
RestartSec=5s
Environment="DB_PATH=/var/lib/lansnix/lansnix.db"
Environment="LOG_LEVEL=info"
Environment="API_PORT=8080"

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/lansnix /var/log/lansnix

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable lansnix
sudo systemctl start lansnix
sudo systemctl status lansnix
```

## 🔒 Security Hardening

### Firewall Configuration

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow from 192.168.1.0/24 to any port 8080
sudo ufw allow from 192.168.1.0/24 to any port 3000

# firewalld (RHEL/CentOS)
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" port port="8080" protocol="tcp" accept'
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" port port="3000" protocol="tcp" accept'
sudo firewall-cmd --reload
```

### Reverse Proxy with Nginx

```nginx
server {
    listen 80;
    server_name lansnix.local;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/TLS with Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d lansnix.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8080/api/health

# Check if services are running
docker compose ps

# View logs
docker compose logs -f backend
docker compose logs -f frontend
```

### Log Management

```bash
# Systemd logs
sudo journalctl -u lansnix -f

# Docker logs
docker compose logs -f

# Log rotation
sudo nano /etc/logrotate.d/lansnix
```

Logrotate configuration:

```
/var/log/lansnix/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
    postrotate
        systemctl reload lansnix > /dev/null 2>&1 || true
    endscript
}
```

## 🔄 Updates and Maintenance

### Update Docker Deployment

```bash
cd lansnix
git pull
docker compose pull
docker compose up -d
```

### Update Binary Installation

```bash
sudo scripts/update.sh
```

### Backup Database

```bash
# Create backup
sudo cp /var/lib/lansnix/lansnix.db /var/lib/lansnix/lansnix.db.backup-$(date +%Y%m%d)

# Automated backup script
sudo crontab -e
# Add: 0 2 * * * cp /var/lib/lansnix/lansnix.db /var/lib/lansnix/lansnix.db.backup-$(date +\%Y\%m\%d)
```

## 🧪 Testing

### Verify Installation

```bash
# Check backend
curl http://localhost:8080/api/health

# Check frontend
curl http://localhost:3000

# Trigger scan
curl -X POST http://localhost:8080/api/scan

# Get devices
curl http://localhost:8080/api/devices
```

### Load Testing

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test API
ab -n 1000 -c 10 http://localhost:8080/api/devices
```

## 📈 Performance Tuning

### Database Optimization

```bash
# Vacuum database
sqlite3 /var/lib/lansnix/lansnix.db "VACUUM;"

# Analyze tables
sqlite3 /var/lib/lansnix/lansnix.db "ANALYZE;"
```

### Scan Optimization

```bash
# Reduce scan interval for large networks
SCAN_INTERVAL=120

# Disable port scanning if not needed
PORT_SCAN_ENABLED=false

# Limit concurrent scans
MAX_CONCURRENT=50
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check permissions
sudo setcap cap_net_raw+ep /usr/local/bin/lansnix

# Check logs
sudo journalctl -u lansnix -n 50
```

**No devices found:**
```bash
# Check network interface
ip addr show

# Test connectivity
ping -c 1 192.168.1.1

# Check firewall
sudo ufw status
```

**High CPU usage:**
```bash
# Increase scan interval
SCAN_INTERVAL=300

# Reduce concurrent scans
MAX_CONCURRENT=25
```

## 📱 Mobile Access

### VPN Access

Use WireGuard or OpenVPN to access LANsnix remotely:

```bash
# Install WireGuard
sudo apt-get install wireguard

# Configure and connect
sudo wg-quick up wg0

# Access LANsnix
open http://192.168.1.100:3000
```

### SSH Tunnel

```bash
# Create SSH tunnel
ssh -L 3000:localhost:3000 user@server

# Access locally
open http://localhost:3000
```

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] Firewall rules set
- [ ] SSL/TLS certificate installed
- [ ] Reverse proxy configured
- [ ] Systemd service enabled
- [ ] Log rotation configured
- [ ] Backup script created
- [ ] Monitoring set up
- [ ] Documentation reviewed
- [ ] Security hardening applied

## 📞 Support

For deployment issues:
- Check [docs/INSTALLATION.md](docs/INSTALLATION.md)
- Review [docs/FAQ.md](docs/FAQ.md)
- Open issue: [github.com/ispawoo/lansnix/issues](https://github.com/ispawoo/lansnix/issues)

---

**Happy Deploying! 🚀**

Created by [Yasir Ispawoo](https://github.com/ispawoo)
