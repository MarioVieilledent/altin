import type { Game } from "./types";

export interface SocketPayload {
  event: string;
  data: string;
}

export class Socket {
  socket: WebSocket;
  status: "ok" | "fetching" | "error" | "closed" = "fetching";
  statusInfo: string = "";
  handleGameUpdate: (game: Game) => void;

  constructor(handleGameUpdate: (game: Game) => void) {
    this.handleGameUpdate = handleGameUpdate;

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    this.socket = new WebSocket(
      `${wsProtocol}//${window.location.hostname}:8080/ws`,
    );

    // Triggered when the connection is successfully opened
    this.socket.addEventListener("open", () => {
      // Construct the data payload
      const payload: SocketPayload = {
        event: "client_greet",
        data: "Hello from the browser!",
      };

      // Convert object to a string and send it
      this.socket.send(JSON.stringify(payload));

      this.status = "ok";
      this.statusInfo = "Connected to the WebSocket server.";
    });

    // Triggered when a new message is received from the server
    this.socket.addEventListener("message", (event) => {
      this.status = "ok";
      if (event.data === "noGameCreated") {
      } else {
        try {
          const game = JSON.parse(event.data);
          this.handleGameUpdate(game);
        } catch (error) {
          console.error("Error parsing JSON: ", error);
        }
      }
    });

    // Triggered when the connection is closed
    this.socket.addEventListener("close", (event) => {
      this.status = "closed";
      this.statusInfo = "Connection closed: " + event.reason;
    });

    // Triggered when an error occurs
    this.socket.addEventListener("error", (error) => {
      this.status = "error";
      this.statusInfo = "WebSocket Error: " + error;
    });
  }

  public send(data: any) {
    const payload: SocketPayload = {
      event: "createMap",
      data: JSON.stringify(data),
    };

    this.socket.send(JSON.stringify(payload));
  }
}
