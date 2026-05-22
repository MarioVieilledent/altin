import type { Game } from "./types";

export class Socket {
  socket: WebSocket;
  handleGameUpdate: (game: Game) => void;

  constructor(handleGameUpdate: (game: Game) => void) {
    this.handleGameUpdate = handleGameUpdate;

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    this.socket = new WebSocket(
      `${wsProtocol}//${window.location.hostname}:8080/ws`,
    );

    // Establish connection to the Go WebSocket server
    this.socket.addEventListener("open", () => {
      // Construct the data payload
      const payload = {
        event: "client_greet",
        text: "Hello from the browser!",
      };

      // Convert object to a string and send it
      this.socket.send(JSON.stringify(payload));
    });

    // Triggered when the connection is successfully opened
    this.socket.addEventListener("open", () => {
      console.log("Connected to the WebSocket server.");
    });

    // Triggered when a new message is received from the server
    this.socket.addEventListener("message", (event) => {
      try {
        const game = JSON.parse(event.data);
        this.handleGameUpdate(game);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    });

    // Triggered when the connection is closed
    this.socket.addEventListener("close", (event) => {
      console.log("Connection closed:", event.reason);
    });

    // Triggered when an error occurs
    this.socket.addEventListener("error", (error) => {
      console.error("WebSocket Error:", error);
    });
  }
}
