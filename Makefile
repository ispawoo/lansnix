# LANsnix Root Makefile
# Created by Yasir Ispawoo (https://github.com/ispawoo)

.PHONY: help build run stop clean install docker dev

help:
	@echo "LANsnix - Realtime LAN Discovery & Monitoring Platform"
	@echo "Created by Yasir Ispawoo"
	@echo ""
	@echo "Available targets:"
	@echo "  make build      - Build backend and frontend"
	@echo "  make run        - Run with Docker Compose"
	@echo "  make stop       - Stop Docker Compose"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make install    - Install system-wide"
	@echo "  make docker     - Build Docker images"
	@echo "  make dev        - Run in development mode"
	@echo "  make test       - Run tests"

build:
	@echo "Building LANsnix..."
	cd backend && make build
	cd frontend && npm install && npm run build

run:
	@echo "Starting LANsnix with Docker Compose..."
	docker compose up -d

stop:
	@echo "Stopping LANsnix..."
	docker compose down

clean:
	@echo "Cleaning build artifacts..."
	cd backend && make clean
	cd frontend && rm -rf .next node_modules

install:
	@echo "Installing LANsnix..."
	sudo bash scripts/install.sh

docker:
	@echo "Building Docker images..."
	docker compose build

dev:
	@echo "Starting development mode..."
	@echo "Backend: http://localhost:8080"
	@echo "Frontend: http://localhost:3000"
	docker compose up

test:
	@echo "Running tests..."
	cd backend && go test ./...
	cd frontend && npm test

version:
	@echo "LANsnix v1.0.0"
	@echo "Created by Yasir Ispawoo"
	@echo "https://github.com/ispawoo/lansnix"
