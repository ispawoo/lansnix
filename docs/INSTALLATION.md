# LANsnix Installation Guide

Created by [Yasir Ispawoo](https://github.com/ispawoo)

## Prerequisites

### System Requirements

- **Operating System**: Linux (Ubuntu 20.04+, Debian 11+, Arch Linux, Raspberry Pi OS)
- **Architecture**: x86_64 or ARM64
- **RAM**: 512MB minimum, 1GB recommended
- **Disk Space**: 100MB for application, additional for database
- **Network**: Root/sudo access for packet capture

### Software Requirements

- **Docker** (for Docker installation)
- **libpcap** (for binary installation)
- **Go 1.21+** (for source installation)
- **Node.js 20+** (for source installation)

---

## Installation Methods

### Method 1: Docker Compose (Recommended)

Easiest and most reliable installation method.

```bash
# Clone repository
git clone https://github.com/ispawoo/lansnix.git
cd lansnix

# Copy environment file
cp .env.example .env

# Edit configuration (optional)
nano .env

# Start services
docker compose up -d

# Check logs
docker compose logs -f

# Access dashboard
open http://localhost:3000
```

**Stopping:**
```bash
docker compose down
```

**Updating:**
```bash
git pull
docker compose pull
docker compose up -d
```

---

### Method 2: Automated Script

Quick installation using the install script.

```bash
# Download and run installer
curl -fsSL https://raw.githubusercontent.com/ispawoo/lansnix/main/scripts/install.sh | sudo bash

# Start service
sudo systemctl start lansnix

# Enable on boot
sudo systemctl enable lansnix

# Check status
sudo systemctl status lansnix

# View logs
sudo journalctl -u lansnix -f
```

**Note**: Frontend must be installed separately or use Docker.

---

### Method 3: Manual Binary Installation

#### Ubuntu/Debian

```bash
# Install dependencies
sudo apt-get update
sudo apt-get install -y libpcap-dev wget

# Download binary
wget https://github.com/ispawoo/lansnix/releases/latest/download/lansnix-linux-amd64
chmod +x lansnix-linux-amd64
sudo mv lansnix-linux-amd64 /usr/local/bin/lansnix

# Set capabilities
sudo setcap cap_net_raw+ep /usr/local/bin/lansnix

# Create directories
sudo mkdir -p /var/lib/lansnix
sudo mkdir -p /var/log/lansnix

# Run
sudo lansnix
```

#### Arch Linux

```bash
# Install dependencies
sudo pacman -Sy libpcap wget

# Download and install
wget https://github.com/ispawoo/lansnix/releases/latest/download/lansnix-linux-amd64
chmod +x lansnix-linux-amd64
sudo mv lansnix-linux-amd64 /usr/local/bin/lansnix
sudo setcap cap_net_raw+ep /usr/local/bin/lansnix

# Run
sudo lansnix
```

#### Raspberry Pi (ARM64)

```bash
# Install dependencies
sudo apt-get update
sudo apt-get install -y libpcap-dev wget

# Download ARM binary
wget https://github.com/ispawoo/lansnix/releases/latest/download/lansnix-linux-arm64
chmod +x lansnix-linux-arm64
sudo mv lansnix-linux-arm64 /usr/local/bin/lansnix
sudo setcap cap_net_raw+ep /usr/local/bin/lansnix

# Run
sudo lansnix
```

---

### Method 4: Build from Source

For developers or custom builds.

#### Backend

```bash
# Install Go 1.21+
# Visit: https://go.dev/doc/install

# Install dependencies
sudo apt-get install -y libpcap-dev

# Clone repository
git clone https://github.com/ispawoo/lansnix.git
cd lansnix/backend

# Download Go modules
go mod download

# Build
go build -o lansnix ./cmd/server

# Run
sudo ./lansnix
```

#### Frontend

```bash
# Install Node.js 20+
# Visit: https://nodejs.org

# Navigate to frontend
cd lansnix/frontend

# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
npm start
```

---

## Systemd Service Setup

Create a systemd service for automatic startup.

```bash
# Create service file
sudo nano /etc/systemd/system/lansnix.service
```

**Service file content:**
```ini
[Unit]
Description=LANsnix - Realtime LAN Discovery & Monitoring Platform
After=network.target
Documentation=https://github.com/ispawoo/lansnix

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/lansnix
Restart=on-failure
RestartSec=5s
Environment="DB_PATH=/var/lib/lansnix/lansnix.db"
Environment="LOG_LEVEL=info"
Environment="API_PORT=8080"

[Install]
WantedBy=multi-user.target
```

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable lansnix
sudo systemctl start lansnix
sudo systemctl status lansnix
```

---

## Configuration

### Environment Variables

Create `.env` file or set environment variables:

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
DB_PATH=./data/lansnix.db

# Logging
LOG_LEVEL=info
```

### Firewall Configuration

Allow required ports:

```bash
# Backend API
sudo ufw allow 8080/tcp

# Frontend
sudo ufw allow 3000/tcp

# Or use firewalld
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

## Verification

### Check Backend

```bash
# Health check
curl http://localhost:8080/api/health

# Expected response:
# {"status":"ok","version":"1.0.0","author":"Yasir Ispawoo"}
```

### Check Frontend

```bash
# Open in browser
open http://localhost:3000
```

### Check Logs

```bash
# Systemd service
sudo journalctl -u lansnix -f

# Docker
docker compose logs -f

# Direct execution
tail -f /var/log/lansnix/lansnix.log
```

---

## Troubleshooting

### Permission Denied

```bash
# Ensure capabilities are set
sudo setcap cap_net_raw+ep /usr/local/bin/lansnix

# Or run as root
sudo lansnix
```

### Port Already in Use

```bash
# Change port in .env
API_PORT=8081
FRONTEND_PORT=3001
```

### Database Locked

```bash
# Stop all instances
sudo systemctl stop lansnix
sudo pkill lansnix

# Remove lock
rm /var/lib/lansnix/lansnix.db-wal
rm /var/lib/lansnix/lansnix.db-shm
```

### No Devices Found

- Check network interface is correct
- Verify subnet configuration
- Ensure firewall allows ICMP
- Check logs for errors

---

## Updating

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

### Source

```bash
cd lansnix
git pull
cd backend && go build -o lansnix ./cmd/server
cd ../frontend && npm install && npm run build
```

---

## Uninstallation

### Docker

```bash
docker compose down -v
rm -rf lansnix
```

### Binary/Service

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
sudo rm -rf /var/log/lansnix
```

---

For support, visit [github.com/ispawoo/lansnix/issues](https://github.com/ispawoo/lansnix/issues)
