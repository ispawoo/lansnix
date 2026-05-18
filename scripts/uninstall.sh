#!/bin/bash
# LANsnix Uninstallation Script
# Created by Yasir Ispawoo (https://github.com/ispawoo)

set -e

echo "╔═══════════════════════════════════════╗"
echo "║       LANsnix Uninstaller             ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Stop service
echo "🛑 Stopping LANsnix service..."
systemctl stop lansnix 2>/dev/null || true
systemctl disable lansnix 2>/dev/null || true

# Remove systemd service
echo "🗑️  Removing systemd service..."
rm -f /etc/systemd/system/lansnix.service
systemctl daemon-reload

# Remove binary
echo "🗑️  Removing binary..."
rm -f /usr/local/bin/lansnix

# Ask about data
echo ""
read -p "Remove data and logs? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf /var/lib/lansnix
    rm -rf /var/log/lansnix
    rm -rf /etc/lansnix
    echo "✓ Data removed"
fi

echo ""
echo "✅ LANsnix uninstalled successfully!"
echo ""
echo "Created by Yasir Ispawoo - https://github.com/ispawoo"
