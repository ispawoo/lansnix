# LANsnix API Documentation

Created by [Yasir Ispawoo](https://github.com/ispawoo)

## Base URL

```
http://localhost:8080/api
```

## Authentication

Currently, LANsnix does not require authentication. This may change in future versions.

## Endpoints

### Health Check

Check API status and version.

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "author": "Yasir Ispawoo"
}
```

---

### Get Statistics

Retrieve network statistics.

```http
GET /api/stats
```

**Response:**
```json
{
  "total_devices": 15,
  "online_devices": 12,
  "offline_devices": 3,
  "total_activities": 247
}
```

---

### List Devices

Get all discovered devices.

```http
GET /api/devices
```

**Response:**
```json
[
  {
    "id": 1,
    "ip": "192.168.1.100",
    "mac": "AA:BB:CC:DD:EE:FF",
    "hostname": "laptop.local",
    "vendor": "Apple",
    "status": "online",
    "latency": 2.5,
    "first_seen": "2024-01-15T10:00:00Z",
    "last_seen": "2024-01-15T10:30:00Z",
    "open_ports": "22,80,443"
  }
]
```

---

### Get Device

Retrieve details for a specific device.

```http
GET /api/devices/:ip
```

**Parameters:**
- `ip` (string): Device IP address

**Response:**
```json
{
  "id": 1,
  "ip": "192.168.1.100",
  "mac": "AA:BB:CC:DD:EE:FF",
  "hostname": "laptop.local",
  "vendor": "Apple",
  "status": "online",
  "latency": 2.5,
  "first_seen": "2024-01-15T10:00:00Z",
  "last_seen": "2024-01-15T10:30:00Z",
  "open_ports": "22,80,443"
}
```

---

### Get Activity Feed

Retrieve recent network activity.

```http
GET /api/activity?limit=100
```

**Query Parameters:**
- `limit` (integer, optional): Number of activities to return (default: 100)

**Response:**
```json
[
  {
    "id": 1,
    "device_id": 1,
    "type": "device_joined",
    "message": "New device discovered: 192.168.1.100",
    "timestamp": "2024-01-15T10:00:00Z",
    "ip": "192.168.1.100",
    "hostname": "laptop.local"
  }
]
```

**Activity Types:**
- `device_joined`: New device discovered
- `device_online`: Device came online
- `device_offline`: Device went offline
- `port_change`: Port status changed
- `scan_complete`: Network scan completed

---

### Get Device Ports

Retrieve open ports for a device.

```http
GET /api/ports/:id
```

**Parameters:**
- `id` (integer): Device ID

**Response:**
```json
[
  {
    "id": 1,
    "device_id": 1,
    "port": 22,
    "service": "SSH",
    "state": "open",
    "last_seen": "2024-01-15T10:00:00Z"
  },
  {
    "id": 2,
    "device_id": 1,
    "port": 80,
    "service": "HTTP",
    "state": "open",
    "last_seen": "2024-01-15T10:00:00Z"
  }
]
```

---

### Trigger Network Scan

Manually trigger a network scan.

```http
POST /api/scan
```

**Response:**
```json
{
  "message": "Scan triggered"
}
```

---

## WebSocket

Connect to realtime updates.

```
ws://localhost:8080/api/ws
```

### Message Format

```json
{
  "type": "event_type",
  "data": {
    "key": "value"
  }
}
```

### Event Types

**device_online**
```json
{
  "type": "device_online",
  "data": {
    "ip": "192.168.1.100",
    "mac": "AA:BB:CC:DD:EE:FF",
    "hostname": "laptop.local",
    "vendor": "Apple"
  }
}
```

**device_offline**
```json
{
  "type": "device_offline",
  "data": {
    "ip": "192.168.1.100",
    "hostname": "laptop.local"
  }
}
```

**device_joined**
```json
{
  "type": "device_joined",
  "data": {
    "ip": "192.168.1.100",
    "mac": "AA:BB:CC:DD:EE:FF",
    "hostname": "laptop.local",
    "vendor": "Apple"
  }
}
```

**scan_complete**
```json
{
  "type": "scan_complete",
  "data": {
    "duration": 5.2,
    "count": 15
  }
}
```

---

## Error Responses

All endpoints may return error responses:

```json
{
  "error": "Error message"
}
```

**HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

API requests are rate limited to prevent abuse:
- **Limit**: 100 requests per minute
- **Window**: 60 seconds

Exceeding the limit returns `429 Too Many Requests`.

---

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

---

For more information, visit [github.com/ispawoo/lansnix](https://github.com/ispawoo/lansnix)
