# LANsnix Architecture

Created by [Yasir Ispawoo](https://github.com/ispawoo)

## Overview

LANsnix is built with a modern, scalable architecture designed for realtime network monitoring.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend Layer                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js 14 + TypeScript + TailwindCSS          │  │
│  │  - Dashboard UI                                   │  │
│  │  - Device Management                              │  │
│  │  - Network Visualization                          │  │
│  │  - Activity Feed                                  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API + WebSocket
                     │
┌────────────────────┴────────────────────────────────────┐
│                    Backend Layer                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Go 1.21+ with Gin Framework                     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │  │
│  │  │  Scanner   │  │    API     │  │  WebSocket │ │  │
│  │  │  Service   │  │   Router   │  │    Hub     │ │  │
│  │  └────────────┘  └────────────┘  └────────────┘ │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐ │  │
│  │  │   Port     │  │   Vendor   │  │  Activity  │ │  │
│  │  │  Scanner   │  │  Detector  │  │   Logger   │ │  │
│  │  └────────────┘  └────────────┘  └────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ SQL Queries
                     │
┌────────────────────┴────────────────────────────────────┐
│                   Data Layer                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  SQLite Database                                  │  │
│  │  - Devices Table                                  │  │
│  │  - Activity Table                                 │  │
│  │  - Ports Table                                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (Next.js)

**Technology Stack:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- Lucide Icons
- Recharts

**Key Features:**
- Server-side rendering
- Realtime WebSocket updates
- Responsive design
- Dark mode optimized
- Smooth animations

### Backend (Go)

**Technology Stack:**
- Go 1.21+
- Gin (HTTP framework)
- Gorilla WebSocket
- GoPacket (network scanning)
- SQLite driver

**Services:**

1. **Scanner Service**
   - ARP scanning
   - ICMP ping
   - Hostname resolution
   - MAC vendor lookup
   - Concurrent scanning

2. **Port Scanner**
   - TCP port scanning
   - Service detection
   - Configurable port ranges

3. **API Router**
   - RESTful endpoints
   - CORS support
   - Rate limiting
   - Error handling

4. **WebSocket Hub**
   - Realtime event broadcasting
   - Client management
   - Message routing

### Database (SQLite)

**Schema:**

```sql
devices (
  id INTEGER PRIMARY KEY,
  ip TEXT UNIQUE,
  mac TEXT,
  hostname TEXT,
  vendor TEXT,
  status TEXT,
  latency REAL,
  first_seen DATETIME,
  last_seen DATETIME,
  open_ports TEXT
)

activity (
  id INTEGER PRIMARY KEY,
  device_id INTEGER,
  type TEXT,
  message TEXT,
  timestamp DATETIME,
  ip TEXT,
  hostname TEXT
)

ports (
  id INTEGER PRIMARY KEY,
  device_id INTEGER,
  port INTEGER,
  service TEXT,
  state TEXT,
  last_seen DATETIME
)
```

## Data Flow

### Device Discovery Flow

```
1. Scanner Service triggers scan
2. ARP/ICMP packets sent to subnet
3. Responses collected
4. MAC vendor lookup performed
5. Hostname resolution attempted
6. Device data upserted to database
7. WebSocket event broadcast to clients
8. Frontend updates UI
```

### Port Scanning Flow

```
1. Device discovered
2. Port scanner triggered
3. TCP connections attempted
4. Open ports detected
5. Service identification
6. Port data saved to database
7. Device record updated
```

### Realtime Updates Flow

```
1. Backend event occurs
2. WebSocket hub receives event
3. Message broadcast to all clients
4. Frontend receives WebSocket message
5. UI updates reactively
6. Toast notification shown
```

## Security Considerations

- **Network Access**: Requires CAP_NET_RAW capability
- **API Security**: Rate limiting, input validation
- **WebSocket**: Origin validation
- **Database**: Parameterized queries
- **Permissions**: Minimal privilege principle

## Scalability

- **Concurrent Scanning**: Goroutines for parallel operations
- **Database**: Indexed queries for performance
- **WebSocket**: Efficient message broadcasting
- **Frontend**: Code splitting and lazy loading

## Deployment Options

1. **Docker Compose** (Recommended)
   - Isolated containers
   - Easy updates
   - Network mode: host

2. **Systemd Service**
   - Native Linux integration
   - Auto-restart
   - Log management

3. **Standalone Binary**
   - Single executable
   - No dependencies
   - Direct execution

## Performance Metrics

- **Scan Speed**: ~100 devices in 5-10 seconds
- **Memory Usage**: ~50-100MB
- **CPU Usage**: Low (burst during scans)
- **Database Size**: ~1MB per 1000 devices

## Future Enhancements

- Multi-subnet support
- SNMP integration
- Bandwidth monitoring
- Custom alerting rules
- Mobile app
- Plugin system

---

For more information, visit [github.com/ispawoo/lansnix](https://github.com/ispawoo/lansnix)
