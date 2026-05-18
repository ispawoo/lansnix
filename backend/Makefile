# LANsnix Makefile
# Created by Yasir Ispawoo (https://github.com/ispawoo)

.PHONY: build run test clean install docker

BINARY_NAME=lansnix
VERSION=1.0.0
BUILD_DIR=build
GO_FILES=$(shell find . -name '*.go' -type f)

# Build the application
build:
	@echo "Building LANsnix v$(VERSION)..."
	@mkdir -p $(BUILD_DIR)
	CGO_ENABLED=1 go build -ldflags="-X main.Version=$(VERSION)" -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/server
	@echo "Build complete: $(BUILD_DIR)/$(BINARY_NAME)"

# Run the application
run: build
	@echo "Starting LANsnix..."
	sudo $(BUILD_DIR)/$(BINARY_NAME)

# Run tests
test:
	@echo "Running tests..."
	go test -v ./...

# Clean build artifacts
clean:
	@echo "Cleaning..."
	rm -rf $(BUILD_DIR)
	go clean

# Install system-wide
install: build
	@echo "Installing LANsnix..."
	sudo cp $(BUILD_DIR)/$(BINARY_NAME) /usr/local/bin/
	sudo setcap cap_net_raw+ep /usr/local/bin/$(BINARY_NAME)
	@echo "Installation complete"

# Build Docker image
docker:
	@echo "Building Docker image..."
	docker build -t lansnix:$(VERSION) -t lansnix:latest .

# Format code
fmt:
	go fmt ./...

# Lint code
lint:
	golangci-lint run

# Development mode with hot reload
dev:
	air

# Show version
version:
	@echo "LANsnix v$(VERSION)"
	@echo "Created by Yasir Ispawoo"
