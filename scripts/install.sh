#!/bin/bash
# LANsnix Installation Script
# Created by Yasir Ispawoo (https://github.com/ispawoo)

set -e

echo "╔═══════════════════════════════════════╗"
echo "║         LANsnix Installer             ║"
echo "║   Realtime LAN Monitoring Platform    ║"
echo "║   Created by Yasir Ispawoo            ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "❌ Cannot detect OS"
    exit 1
fi

echo "✓ Detected OS: $OS"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

case $OS in
    ubuntu|debian)
        apt-get update
        apt-get install -y libpcap-dev wget curl
        ;;
    arch|manjaro)
        pacman -Sy --noconfirm libpcap wget curl
        ;;
    fedora|rhel|centos)
        dnf install -y libpcap-devel wget curl
        ;;
    *)
        echo "⚠️  Unsupported OS. Please install libpcap manually."
        ;;
esac

# Download binary
echo ""
echo "⬇️  Downloading LANsnix..."

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
    echo "❌ Failed to download LANsnix"
    exit 1
}

# Install binary
echo ""
echo "📥 Installing LANsnix..."

chmod +x /tmp/lansnix
mv /tmp/lansnix /usr/local/bin/lansnix

# Set capabilities
setcap cap_net_raw+ep /usr/local/bin/lansnix

# Create directories
mkdir -p /etc/lansnix
mkdir -p /var/lib/lansnix
mkdir -p /var/log/lansnix

# Create systemd service
echo ""
echo "⚙️  Creating systemd service..."

cat > /etc/systemd/system/lansnix.service << 'EOF'
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

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
systemctl daemon-reload

echo ""
echo "✅ LANsnix installed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Start the service:    sudo systemctl start lansnix"
echo "   2. Enable on boot:       sudo systemctl enable lansnix"
echo "   3. Check status:         sudo systemctl status lansnix"
echo "   4. View logs:            sudo journalctl -u lansnix -f"
echo ""
echo "🌐 Access the dashboard at: http://localhost:3000"
echo ""
echo "Created by Yasir Ispawoo - https://github.com/ispawoo"
