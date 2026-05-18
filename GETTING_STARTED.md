# Getting Started with LANsnix

**Created by [Yasir Ispawoo](https://github.com/ispawoo)**

Welcome to LANsnix! This guide will help you get up and running quickly.

## 🎯 What is LANsnix?

LANsnix is a modern, self-hosted LAN monitoring platform that helps you:
- 🔍 Discover all devices on your network
- 📊 Monitor device status in realtime
- 🔌 Scan for open ports and services
- 🌐 Visualize your network topology
- 📝 Track network activity and events

## ⚡ Quick Start (5 Minutes)

### Prerequisites

You need:
- A Linux machine (Ubuntu, Debian, Arch, or Raspberry Pi)
- Docker and Docker Compose installed
- 5 minutes of your time

### Step 1: Clone the Repository

```bash
git clone https://github.com/ispawoo/lansnix.git
cd lansnix
```

### Step 2: Start LANsnix

```bash
# Copy environment file
cp .env.example .env

# Start with Docker Compose
docker compose up -d
```

### Step 3: Access the Dashboard

Open your browser and navigate to:
```
http://localhost:3000
```

That's it! LANsnix is now scanning your network. 🎉

## 📖 Understanding the Interface

### Dashboard
Your main overview showing:
- Total devices discovered
- Online/offline status
- Average latency
- Recent devices

### Devices
Complete list of all discovered devices with:
- IP address and hostname
- MAC address and vendor
- Online/offline status
- Latency information
- Search and filtering

### Activity Feed
Historical log of network events:
- New devices joining
- Devices going online/offline
- Port changes
- Scan completions

### Network Map
Visual representation of your network topology showing all connected devices.

### Settings
View current configuration (scan interval, ports, etc.)

### About
Information about LANsnix, features, and author

## 🔧 Basic Configuration

### Change Scan Interval

Edit `.env` file:
```bash
SCAN_INTERVAL=120  # Scan every 2 minutes instead of 1
```

Restart:
```bash
docker compose restart
```

### Scan Specific Subnet

```bash
# Edit .env
SUBNET=192.168.1.0/24

# Restart
docker compose restart
```

### Configure Port Scanning

```bash
# Edit .env
PORT_SCAN_ENABLED=true
PORT_RANGES=22,80,443,3389,445,21,53,8080

# Restart
docker compose restart
```

## 🎨 Using the Dashboard

### Trigger Manual Scan

Click the "Scan Network" button on the dashboard to immediately scan your network.

### Search for Devices

Use the search bar on the Devices page to find devices by:
- IP address
- Hostname
- MAC address
- Vendor name

### Filter Devices

Use the filter buttons to show:
- All devices
- Online only
- Offline only

### View Device Details

Click on any device card to see:
- Full device information
- Open ports and services
- Activity history
- Connection timeline

## 🔔 Understanding Notifications

LANsnix shows toast notifications for:
- ✅ New devices discovered
- 🟢 Devices coming online
- 🔴 Devices going offline
- ⚡ Scan completions

## 📊 Reading the Data

### Device Status
- **Green dot**: Device is online and responding
- **Red dot**: Device is offline or not responding

### Latency
- Lower is better (measured in milliseconds)
- Typical values: 1-10ms for wired, 10-50ms for wireless

### Vendor Detection
- Automatically identifies device manufacturer from MAC address
- Helps identify device types (Apple, Dell, TP-Link, etc.)

### Open Ports
Common ports and their services:
- **22**: SSH (remote access)
- **80**: HTTP (web server)
- **443**: HTTPS (secure web)
- **3389**: RDP (Windows remote desktop)
- **445**: SMB (file sharing)

## 🛠️ Common Tasks

### Add LANsnix to Startup

```bash
# Docker Compose
docker compose up -d

# The containers will auto-start on system boot
```

### View Logs

```bash
# All logs
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend
```

### Stop LANsnix

```bash
docker compose down
```

### Update LANsnix

```bash
git pull
docker compose pull
docker compose up -d
```

### Backup Your Data

```bash
# Database is stored in ./data/
cp -r data/ data-backup-$(date +%Y%m%d)
```

## 🔍 Troubleshooting

### No Devices Found

**Check network interface:**
```bash
ip addr show
```

**Verify Docker network mode:**
```bash
docker compose ps
# Should show "host" network mode for backend
```

**Check firewall:**
```bash
sudo ufw status
# Ensure ICMP is allowed
```

### Can't Access Dashboard

**Check if services are running:**
```bash
docker compose ps
```

**Check ports:**
```bash
sudo netstat -tlnp | grep -E '3000|8080'
```

**View logs for errors:**
```bash
docker compose logs
```

### High CPU Usage

**Increase scan interval:**
```bash
# Edit .env
SCAN_INTERVAL=300  # 5 minutes

# Restart
docker compose restart
```

**Disable port scanning:**
```bash
# Edit .env
PORT_SCAN_ENABLED=false

# Restart
docker compose restart
```

## 🎓 Next Steps

### Learn More
- Read the [full documentation](docs/)
- Check the [API documentation](docs/API.md)
- Understand the [architecture](docs/ARCHITECTURE.md)

### Customize
- Adjust scan intervals
- Configure port ranges
- Set up reverse proxy
- Enable SSL/TLS

### Contribute
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 💡 Tips and Tricks

### Performance
- Reduce scan interval for large networks
- Disable port scanning if not needed
- Use wired connection for scanner host

### Security
- Run behind firewall
- Use VPN for remote access
- Keep LANsnix updated
- Review activity logs regularly

### Monitoring
- Check dashboard daily
- Watch for unknown devices
- Monitor port changes
- Review activity feed

## 📱 Mobile Access

### Local Network
Simply open `http://your-server-ip:3000` on your mobile browser.

### Remote Access (via VPN)
1. Set up WireGuard or OpenVPN
2. Connect to your VPN
3. Access LANsnix as if on local network

## 🆘 Getting Help

### Documentation
- [Installation Guide](docs/INSTALLATION.md)
- [FAQ](docs/FAQ.md)
- [API Documentation](docs/API.md)

### Community
- [GitHub Issues](https://github.com/ispawoo/lansnix/issues)
- [GitHub Discussions](https://github.com/ispawoo/lansnix/discussions)

### Reporting Bugs
1. Check existing issues
2. Gather logs: `docker compose logs`
3. Note your environment (OS, Docker version)
4. Create detailed issue on GitHub

## 🎉 You're All Set!

LANsnix is now monitoring your network. Here's what happens automatically:

1. **Every minute** (or your configured interval):
   - Scans your network for devices
   - Updates device status
   - Checks latency
   - Scans ports (if enabled)

2. **In realtime**:
   - Notifies you of new devices
   - Updates device status
   - Shows activity events
   - Refreshes dashboard

3. **Continuously**:
   - Logs all activity
   - Stores device history
   - Tracks port changes
   - Maintains database

## 🌟 Enjoy LANsnix!

You now have a powerful network monitoring platform running on your network. Explore the features, customize the settings, and keep an eye on your devices!

---

**Questions?** Check the [FAQ](docs/FAQ.md) or open an [issue](https://github.com/ispawoo/lansnix/issues).

**Want to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md).

Created with ❤️ by [Yasir Ispawoo](https://github.com/ispawoo)
