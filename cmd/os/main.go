package main

import (
	"altin/core"
	"embed"
	"encoding/json"
	"io/fs"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

var game *core.Game

//go:embed static/*
var embeddedFiles embed.FS

// Define the JSON structure to send to the frontend
type Message struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Data      string    `json:"data"`
}

// Struct matching the incoming JSON from frontendy
type FrontendMessage struct {
	Event string `json:"event"`
	Data  string `json:"data"`
}

// Configure the upgrader to allow cross-origin requests if needed
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Adjust this in production for security
	},
}

func socketLoopSend(conn *websocket.Conn) {
	for {
		if game == nil {
			err := conn.WriteMessage(websocket.TextMessage, []byte("noGameCreated"))
			if err != nil {
				log.Println("Write error:", err)
				break
			}
		} else {
			jsonGame, err := json.Marshal(*game)
			if err != nil {
				log.Println("JSON marshal error:", err)
				break
			}
			err = conn.WriteMessage(websocket.TextMessage, []byte(jsonGame))
			if err != nil {
				log.Println("Write error:", err)
				break
			}
		}

		time.Sleep(2000 * time.Millisecond)
	}
}

func socketListen(conn *websocket.Conn) {
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break // Exit loop if client disconnects
		}

		// Parse the payload JSON
		var payload FrontendMessage
		if err := json.Unmarshal(message, &payload); err != nil {
			log.Println("Error parsing frontend JSON:", err)
			continue
		}

		// Handle the data
		log.Printf("Received from frontend: Event=%s, Data=%s", payload.Event, payload.Data)

		if payload.Event == "createMap" {
			var data struct {
				Name    string `json:"name"`
				MapSize int32  `json:"mapSize"`
			}
			if err = json.Unmarshal([]byte(payload.Data), &data); err != nil {
				log.Println("Error parsing data from createMap message:", err)
				continue
			}

			game = core.NewGame(data.Name, data.MapSize)
			game.Players = append(game.Players, *core.NewPlayer("Test Player 1"))
			game.Players[0].Units = append(game.Players[0].Units, *core.NewVillager())
			log.Printf("New game created name = %s, game map size = %d", data.Name, data.MapSize)
		}
	}
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	go socketLoopSend(conn)

	go socketListen(conn)
}

func main() {
	staticFS, err := fs.Sub(embeddedFiles, "static")
	if err != nil {
		panic(err)
	}

	// 1. Serve static files (HTML, JS, CSS) from the "static" directory
	fileServer := http.FileServer(http.FS(staticFS))
	http.Handle("/", fileServer)

	// 2. WebSocket endpoint
	http.HandleFunc("/ws", handleWebSocket)

	log.Println("Server starting on http://localhost:8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe error:", err)
	}
}
