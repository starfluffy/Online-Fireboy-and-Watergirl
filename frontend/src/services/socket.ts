import { io, Socket } from "socket.io-client";

// Get backend URL from environment or localStorage override
const getBackendUrl = (): string => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  const savedBackend = localStorage.getItem("override_backend_url");
  if (savedBackend) {
    return savedBackend;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // If accessing on localhost
    if (host === "localhost" || host === "127.0.0.1") {
      return `http://${host}:3000`;
    }
  }

  return "http://localhost:3000";
};

export const socket: Socket = io(getBackendUrl(), {
  autoConnect: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 15,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("[Socket.io] Connected to backend server:", socket.io.opts.hostname, socket.id);
});

socket.on("connect_error", (err) => {
  console.warn("[Socket.io] Connection error to backend server:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("[Socket.io] Disconnected:", reason);
});