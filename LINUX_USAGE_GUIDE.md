# 🐧 How to Use LANsnix on Linux

**Created by [Yasir Ispawoo](https://github.com/ispawoo)**

LANsnix is a Linux-native application. Here's how to use it!

---

## 🚀 Quick Start (Easiest Method)

### **Method 1: Docker (Recommended)**

This works on ANY Linux distribution!

#### **Step 1: Install Docker**

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

**Arch Linux:**
```bash
sudo pacman -S docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

**Fedora/RHEL:**
```bash
sudo dnf install -y docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

#### **Step 2: Clone the Repository**

```bash
cd ~
git clone https://github.com/YOUR-USERNAME/lansnix.git
cd lansnix
```

#### **Step 3: Start LANsnix**

```bash
sudo docker compose up -d
```

That's it! 🎉

#### **Step 4: Access the Dashboard**

Open your browser and go to:
```
http://localhost:3000
```

You should see the LANsnix dashboard!

---

## 📊 **Using LANsnix**

### **View Logs**
```bash
sudo docker compose logs -f
```

### **Stop LANsnix**
```bash
sudo docker compose down
```

### **Restart LANsnix**
```bash
sudo docker compose restart
```

### **Update LANsnix**
```bash
cd ~/lansnix
git pull
sudo docker compose pull
sudo docker compose up -d
```

---

## 🔧 **Method 2: Automated Installation Script**

For a system-wide installation:

### **Step 1: Download and Run Installer**

```bash
cd ~/lansnix
sudo bash scripts/install.sh
```

This will:
- Install dependencies
- Download the binary
- Set up systemd service
- Configure permissions

### **Step 2: Start the Service**

```bash
sudo systemctl start lansnix
sudo systemctl enable lansnix
```

### **Step 3: Check Status**

```bash
sudo systemctl status lansnix
```

### **Step 4: View Logs**

```bash
sudo journalctl -u lansnix -f
```

---

## 🛠️ **Method 3: Build from Source**

For developers who want to modify the code:

### **Step 1: Install Dependencies**

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install -y golang-go nodejs npm libpcap-dev git
```

**Arch Linux:**
```bash
sudo pacman -S go nodejs npm libpcap git
```

### **Step 2: Clone Repository**

```bash
cd ~
git clone https://github.com/YOUR-USERNAME/lansnix.git
cd lansnix
```

### **Step 3: Build Backend**

```bash
cd backend
go mod download
go build -o lansnix ./cmd/server
```

### **Step 4: Build Frontend**

```bash
cd ../frontend
npm install
npm run build
```

### **Step 5: Run Backend**

```bash
cd ../backend
sudo ./lansnix
```

### **Step 6: Run Frontend (in another terminal)**

```bash
cd ~/lansnix/frontend
npm start
```

### **Step 7: Access Dashboard**

Open browser: http://localhost:3000

---

## 🌐 **Accessing from Other Devices**

### **Find Your Linux Machine's IP**

```bash
ip addr show | grep "inet "
```

Look for something like: `192.168.1.100`

### **Access from Another Device**

On your phone, tablet, or another computer, open:
```
http://192.168.1.100:3000
```

(Replace with your actual IP address)

---

## 🔒 **Firewall Configuration**

If you can't access LANsnix from other devices:

### **Ubuntu/Debian (UFW)**

```bash
sudo ufw allow 3000/tcp
sudo ufw allow 8080/tcp
sudo ufw reload
```

### **Fedora/RHEL (firewalld)**

```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
```

### **Arch Linux (iptables)**

```bash
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
sudo iptables-save
```

---

## ⚙️ **Configuration**

### **Edit Configuration**

```bash
cd ~/lansnix
nano .env
```

### **Common Settings**

```bash
# Scan every 2 minutes instead of 1
SCAN_INTERVAL=120

# Scan specific subnet
SUBNET=192.168.1.0/24

# Disable port scanning
PORT_SCAN_ENABLED=false

# Change ports
API_PORT=8080
FRONTEND_PORT=3000
```

### **Apply Changes**

**Docker:**
```bash
sudo docker compose restart
```

**Systemd:**
```bash
sudo systemctl restart lansnix
```

---

## 🐛 **Troubleshooting**

### **No Devices Found**

**Check network interface:**
```bash
ip addr show
```

**Check if LANsnix is running:**
```bash
sudo docker compose ps
# or
sudo systemctl status lansnix
```

**Check logs:**
```bash
sudo docker compose logs backend
# or
sudo journalctl -u lansnix -n 50
```

### **Permission Denied**

LANsnix needs root access for network scanning:

```bash
# For Docker (already runs as root)
sudo docker compose up -d

# For binary
sudo ./lansnix

# Or set capabilities
sudo setcap cap_net_raw+ep /usr/local/bin/lansnix
```

### **Port Already in Use**

Check what's using the port:
```bash
sudo lsof -i :3000
sudo lsof -i :8080
```

Kill the process or change LANsnix ports in `.env`

### **Can't Access from Browser**

1. Check if services are running:
   ```bash
   sudo docker compose ps
   ```

2. Check firewall (see Firewall Configuration above)

3. Try accessing locally first:
   ```bash
   curl http://localhost:8080/api/health
   ```

---

## 📱 **Remote Access (Secure)**

### **Option 1: SSH Tunnel**

From your remote machine:
```bash
ssh -L 3000:localhost:3000 user@your-linux-server
```

Then open: http://localhost:3000

### **Option 2: VPN (Recommended)**

Set up WireGuard or OpenVPN, then access LANsnix through the VPN.

### **Option 3: Reverse Proxy with SSL**

**Install Nginx:**
```bash
sudo apt install nginx certbot python3-certbot-nginx
```

**Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/lansnix
```

Add:
```nginx
server {
    listen 80;
    server_name lansnix.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

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

**Enable and get SSL:**
```bash
sudo ln -s /etc/nginx/sites-available/lansnix /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d lansnix.yourdomain.com
```

---

## 🔄 **Useful Commands**

### **Docker Commands**

```bash
# Start
sudo docker compose up -d

# Stop
sudo docker compose down

# Restart
sudo docker compose restart

# View logs
sudo docker compose logs -f

# View backend logs only
sudo docker compose logs -f backend

# View frontend logs only
sudo docker compose logs -f frontend

# Update
git pull && sudo docker compose pull && sudo docker compose up -d

# Remove everything (including data)
sudo docker compose down -v
```

### **Systemd Commands**

```bash
# Start
sudo systemctl start lansnix

# Stop
sudo systemctl stop lansnix

# Restart
sudo systemctl restart lansnix

# Status
sudo systemctl status lansnix

# Enable on boot
sudo systemctl enable lansnix

# Disable on boot
sudo systemctl disable lansnix

# View logs
sudo journalctl -u lansnix -f

# View last 100 lines
sudo journalctl -u lansnix -n 100
```

---

## 💾 **Backup and Restore**

### **Backup Database**

```bash
# Docker
sudo cp data/lansnix.db data/lansnix.db.backup

# System install
sudo cp /var/lib/lansnix/lansnix.db /var/lib/lansnix/lansnix.db.backup
```

### **Restore Database**

```bash
# Docker
sudo cp data/lansnix.db.backup data/lansnix.db
sudo docker compose restart

# System install
sudo cp /var/lib/lansnix/lansnix.db.backup /var/lib/lansnix/lansnix.db
sudo systemctl restart lansnix
```

---

## 🎯 **Testing LANsnix**

### **1. Check Backend Health**

```bash
curl http://localhost:8080/api/health
```

Should return:
```json
{"status":"ok","version":"1.0.0","author":"Yasir Ispawoo"}
```

### **2. Trigger Manual Scan**

```bash
curl -X POST http://localhost:8080/api/scan
```

### **3. Get Devices**

```bash
curl http://localhost:8080/api/devices
```

### **4. Get Statistics**

```bash
curl http://localhost:8080/api/stats
```

---

## 📊 **Performance Tuning**

### **For Large Networks (100+ devices)**

Edit `.env`:
```bash
SCAN_INTERVAL=120        # Scan every 2 minutes
MAX_CONCURRENT=50        # Reduce concurrent scans
PORT_SCAN_ENABLED=false  # Disable port scanning
```

### **For Small Networks (< 20 devices)**

```bash
SCAN_INTERVAL=30         # Scan every 30 seconds
MAX_CONCURRENT=100       # More concurrent scans
PORT_SCAN_ENABLED=true   # Enable port scanning
```

---

## 🗑️ **Uninstall**

### **Docker Installation**

```bash
cd ~/lansnix
sudo docker compose down -v
cd ~
rm -rf lansnix
```

### **System Installation**

```bash
sudo bash ~/lansnix/scripts/uninstall.sh
```

---

## 📞 **Getting Help**

### **Check Documentation**

```bash
cd ~/lansnix
cat README.md
cat docs/INSTALLATION.md
cat docs/FAQ.md
```

### **Report Issues**

https://github.com/YOUR-USERNAME/lansnix/issues

---

## 🎉 **You're All Set!**

LANsnix is now running on your Linux machine and monitoring your network!

**Access it at:** http://localhost:3000

**Or from other devices:** http://YOUR-LINUX-IP:3000

---

**Created by [Yasir Ispawoo](https://github.com/ispawoo)**

Enjoy monitoring your network! 🚀
