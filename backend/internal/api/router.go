// LANsnix API Router
// Created by Yasir Ispawoo (https://github.com/ispawoo)

package api

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/ispawoo/lansnix/internal/config"
	"github.com/ispawoo/lansnix/internal/database"
	"github.com/ispawoo/lansnix/internal/scanner"
	ws "github.com/ispawoo/lansnix/internal/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // In production, validate origin
	},
}

type API struct {
	db      *database.Database
	hub     *ws.Hub
	scanner *scanner.Service
	cfg     *config.Config
}

func NewRouter(db *database.Database, hub *ws.Hub, scannerService *scanner.Service, cfg *config.Config) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()

	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := &API{
		db:      db,
		hub:     hub,
		scanner: scannerService,
		cfg:     cfg,
	}

	// API routes
	v1 := router.Group("/api")
	{
		v1.GET("/health", api.healthCheck)
		v1.GET("/stats", api.getStats)
		v1.GET("/devices", api.getDevices)
		v1.GET("/devices/:ip", api.getDevice)
		v1.GET("/activity", api.getActivity)
		v1.GET("/ports/:id", api.getDevicePorts)
		v1.POST("/scan", api.triggerScan)
		v1.GET("/ws", api.handleWebSocket)
	}

	return router
}

func (a *API) healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"version": "1.0.0",
		"author":  "Yasir Ispawoo",
	})
}

func (a *API) getStats(c *gin.Context) {
	stats, err := a.db.GetStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (a *API) getDevices(c *gin.Context) {
	devices, err := a.db.GetAllDevices()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, devices)
}

func (a *API) getDevice(c *gin.Context) {
	ip := c.Param("ip")
	device, err := a.db.GetDeviceByIP(ip)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}

	c.JSON(http.StatusOK, device)
}

func (a *API) getActivity(c *gin.Context) {
	limit := 100
	if limitStr := c.Query("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			limit = l
		}
	}

	activities, err := a.db.GetRecentActivity(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, activities)
}

func (a *API) getDevicePorts(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid device ID"})
		return
	}

	ports, err := a.db.GetDevicePorts(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, ports)
}

func (a *API) triggerScan(c *gin.Context) {
	go a.scanner.TriggerScan()
	c.JSON(http.StatusOK, gin.H{"message": "Scan triggered"})
}

func (a *API) handleWebSocket(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}

	client := ws.NewClient(a.hub, conn)
	a.hub.Register(client)

	go client.WritePump()
	go client.ReadPump()
}
