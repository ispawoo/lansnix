# LANsnix Quick Reference

**Created by [Yasir Ispawoo](https://github.com/ispawoo)**

---

## 🚀 Quick Start

```bash
# Clone and start
git clone https://github.com/ispawoo/lansnix.git
cd lansnix
docker compose up -d

# Access
open http://localhost:3000
```

---

## 📋 Common Commands

### Docker

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Restart
docker compose restart

# Logs
docker compose logs -f

# Update
docker compose pull && docker compose up -d
```

### Systemd

```bash
# Start
sudo systemctl start lansnix

# Stop
sudo systemctl stop lansnix

# Restart
sudo systemctl restart lansnix

# Status
sudo systemctl status lansnix

# Logs
sudo journalctl -u lansnix -f

# Enable on boot
sudo systemctl enable lansnix
```

### Build

```bash
# Backend
cd backend && go build ./cmd/server

# Frontend
cd frontend && npm install && npm run build

# Both
make build

# Docker images
docker compose build
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Network
SCAN_INTERVAL=60              # Seconds between scans
SUBNET=auto                   # Or specific: 192.168.1.0/24
INTERFACE=auto                # Or specific: eth0

# Ports
PORT_SCAN_ENABLED=true        # Enable port scanning
PORT_RANGES=22,80,443,3389    # Ports to scan

# API
API_HOST=0.0.0.0             # API bind address
API_PORT=8080                # API port
FRONTEND_PORT=3000           # Frontend port

# Database
DB_PATH=./data/lansnix.db    # Database location

# Logging
LOG_LEVEL=info               # debug, info, warn, error
```

### Quick Config Changes

```bash
# Edit .env
nano .env

# Restart
docker compose restart
```

---

## 🌐 API Endpoints

```bash
# Health check
curl http://localhost:8080/api/health

# Get statistics
curl http://localhost:8080/api/stats

# List devices
curl http://localhost:8080/api/devices

# Get device
curl http://localhost:8080/api/devices/192.168.1.100

# Get activity
curl http://localhost:8080/api/activity?limit=50

# Get ports
curl http://localhost:8080/api/ports/1

# Trigger scan
curl -X POST http://localhost:8080/api/scan

# WebSocket
ws://localhost:8080/api/ws
```

---

## 🐛 Troubleshooting

### No Devices Found

```bash
# Check network interface
ip addr show

# Check Docker network
docker compose ps

# Check firewall
sudo ufw status

# View logs
docker compose logs backend
```

### Permission Denied

```bash
# Set capabilities
sudo setcap cap_net_raw+ep /usr/local/bin/lansnix

# Or run as root
sudo ./lansnix
```

### Port Already in Use

```bash
# Check what's using port
sudo lsof -i :8080

# Change port in .env
API_PORT=8081
```

### Database Locked

```bash
# Stop all instances
docker compose down
sudo pkill lansnix

# Remove lock files
rm data/lansnix.db-wal
rm data/lansnix.db-shm
```

---

## 📁 File Locations

### Docker

```
./data/lansnix.db          # Database
./logs/                    # Logs
./.env                     # Configuration
```

### System Install

```
/usr/local/bin/lansnix     # Binary
/var/lib/lansnix/          # Database
/var/log/lansnix/          # Logs
/etc/lansnix/              # Config
/etc/systemd/system/lansnix.service  # Service
```

---

## 🔒 Security

### Firewall

```bash
# Allow from local network only
sudo ufw allow from 192.168.1.0/24 to any port 8080
sudo ufw allow from 192.168.1.0/24 to any port 3000
```

### Reverse Proxy (Nginx)

```nginx
location / {
    proxy_pass http://localhost:3000;
}

location /api {
    proxy_pass http://localhost:8080;
}
```

---

## 💾 Backup & Restore

### Backup

```bash
# Database
cp data/lansnix.db data/lansnix.db.backup

# Full backup
tar -czf lansnix-backup.tar.gz data/ .env
```

### Restore

```bash
# Database
cp data/lansnix.db.backup data/lansnix.db

# Full restore
tar -xzf lansnix-backup.tar.gz
```

---

## 📊 Monitoring

### Check Status

```bash
# Docker
docker compose ps

# Systemd
sudo systemctl status lansnix

# Health
curl http://localhost:8080/api/health
```

### View Logs

```bash
# Docker - all
docker compose logs -f

# Docker - backend only
docker compose logs -f backend

# Systemd
sudo journalctl -u lansnix -f

# Last 100 lines
sudo journalctl -u lansnix -n 100
```

---

## 🔄 Updates

### Docker

```bash
cd lansnix
git pull
docker compose pull
docker compose up -d
```

### Binary

```bash
sudo scripts/update.sh
```

### From Source

```bash
git pull
make build
sudo systemctl restart lansnix
```

---

## 🗑️ Uninstall

### Docker

```bash
docker compose down -v
rm -rf lansnix
```

### System

```bash
sudo scripts/uninstall.sh
```

### Manual

```bash
sudo systemctl stop lansnix
sudo systemctl disable lansnix
sudo rm /etc/systemd/system/lansnix.service
sudo rm /usr/local/bin/lansnix
sudo rm -rf /var/lib/lansnix
```

---

## 🎯 Performance Tuning

### Large Networks

```bash
# Increase scan interval
SCAN_INTERVAL=120

# Reduce concurrent scans
MAX_CONCURRENT=50
```

### Reduce CPU Usage

```bash
# Disable port scanning
PORT_SCAN_ENABLED=false

# Increase scan interval
SCAN_INTERVAL=300
```

### Database Optimization

```bash
# Vacuum database
sqlite3 data/lansnix.db "VACUUM;"

# Analyze tables
sqlite3 data/lansnix.db "ANALYZE;"
```

---

## 📱 Remote Access

### SSH Tunnel

```bash
ssh -L 3000:localhost:3000 user@server
open http://localhost:3000
```

### VPN

```bash
# Connect to VPN
sudo wg-quick up wg0

# Access LANsnix
open http://192.168.1.100:3000
```

---

## 🔍 Useful Queries

### Database

```bash
# Connect to database
sqlite3 data/lansnix.db

# List all devices
SELECT * FROM devices;

# Count devices
SELECT COUNT(*) FROM devices;

# Recent activity
SELECT * FROM activity ORDER BY timestamp DESC LIMIT 10;

# Open ports
SELECT * FROM ports WHERE state='open';
```

---

## 📞 Getting Help

- **Documentation**: [docs/](docs/)
- **FAQ**: [docs/FAQ.md](docs/FAQ.md)
- **Issues**: [github.com/ispawoo/lansnix/issues](https://github.com/ispawoo/lansnix/issues)
- **Discussions**: [github.com/ispawoo/lansnix/discussions](https://github.com/ispawoo/lansnix/discussions)

---

## 🎓 Learn More

- [Getting Started](GETTING_STARTED.md)
- [Installation Guide](docs/INSTALLATION.md)
- [API Documentation](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](DEPLOYMENT.md)

---

## ⌨️ Keyboard Shortcuts

### Dashboard
- `Ctrl+R` - Refresh page
- `Ctrl+F` - Search (in browser)

### Devices Page
- Type to search
- `Tab` - Navigate filters

---

## 🎨 UI Tips

- **Green dot** = Online
- **Red dot** = Offline
- **Click device** = View details
- **Search bar** = Filter by IP, hostname, MAC, vendor
- **Filter buttons** = Show all/online/offline

---

## 📊 Default Ports

- **Frontend**: 3000
- **Backend API**: 8080
- **WebSocket**: 8080/api/ws

---

## 🔧 Default Settings

- **Scan Interval**: 60 seconds
- **Subnet**: Auto-detect
- **Port Scan**: Enabled
- **Ports**: 22,80,443,3389,445,21,53
- **Max Concurrent**: 100
- **Timeout**: 5 seconds

---

**Quick Reference v1.0.0**

Created by [Yasir Ispawoo](https://github.com/ispawoo)
