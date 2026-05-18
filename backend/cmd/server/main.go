// LANsnix - Realtime LAN Discovery & Monitoring Platform
// Created by Yasir Ispawoo (https://github.com/ispawoo)

package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ispawoo/lansnix/internal/api"
	"github.com/ispawoo/lansnix/internal/config"
	"github.com/ispawoo/lansnix/internal/database"
	"github.com/ispawoo/lansnix/internal/scanner"
	"github.com/ispawoo/lansnix/internal/websocket"
	"github.com/sirupsen/logrus"
)

var (
	Version = "1.0.0"
	log     = logrus.New()
)

func main() {
	// Parse flags
	versionFlag := flag.Bool("version", false, "Print version information")
	configPath := flag.String("config", "", "Path to configuration file")
	flag.Parse()

	if *versionFlag {
		fmt.Printf("LANsnix v%s\n", Version)
		fmt.Println("Realtime LAN Discovery & Monitoring Platform")
		fmt.Println("Created by Yasir Ispawoo (https://github.com/ispawoo)")
		os.Exit(0)
	}

	// Setup logging
	setupLogging()

	log.Info("Starting LANsnix v", Version)
	log.Info("Created by Yasir Ispawoo")

	// Load configuration
	cfg, err := config.Load(*configPath)
	if err != nil {
		log.Fatal("Failed to load configuration: ", err)
	}

	// Initialize database
	db, err := database.New(cfg.Database.Path)
	if err != nil {
		log.Fatal("Failed to initialize database: ", err)
	}
	defer db.Close()

	log.Info("Database initialized at ", cfg.Database.Path)

	// Initialize WebSocket hub
	hub := websocket.NewHub()
	go hub.Run()

	// Initialize scanner service
	scannerService := scanner.NewService(db, hub, cfg)
	go scannerService.Start()

	log.Info("Scanner service started")

	// Initialize API server
	router := api.NewRouter(db, hub, scannerService, cfg)
	
	server := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", cfg.API.Host, cfg.API.Port),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Infof("API server listening on %s", server.Addr)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start server: ", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("Shutting down LANsnix...")

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	scannerService.Stop()
	hub.Shutdown()

	if err := server.Shutdown(ctx); err != nil {
		log.Error("Server forced to shutdown: ", err)
	}

	log.Info("LANsnix stopped")
}

func setupLogging() {
	log.SetFormatter(&logrus.JSONFormatter{})
	log.SetOutput(os.Stdout)
	
	level := os.Getenv("LOG_LEVEL")
	switch level {
	case "debug":
		log.SetLevel(logrus.DebugLevel)
	case "warn":
		log.SetLevel(logrus.WarnLevel)
	case "error":
		log.SetLevel(logrus.ErrorLevel)
	default:
		log.SetLevel(logrus.InfoLevel)
	}
}
