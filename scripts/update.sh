#!/bin/bash
# LANsnix Update Script
# Created by Yasir Ispawoo (https://github.com/ispawoo)

set -e

echo "╔═══════════════════════════════════════╗"
echo "║         LANsnix Updater               ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Stop service
echo "🛑 Stopping LANsnix..."
systemctl stop lansnix

# Backup database
echo "💾 Backing up database..."
if [ -f /var/lib/lansnix/lansnix.db ]; then
    cp /var/lib/lansnix/lansnix.db /var/lib/lansnix/lansnix.db.backup
    echo "✓ Database backed up"
fi

# Download latest version
echo ""
echo "⬇️  Downloading latest version..."

ARCH=$(uname -m)
case $ARCH in
    x86_64)
        BINARY_URL="https://github.com/ispawoo/lansnix/releases/latest/download/lansnix-linux-amd64"
        ;;
    aarch64|arm64)
        BINARY_URL="https://github.com/ispawoo/lansnix/releases/latest/download/lansnix-linux-arm64"
        ;;
    *)
        echo "❌ Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

wget -q --show-progress -O /tmp/lansnix "$BINARY_URL" || {
    echo "❌ Failed to download update"
    systemctl start lansnix
    exit 1
}

# Install new version
echo ""
echo "📥 Installing update..."
chmod +x /tmp/lansnix
mv /tmp/lansnix /usr/local/bin/lansnix
setcap cap_net_raw+ep /usr/local/bin/lansnix

# Start service
echo "▶️  Starting LANsnix..."
systemctl start lansnix

echo ""
echo "✅ LANsnix updated successfully!"
echo ""
echo "Check status: sudo systemctl status lansnix"
echo ""
echo "Created by Yasir Ispawoo - https://github.com/ispawoo"
