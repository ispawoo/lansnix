# Security Policy

Created by [Yasir Ispawoo](https://github.com/ispawoo)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

LANsnix implements several security measures:

### Network Security
- **Minimal Privileges**: Uses Linux capabilities (CAP_NET_RAW) instead of full root
- **Local Only**: Designed for local network scanning only
- **No External APIs**: All data stays on your network

### API Security
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **CORS Configuration**: Configurable origin restrictions
- **SQL Injection Prevention**: Parameterized queries

### WebSocket Security
- **Origin Validation**: Checks WebSocket connection origins
- **Connection Limits**: Prevents resource exhaustion
- **Message Validation**: Validates all incoming messages

### Data Security
- **Local Storage**: SQLite database stored locally
- **No Cloud Sync**: No data leaves your network
- **File Permissions**: Proper Unix permissions on data files

## Security Best Practices

### Deployment

1. **Use Docker**: Isolates the application
2. **Firewall Rules**: Restrict access to API ports
3. **HTTPS**: Use reverse proxy with SSL/TLS
4. **Network Isolation**: Run on management VLAN

### Configuration

```bash
# Restrict API to localhost only
API_HOST=127.0.0.1

# Enable rate limiting
RATE_LIMIT_ENABLED=true

# Use strong firewall rules
sudo ufw allow from 192.168.1.0/24 to any port 8080
```

### Production Checklist

- [ ] Change default ports
- [ ] Configure firewall rules
- [ ] Use reverse proxy with SSL
- [ ] Enable rate limiting
- [ ] Restrict CORS origins
- [ ] Regular updates
- [ ] Monitor logs
- [ ] Backup database

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email: [Create a private security advisory on GitHub]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-3 days
  - High: 1-2 weeks
  - Medium: 2-4 weeks
  - Low: Next release

## Security Updates

Security updates are released as:
- Patch versions (1.0.x)
- Announced in CHANGELOG.md
- Tagged as security releases

## Known Limitations

### By Design

1. **Root/Sudo Required**: Network scanning requires elevated privileges
2. **Local Network Only**: Not designed for internet-wide scanning
3. **No Authentication**: Currently no user authentication system

### Mitigations

1. Use Linux capabilities instead of full root
2. Firewall rules to restrict access
3. Deploy behind authenticated reverse proxy

## Responsible Disclosure

We follow responsible disclosure practices:
- 90-day disclosure timeline
- Credit to reporters (if desired)
- CVE assignment for critical issues

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Go Security Best Practices](https://golang.org/doc/security/)

## Contact

For security concerns:
- GitHub Security Advisories: [github.com/ispawoo/lansnix/security](https://github.com/ispawoo/lansnix/security)
- Project Issues: [github.com/ispawoo/lansnix/issues](https://github.com/ispawoo/lansnix/issues)

---

Thank you for helping keep LANsnix secure!
