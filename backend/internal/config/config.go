// LANsnix Configuration
// Created by Yasir Ispawoo (https://github.com/ispawoo)

package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	API      APIConfig
	Database DatabaseConfig
	Scanner  ScannerConfig
	Security SecurityConfig
}

type APIConfig struct {
	Host string
	Port int
}

type DatabaseConfig struct {
	Path string
}

type ScannerConfig struct {
	Interval         time.Duration
	Subnet           string
	Interface        string
	PortScanEnabled  bool
	PortRanges       []int
	Timeout          time.Duration
	MaxConcurrent    int
}

type SecurityConfig struct {
	RateLimitEnabled  bool
	RateLimitRequests int
	RateLimitWindow   time.Duration
}

// Load configuration from environment variables
func Load(configPath string) (*Config, error) {
	cfg := &Config{
		API: APIConfig{
			Host: getEnv("API_HOST", "0.0.0.0"),
			Port: getEnvInt("API_PORT", 8080),
		},
		Database: DatabaseConfig{
			Path: getEnv("DB_PATH", "./data/lansnix.db"),
		},
		Scanner: ScannerConfig{
			Interval:        time.Duration(getEnvInt("SCAN_INTERVAL", 60)) * time.Second,
			Subnet:          getEnv("SUBNET", "auto"),
			Interface:       getEnv("INTERFACE", "auto"),
			PortScanEnabled: getEnvBool("PORT_SCAN_ENABLED", true),
			PortRanges:      parsePortRanges(getEnv("PORT_RANGES", "22,80,443,3389,445,21,53")),
			Timeout:         5 * time.Second,
			MaxConcurrent:   100,
		},
		Security: SecurityConfig{
			RateLimitEnabled:  getEnvBool("RATE_LIMIT_ENABLED", true),
			RateLimitRequests: getEnvInt("RATE_LIMIT_REQUESTS", 100),
			RateLimitWindow:   time.Duration(getEnvInt("RATE_LIMIT_WINDOW", 60)) * time.Second,
		},
	}

	return cfg, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolVal, err := strconv.ParseBool(value); err == nil {
			return boolVal
		}
	}
	return defaultValue
}

func parsePortRanges(portStr string) []int {
	var ports []int
	parts := strings.Split(portStr, ",")
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if port, err := strconv.Atoi(part); err == nil {
			ports = append(ports, port)
		}
	}
	return ports
}
