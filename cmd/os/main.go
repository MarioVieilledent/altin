package main

import (
	"altin/core"
	"embed"
	"io/fs"
	"log"
	"net/http"
)

var game *core.Game

//go:embed static/*
var embeddedFiles embed.FS

func main() {
	staticFS, err := fs.Sub(embeddedFiles, "static")
	if err != nil {
		panic(err)
	}

	// 1. Serve static client as embeded files
	fileServer := http.FileServer(http.FS(staticFS))
	http.Handle("/", fileServer)

	// 2. WebSocket endpoint
	http.HandleFunc("/ws", handleWebSocket)

	log.Println("Server starting on http://localhost:8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe error:", err)
	}
}
