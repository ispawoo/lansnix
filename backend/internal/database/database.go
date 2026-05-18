// LANsnix Database Layer
// Created by Yasir Ispawoo (https://github.com/ispawoo)

package database

import (
	"database/sql"
	"os"
	"path/filepath"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type Database struct {
	db *sql.DB
}

type Device struct {
	ID          int       `json:"id"`
	IP          string    `json:"ip"`
	MAC         string    `json:"mac"`
	Hostname    string    `json:"hostname"`
	Vendor      string    `json:"vendor"`
	Status      string    `json:"status"`
	Latency     float64   `json:"latency"`
	FirstSeen   time.Time `json:"first_seen"`
	LastSeen    time.Time `json:"last_seen"`
	OpenPorts   string    `json:"open_ports"`
}

type Activity struct {
	ID        int       `json:"id"`
	DeviceID  int       `json:"device_id"`
	Type      string    `json:"type"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	IP        string    `json:"ip"`
	Hostname  string    `json:"hostname"`
}

type Port struct {
	ID        int       `json:"id"`
	DeviceID  int       `json:"device_id"`
	Port      int       `json:"port"`
	Service   string    `json:"service"`
	State     string    `json:"state"`
	LastSeen  time.Time `json:"last_seen"`
}

func New(dbPath string) (*Database, error) {
	// Ensure directory exists
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, err
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	database := &Database{db: db}
	if err := database.migrate(); err != nil {
		return nil, err
	}

	return database, nil
}

func (d *Database) migrate() error {
	schema := `
	CREATE TABLE IF NOT EXISTS devices (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		ip TEXT UNIQUE NOT NULL,
		mac TEXT NOT NULL,
		hostname TEXT,
		vendor TEXT,
		status TEXT DEFAULT 'online',
		latency REAL DEFAULT 0,
		first_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
		last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
		open_ports TEXT
	);

	CREATE TABLE IF NOT EXISTS activity (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		device_id INTEGER,
		type TEXT NOT NULL,
		message TEXT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		ip TEXT,
		hostname TEXT,
		FOREIGN KEY (device_id) REFERENCES devices(id)
	);

	CREATE TABLE IF NOT EXISTS ports (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		device_id INTEGER NOT NULL,
		port INTEGER NOT NULL,
		service TEXT,
		state TEXT DEFAULT 'open',
		last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (device_id) REFERENCES devices(id),
		UNIQUE(device_id, port)
	);

	CREATE INDEX IF NOT EXISTS idx_devices_ip ON devices(ip);
	CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
	CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON activity(timestamp);
	CREATE INDEX IF NOT EXISTS idx_ports_device ON ports(device_id);
	`

	_, err := d.db.Exec(schema)
	return err
}

func (d *Database) Close() error {
	return d.db.Close()
}

// Device operations
func (d *Database) UpsertDevice(device *Device) error {
	query := `
	INSERT INTO devices (ip, mac, hostname, vendor, status, latency, last_seen)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT(ip) DO UPDATE SET
		mac = excluded.mac,
		hostname = excluded.hostname,
		vendor = excluded.vendor,
		status = excluded.status,
		latency = excluded.latency,
		last_seen = excluded.last_seen
	`
	_, err := d.db.Exec(query, device.IP, device.MAC, device.Hostname, device.Vendor, device.Status, device.Latency, time.Now())
	return err
}

func (d *Database) GetAllDevices() ([]Device, error) {
	query := `SELECT id, ip, mac, hostname, vendor, status, latency, first_seen, last_seen, COALESCE(open_ports, '') FROM devices ORDER BY last_seen DESC`
	rows, err := d.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var devices []Device
	for rows.Next() {
		var dev Device
		err := rows.Scan(&dev.ID, &dev.IP, &dev.MAC, &dev.Hostname, &dev.Vendor, &dev.Status, &dev.Latency, &dev.FirstSeen, &dev.LastSeen, &dev.OpenPorts)
		if err != nil {
			continue
		}
		devices = append(devices, dev)
	}

	return devices, nil
}

func (d *Database) GetDeviceByIP(ip string) (*Device, error) {
	query := `SELECT id, ip, mac, hostname, vendor, status, latency, first_seen, last_seen, COALESCE(open_ports, '') FROM devices WHERE ip = ?`
	var dev Device
	err := d.db.QueryRow(query, ip).Scan(&dev.ID, &dev.IP, &dev.MAC, &dev.Hostname, &dev.Vendor, &dev.Status, &dev.Latency, &dev.FirstSeen, &dev.LastSeen, &dev.OpenPorts)
	if err != nil {
		return nil, err
	}
	return &dev, nil
}

func (d *Database) UpdateDeviceStatus(ip, status string) error {
	query := `UPDATE devices SET status = ?, last_seen = ? WHERE ip = ?`
	_, err := d.db.Exec(query, status, time.Now(), ip)
	return err
}

// Activity operations
func (d *Database) AddActivity(activity *Activity) error {
	query := `INSERT INTO activity (device_id, type, message, ip, hostname) VALUES (?, ?, ?, ?, ?)`
	_, err := d.db.Exec(query, activity.DeviceID, activity.Type, activity.Message, activity.IP, activity.Hostname)
	return err
}

func (d *Database) GetRecentActivity(limit int) ([]Activity, error) {
	query := `SELECT id, COALESCE(device_id, 0), type, COALESCE(message, ''), timestamp, COALESCE(ip, ''), COALESCE(hostname, '') FROM activity ORDER BY timestamp DESC LIMIT ?`
	rows, err := d.db.Query(query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []Activity
	for rows.Next() {
		var act Activity
		err := rows.Scan(&act.ID, &act.DeviceID, &act.Type, &act.Message, &act.Timestamp, &act.IP, &act.Hostname)
		if err != nil {
			continue
		}
		activities = append(activities, act)
	}

	return activities, nil
}

// Port operations
func (d *Database) UpsertPort(port *Port) error {
	query := `
	INSERT INTO ports (device_id, port, service, state, last_seen)
	VALUES (?, ?, ?, ?, ?)
	ON CONFLICT(device_id, port) DO UPDATE SET
		service = excluded.service,
		state = excluded.state,
		last_seen = excluded.last_seen
	`
	_, err := d.db.Exec(query, port.DeviceID, port.Port, port.Service, port.State, time.Now())
	return err
}

func (d *Database) GetDevicePorts(deviceID int) ([]Port, error) {
	query := `SELECT id, device_id, port, service, state, last_seen FROM ports WHERE device_id = ? ORDER BY port`
	rows, err := d.db.Query(query, deviceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ports []Port
	for rows.Next() {
		var p Port
		err := rows.Scan(&p.ID, &p.DeviceID, &p.Port, &p.Service, &p.State, &p.LastSeen)
		if err != nil {
			continue
		}
		ports = append(ports, p)
	}

	return ports, nil
}

func (d *Database) GetStats() (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// Total devices
	var total int
	d.db.QueryRow("SELECT COUNT(*) FROM devices").Scan(&total)
	stats["total_devices"] = total

	// Online devices
	var online int
	d.db.QueryRow("SELECT COUNT(*) FROM devices WHERE status = 'online'").Scan(&online)
	stats["online_devices"] = online

	// Offline devices
	stats["offline_devices"] = total - online

	// Total activities
	var activities int
	d.db.QueryRow("SELECT COUNT(*) FROM activity").Scan(&activities)
	stats["total_activities"] = activities

	return stats, nil
}
