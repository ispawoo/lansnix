# LANsnix FAQ

Created by [Yasir Ispawoo](https://github.com/ispawoo)

## General Questions

### What is LANsnix?

LANsnix is a modern, self-hosted LAN monitoring platform that provides realtime device discovery, port scanning, and network visualization. It's designed for homelabs, cybersecurity enthusiasts, and Linux users.

### Why "LANsnix"?

LAN (Local Area Network) + snix (inspired by Unix/Linux naming conventions) = LANsnix

### Is LANsnix free?

Yes! LANsnix is completely free and open-source under the MIT License.

### Who created LANsnix?

LANsnix was created by [Yasir Ispawoo](https://github.com/ispawoo).

---

## Installation & Setup

### What operating systems are supported?

- Ubuntu 20.04+
- Debian 11+
- Arch Linux
- Raspberry Pi OS
- Other Linux distributions (may require manual setup)

### Can I run LANsnix on Windows or macOS?

Currently, LANsnix is Linux-only. Windows and macOS support may be added in future versions.

### Why does LANsnix need root/sudo access?

Network scanning requires raw socket access (CAP_NET_RAW capability) to send ARP and ICMP packets. LANsnix uses Linux capabilities to minimize privilege requirements.

### Can I run LANsnix without Docker?

Yes! You can install the standalone binary or build from source. Docker is recommended but not required.

### How much disk space does LANsnix need?

- Application: ~50-100MB
- Database: ~1MB per 1000 devices
- Logs: Varies based on activity

---

## Features & Functionality

### How does device discovery work?

LANsnix uses:
1. ARP scanning to discover devices
2. ICMP ping to check availability
3. DNS lookups for hostnames
4. MAC address vendor lookup

### What ports does LANsnix scan?

By default: 21, 22, 53, 80, 443, 445, 3389, and others. Configurable via `PORT_RANGES` environment variable.

### How often does LANsnix scan the network?

Default: Every 60 seconds. Configurable via `SCAN_INTERVAL` environment variable.

### Can LANsnix detect device types?

LANsnix identifies vendors via MAC address lookup. Device type detection (router, printer, etc.) may be added in future versions.

### Does LANsnix support multiple subnets?

Currently, LANsnix scans a single subnet. Multi-subnet support is planned for future releases.

### Can I export device data?

CSV/JSON export is planned for future versions. Currently, you can query the SQLite database directly.

---

## Performance

### How many devices can LANsnix handle?

LANsnix can efficiently handle 100+ devices. Performance depends on:
- Network size
- Scan interval
- Port scanning enabled/disabled
- Hardware resources

### Why is scanning slow?

Factors affecting scan speed:
- Large subnet (more IPs to check)
- Port scanning enabled
- Network latency
- Firewall rules blocking ICMP

**Optimization tips:**
- Reduce scan interval
- Disable port scanning
- Limit port ranges
- Use faster hardware

### How much bandwidth does LANsnix use?

Minimal. Network scanning uses small packets (ARP, ICMP). Typical usage: <1MB per scan.

---

## Configuration

### Where is the configuration file?

Configuration is via environment variables or `.env` file. See `.env.example` for all options.

### How do I change the scan interval?

```bash
# In .env file
SCAN_INTERVAL=120  # seconds

# Or environment variable
export SCAN_INTERVAL=120
```

### How do I scan a specific subnet?

```bash
# In .env file
SUBNET=192.168.1.0/24

# Or use auto-detection
SUBNET=auto
```

### Can I disable port scanning?

```bash
# In .env file
PORT_SCAN_ENABLED=false
```

### How do I change API/frontend ports?

```bash
# In .env file
API_PORT=8081
FRONTEND_PORT=3001
```

---

## Troubleshooting

### No devices are being discovered

**Possible causes:**
1. Wrong network interface
2. Firewall blocking ICMP
3. Incorrect subnet configuration
4. Permission issues

**Solutions:**
```bash
# Check network interface
ip addr show

# Allow ICMP
sudo ufw allow icmp

# Verify subnet
ip route | grep default

# Check permissions
sudo setcap cap_net_raw+ep /usr/local/bin/lansnix
```

### "Permission denied" error

```bash
# Set capabilities
sudo setcap cap_net_raw+ep /usr/local/bin/lansnix

# Or run as root
sudo lansnix
```

### Port already in use

```bash
# Check what's using the port
sudo lsof -i :8080

# Change port in .env
API_PORT=8081
```

### Database locked error

```bash
# Stop all instances
sudo systemctl stop lansnix
sudo pkill lansnix

# Remove lock files
rm /var/lib/lansnix/lansnix.db-wal
rm /var/lib/lansnix/lansnix.db-shm
```

### WebSocket not connecting

**Check:**
1. Backend is running
2. Firewall allows port 8080
3. CORS configuration
4. Browser console for errors

### High CPU usage

**Causes:**
- Frequent scans
- Large network
- Port scanning enabled

**Solutions:**
- Increase scan interval
- Reduce port ranges
- Disable port scanning

---

## Security

### Is LANsnix secure?

LANsnix implements several security measures:
- Rate limiting
- Input validation
- Parameterized queries
- Minimal privileges

See [SECURITY.md](SECURITY.md) for details.

### Should I expose LANsnix to the internet?

**No!** LANsnix is designed for local network use only. If remote access is needed:
1. Use VPN
2. Use reverse proxy with authentication
3. Use SSH tunnel

### Does LANsnix collect any data?

No. All data stays on your local network. LANsnix does not:
- Send data to external servers
- Use analytics
- Phone home
- Require internet connection

---

## Development

### How can I contribute?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Where can I report bugs?

Open an issue on [GitHub](https://github.com/ispawoo/lansnix/issues).

### Can I request features?

Yes! Open a feature request on [GitHub](https://github.com/ispawoo/lansnix/issues).

### How do I build from source?

See [INSTALLATION.md](INSTALLATION.md) for build instructions.

---

## Comparison

### LANsnix vs Nmap

- **Nmap**: CLI tool, manual scans, powerful but complex
- **LANsnix**: Web UI, automatic monitoring, realtime updates

### LANsnix vs Angry IP Scanner

- **Angry IP**: Desktop app, manual scans
- **LANsnix**: Web-based, continuous monitoring, activity history

### LANsnix vs Uptime Kuma

- **Uptime Kuma**: Service monitoring, uptime tracking
- **LANsnix**: Network discovery, device monitoring, port scanning

---

## Future Plans

### Planned Features

- [ ] Multi-subnet support
- [ ] Bandwidth monitoring
- [ ] Speed test integration
- [ ] Custom device aliases
- [ ] Scan scheduling
- [ ] CSV/JSON export
- [ ] Mobile app
- [ ] SNMP integration
- [ ] Custom alerting rules
- [ ] Plugin system

### Roadmap

See [GitHub Projects](https://github.com/ispawoo/lansnix/projects) for detailed roadmap.

---

## Support

### Where can I get help?

- [GitHub Issues](https://github.com/ispawoo/lansnix/issues)
- [GitHub Discussions](https://github.com/ispawoo/lansnix/discussions)
- [Documentation](https://github.com/ispawoo/lansnix/tree/main/docs)

### How do I update LANsnix?

```bash
# Docker
docker compose pull && docker compose up -d

# Binary
sudo scripts/update.sh

# Source
git pull && make build
```

---

Still have questions? Open an issue on [GitHub](https://github.com/ispawoo/lansnix/issues)!
