# Contributing to LANsnix

First off, thank you for considering contributing to LANsnix! 🎉

Created by [Yasir Ispawoo](https://github.com/ispawoo)

## Code of Conduct

This project and everyone participating in it is governed by respect, professionalism, and collaboration.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, Go version, Docker version)
- **Logs and screenshots**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- **Clear use case**
- **Expected behavior**
- **Why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Follow the existing code style
3. Add tests if applicable
4. Update documentation
5. Ensure all tests pass
6. Write clear commit messages

## Development Setup

### Prerequisites

- Go 1.21+
- Node.js 18+
- Docker (optional)
- libpcap-dev

### Backend Setup

```bash
cd backend
go mod download
go build -o lansnix ./cmd/server
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend
cd backend
go test ./...

# Frontend
cd frontend
npm test
```

## Style Guidelines

### Go Code

- Follow standard Go conventions
- Use `gofmt` and `golint`
- Write meaningful comments
- Keep functions focused and small

### TypeScript/React Code

- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Maintain component modularity

### Commit Messages

```
feat: add bandwidth monitoring
fix: resolve port scanning timeout
docs: update installation guide
style: format code with prettier
refactor: simplify scanner service
test: add device discovery tests
```

## Project Structure

```
lansnix/
├── backend/          # Go backend
│   ├── cmd/         # Entry points
│   ├── internal/    # Private code
│   └── pkg/         # Public libraries
├── frontend/        # Next.js frontend
│   ├── src/
│   │   ├── app/     # Pages
│   │   ├── components/
│   │   └── lib/     # Utilities
├── docker/          # Docker configs
├── scripts/         # Build/install scripts
└── docs/           # Documentation
```

## Questions?

Feel free to open an issue or reach out to [Yasir Ispawoo](https://github.com/ispawoo).

Thank you for contributing! 🚀
