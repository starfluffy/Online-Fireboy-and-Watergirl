import { io, Socket } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:3000`
    : "http://localhost:3000");

export const socket: Socket = io(BACKEND_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("[Socket.io] Connected to server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("[Socket.io] Disconnected:", reason);
});