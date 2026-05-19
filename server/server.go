package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

// Define the JSON structure to send to the frontend
type Message struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Data      string    `json:"data"`
}

// Struct matching the incoming JSON from frontendy
type FrontendMessage struct {
	Event string `json:"event"`
	Text  string `json:"text"`
}

// Configure the upgrader to allow cross-origin requests if needed
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Adjust this in production for security
	},
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	// Launch the outbound writer in a separate goroutine so it doesn't block reading
	go func() {
		// Example loop: Send a JSON message every 3 seconds
		for {
			payload := Message{
				Status:    "success",
				Timestamp: time.Now(),
				Data:      "Hello from the Go backend!",
			}

			// Serialize the struct to JSON
			jsonMessage, err := json.Marshal(payload)
			if err != nil {
				log.Println("JSON marshal error:", err)
				break
			}

			// Send the JSON as a text message
			err = conn.WriteMessage(websocket.TextMessage, jsonMessage)
			if err != nil {
				log.Println("Write error:", err)
				break
			}

			time.Sleep(3 * time.Second)
		}
	}()

	// The Read Loop: Keep listening for incoming messages from the frontend
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break // Exit loop if client disconnects
		}

		// Parse the incoming JSON
		var incoming FrontendMessage
		if err := json.Unmarshal(message, &incoming); err != nil {
			log.Println("Error parsing frontend JSON:", err)
			continue
		}

		// Handle the data
		log.Printf("Received from frontend: Event=%s, Text=%s", incoming.Event, incoming.Text)
	}
}

func main() {
	// 1. Serve static files (HTML, JS, CSS) from the "static" directory
	// Root URL "/" will look for "index.html" inside the "./static" folder
	fileServer := http.FileServer(http.Dir("./static"))
	http.Handle("/", fileServer)

	// 2. WebSocket endpoint
	http.HandleFunc("/ws", handleWebSocket)

	log.Println("Server starting on http://localhost:8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe error:", err)
	}
}
