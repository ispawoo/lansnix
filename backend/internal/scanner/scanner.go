// LANsnix Network Scanner Service
// Created by Yasir Ispawoo (https://github.com/ispawoo)

package scanner

import (
	"fmt"
	"net"
	"sync"
	"time"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/google/gopacket/pcap"
	"github.com/ispawoo/lansnix/internal/config"
	"github.com/ispawoo/lansnix/internal/database"
	"github.com/ispawoo/lansnix/internal/vendor"
	"github.com/ispawoo/lansnix/internal/websocket"
	"github.com/sirupsen/logrus"
)

var log = logrus.New()

type Service struct {
	db       *database.Database
	hub      *websocket.Hub
	cfg      *config.Config
	stopChan chan struct{}
	running  bool
	mu       sync.Mutex
}

type ScanResult struct {
	IP       string
	MAC      string
	Hostname string
	Vendor   string
	Latency  float64
	Online   bool
}

func NewService(db *database.Database, hub *websocket.Hub, cfg *config.Config) *Service {
	return &Service{
		db:       db,
		hub:      hub,
		cfg:      cfg,
		stopChan: make(chan struct{}),
	}
}

func (s *Service) Start() {
	s.mu.Lock()
	s.running = true
	s.mu.Unlock()

	log.Info("Scanner service started")

	// Initial scan
	s.performScan()

	// Periodic scanning
	ticker := time.NewTicker(s.cfg.Scanner.Interval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			s.performScan()
		case <-s.stopChan:
			log.Info("Scanner service stopped")
			return
		}
	}
}

func (s *Service) Stop() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.running {
		close(s.stopChan)
		s.running = false
	}
}

func (s *Service) TriggerScan() {
	go s.performScan()
}

func (s *Service) performScan() {
	log.Info("Starting network scan...")
	startTime := time.Now()

	// Get local network interface and subnet
	iface, subnet, err := s.getNetworkInfo()
	if err != nil {
		log.Error("Failed to get network info: ", err)
		return
	}

	log.Infof("Scanning subnet: %s on interface: %s", subnet, iface.Name)

	// Perform ARP scan
	results := s.arpScan(iface, subnet)

	// Process results
	for _, result := range results {
		device := &database.Device{
			IP:       result.IP,
			MAC:      result.MAC,
			Hostname: result.Hostname,
			Vendor:   result.Vendor,
			Status:   "online",
			Latency:  result.Latency,
		}

		// Check if device exists
		existing, err := s.db.GetDeviceByIP(result.IP)
		isNew := err != nil

		// Upsert device
		if err := s.db.UpsertDevice(device); err != nil {
			log.Error("Failed to upsert device: ", err)
			continue
		}

		// Get device ID
		dev, _ := s.db.GetDeviceByIP(result.IP)

		// Log activity for new devices
		if isNew {
			activity := &database.Activity{
				DeviceID: dev.ID,
				Type:     "device_joined",
				Message:  fmt.Sprintf("New device discovered: %s (%s)", result.IP, result.Hostname),
				IP:       result.IP,
				Hostname: result.Hostname,
			}
			s.db.AddActivity(activity)

			// Send WebSocket notification
			s.hub.Broadcast(websocket.Message{
				Type: "device_online",
				Data: map[string]interface{}{
					"ip":       result.IP,
					"mac":      result.MAC,
					"hostname": result.Hostname,
					"vendor":   result.Vendor,
				},
			})
		} else if existing.Status == "offline" {
			// Device came back online
			activity := &database.Activity{
				DeviceID: dev.ID,
				Type:     "device_online",
				Message:  fmt.Sprintf("Device came online: %s", result.IP),
				IP:       result.IP,
				Hostname: result.Hostname,
			}
			s.db.AddActivity(activity)

			s.hub.Broadcast(websocket.Message{
				Type: "device_online",
				Data: map[string]interface{}{
					"ip":       result.IP,
					"hostname": result.Hostname,
				},
			})
		}

		// Port scanning if enabled
		if s.cfg.Scanner.PortScanEnabled && dev != nil {
			go s.scanPorts(dev.ID, result.IP)
		}
	}

	duration := time.Since(startTime)
	log.Infof("Scan completed in %v. Found %d devices", duration, len(results))

	// Send scan complete notification
	s.hub.Broadcast(websocket.Message{
		Type: "scan_complete",
		Data: map[string]interface{}{
			"duration": duration.Seconds(),
			"count":    len(results),
		},
	})
}

