# LANsnix Backend Dockerfile
# Created by Yasir Ispawoo (https://github.com/ispawoo)

FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache gcc musl-dev libpcap-dev git

WORKDIR /build

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -ldflags="-w -s" -o lansnix ./cmd/server

# Final stage
FROM alpine:latest

# Install runtime dependencies
RUN apk add --no-cache libpcap ca-certificates

# Create non-root user
RUN addgroup -g 1000 lansnix && \
    adduser -D -u 1000 -G lansnix lansnix

WORKDIR /app

# Copy binary from builder
COPY --from=builder /build/lansnix .

# Create data directory
RUN mkdir -p /data /logs && \
    chown -R lansnix:lansnix /app /data /logs

# Labels
LABEL maintainer="Yasir Ispawoo <https://github.com/ispawoo>"
LABEL description="LANsnix - Realtime LAN Discovery & Monitoring Platform"
LABEL version="1.0.0"

EXPOSE 8080

# Run as non-root (note: requires NET_RAW capability)
USER lansnix

CMD ["./lansnix"]