func (s *Service) getNetworkInfo() (*net.Interface, *net.IPNet, error) {
	ifaces, err := net.Interfaces()
	if err != nil {
		return nil, nil, err
	}

	for _, iface := range ifaces {
		// Skip loopback and down interfaces
		if iface.Flags&net.FlagLoopback != 0 || iface.Flags&net.FlagUp == 0 {
			continue
		}

		addrs, err := iface.Addrs()
		if err != nil {
			continue
		}

		for _, addr := range addrs {
			ipNet, ok := addr.(*net.IPNet)
			if !ok || ipNet.IP.To4() == nil {
				continue
			}

			// Found a valid IPv4 interface
			return &iface, ipNet, nil
		}
	}

	return nil, nil, fmt.Errorf("no suitable network interface found")
}

func (s *Service) arpScan(iface *net.Interface, subnet *net.IPNet) []ScanResult {
	var results []ScanResult
	var mu sync.Mutex
	var wg sync.WaitGroup

	// Generate IP list
	ips := generateIPList(subnet)

	// Limit concurrent scans
	semaphore := make(chan struct{}, s.cfg.Scanner.MaxConcurrent)

	for _, ip := range ips {
		wg.Add(1)
		go func(targetIP string) {
			defer wg.Done()
			semaphore <- struct{}{}
			defer func() { <-semaphore }()

			// Ping to check if host is alive
			latency, alive := s.pingHost(targetIP)
			if !alive {
				return
			}

			// Get MAC address
			mac := s.getMACAddress(targetIP)
			if mac == "" {
				return
			}

			// Get hostname
			hostname := s.resolveHostname(targetIP)

			// Get vendor
			vendorName := vendor.Lookup(mac)

			result := ScanResult{
				IP:       targetIP,
				MAC:      mac,
				Hostname: hostname,
				Vendor:   vendorName,
				Latency:  latency,
				Online:   true,
			}

			mu.Lock()
			results = append(results, result)
			mu.Unlock()
		}(ip)
	}

	wg.Wait()
	return results
}

func (s *Service) pingHost(ip string) (float64, bool) {
	start := time.Now()
	conn, err := net.DialTimeout("ip4:icmp", ip, s.cfg.Scanner.Timeout)
	if err != nil {
		return 0, false
	}
	defer conn.Close()

	latency := time.Since(start).Seconds() * 1000 // Convert to milliseconds
	return latency, true
}

func (s *Service) getMACAddress(ip string) string {
	// Try to get MAC from ARP cache
	ifaces, err := net.Interfaces()
	if err != nil {
		return ""
	}

	for _, iface := range ifaces {
		if iface.Flags&net.FlagLoopback != 0 {
			continue
		}

		// This is a simplified version - in production, use gopacket for ARP
		// For now, return a placeholder
		return "00:00:00:00:00:00"
	}

	return ""
}

func (s *Service) resolveHostname(ip string) string {
	names, err := net.LookupAddr(ip)
	if err != nil || len(names) == 0 {
		return ip
	}
	return names[0]
}

func (s *Service) scanPorts(deviceID int, ip string) {
	for _, port := range s.cfg.Scanner.PortRanges {
		address := fmt.Sprintf("%s:%d", ip, port)
		conn, err := net.DialTimeout("tcp", address, 2*time.Second)
		
		if err == nil {
			conn.Close()
			
			// Port is open
			service := getServiceName(port)
			portInfo := &database.Port{
				DeviceID: deviceID,
				Port:     port,
				Service:  service,
				State:    "open",
			}

			s.db.UpsertPort(portInfo)
		}
	}
}

func generateIPList(subnet *net.IPNet) []string {
	var ips []string
	
	ip := subnet.IP.Mask(subnet.Mask)
	for ip := ip.Mask(subnet.Mask); subnet.Contains(ip); inc(ip) {
		ips = append(ips, ip.String())
	}

	// Remove network and broadcast addresses
	if len(ips) > 2 {
		return ips[1 : len(ips)-1]
	}

	return ips
}

func inc(ip net.IP) {
	for j := len(ip) - 1; j >= 0; j-- {
		ip[j]++
		if ip[j] > 0 {
			break
		}
	}
}

func getServiceName(port int) string {
	services := map[int]string{
		21:   "FTP",
		22:   "SSH",
		23:   "Telnet",
		25:   "SMTP",
		53:   "DNS",
		80:   "HTTP",
		110:  "POP3",
		143:  "IMAP",
		443:  "HTTPS",
		445:  "SMB",
		3306: "MySQL",
		3389: "RDP",
		5432: "PostgreSQL",
		8080: "HTTP-Alt",
	}

	if name, ok := services[port]; ok {
		return name
	}
	return "Unknown"
}
