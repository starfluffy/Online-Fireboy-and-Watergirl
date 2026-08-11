import { Server as SocketIOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import { roomStore } from "../game-state/roomStore.js";
import type { User, CharacterRole, PlayerPosition } from "../types/types.js";

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Create a new room
    socket.on("create_room", (payload: { user: User; preferredRole?: CharacterRole }, callback?: (res: any) => void) => {
      const room = roomStore.createRoom(socket.id, payload.user, payload.preferredRole);
      socket.join(room.roomCode);
      console.log(`[Socket] Room created: ${room.roomCode} by ${payload.user.username}`);
      
      const res = { success: true, room };
      if (callback) callback(res);
      socket.emit("room_updated", room);
    });

    // Join an existing room
    socket.on("join_room", (payload: { roomCode: string; user: User }, callback?: (res: any) => void) => {
      const { room, error } = roomStore.joinRoom(payload.roomCode, socket.id, payload.user);
      if (error || !room) {
        const res = { success: false, error };
        if (callback) callback(res);
        socket.emit("room_error", { message: error });
        return;
      }

      socket.join(room.roomCode);
      console.log(`[Socket] Player ${payload.user.username} joined room: ${room.roomCode}`);

      const res = { success: true, room };
      if (callback) callback(res);
      io.to(room.roomCode).emit("room_updated", room);
    });

    // Select character (Fireboy or Watergirl)
    socket.on("select_character", (payload: { role: CharacterRole }) => {
      const room = roomStore.selectCharacter(socket.id, payload.role);
      if (room) {
        io.to(room.roomCode).emit("room_updated", room);
      }
    });

    // Toggle player ready state
    socket.on("toggle_ready", () => {
      const room = roomStore.toggleReady(socket.id);
      if (room) {
        io.to(room.roomCode).emit("room_updated", room);
      }
    });

    // Change selected level (Host only)
    socket.on("change_level", (payload: { levelIndex: number }) => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room && room.hostSocketId === socket.id) {
        const updatedRoom = roomStore.setLevel(room.roomCode, payload.levelIndex);
        if (updatedRoom) {
          io.to(updatedRoom.roomCode).emit("room_updated", updatedRoom);
        }
      }
    });

    // Start Game (Host only)
    socket.on("start_game", () => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room && room.hostSocketId === socket.id) {
        room.status = "playing";
        roomStore.resetLevelState(room);
        io.to(room.roomCode).emit("game_started", room);
      }
    });

    // Real-time Player Movement Sync
    socket.on("player_move", (position: PlayerPosition) => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room) {
        roomStore.updatePlayerPosition(socket.id, position);
        const playerRole = room.players[socket.id]?.role;
        socket.to(room.roomCode).emit("peer_moved", {
          socketId: socket.id,
          role: playerRole,
          position,
        });
      }
    });

    // Interact with Level Lever
    socket.on("interact_lever", (payload: { leverId: string; isToggled: boolean }) => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room) {
        roomStore.updateLeverState(room.roomCode, payload.leverId, payload.isToggled);
        io.to(room.roomCode).emit("lever_updated", payload);
      }
    });

    // Interact with Pressure Button
    socket.on("interact_button", (payload: { buttonId: string; isPressed: boolean }) => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room) {
        roomStore.updateButtonState(room.roomCode, payload.buttonId, payload.isPressed);
        socket.to(room.roomCode).emit("button_updated", payload);
      }
    });

    // Move Pushable Crate
    socket.on("move_crate", (payload: { crateId: string; x: number; y: number }) => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room) {
        roomStore.updateCratePosition(room.roomCode, payload.crateId, { x: payload.x, y: payload.y });
        socket.to(room.roomCode).emit("crate_moved", payload);
      }
    });

    // Collect Gem
    socket.on("collect_gem", (payload: { gemId: string }) => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room) {
        roomStore.collectGem(room.roomCode, payload.gemId);
        io.to(room.roomCode).emit("gem_collected", payload);
      }
    });

    // Player Died (Lava / Water / Sludge)
    socket.on("player_died", (payload: { character: CharacterRole; cause: string }) => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room) {
        io.to(room.roomCode).emit("player_died", {
          socketId: socket.id,
          character: payload.character,
          cause: payload.cause,
        });
      }
    });

    // Restart Level
    socket.on("restart_level", () => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room) {
        roomStore.resetLevelState(room);
        io.to(room.roomCode).emit("level_restarted", room.levelState);
      }
    });

    // Level Completed
    socket.on("level_completed", (payload: { levelIndex: number; timeSeconds: number; gemsCollected: number }) => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room) {
        room.status = "completed";
        const player = room.players[socket.id];
        if (player) {
          roomStore.addLeaderboardEntry(player.user.username, payload.levelIndex, payload.timeSeconds, payload.gemsCollected);
        }
        io.to(room.roomCode).emit("level_completed", {
          room,
          stats: payload,
        });
      }
    });

    // Room Chat Message
    socket.on("send_chat", (payload: { text: string }) => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room) {
        const player = room.players[socket.id];
        const chatMsg = {
          id: Math.random().toString(36).substring(2, 9),
          sender: player ? player.user.username : "Player",
          role: player ? player.role : undefined,
          text: payload.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        io.to(room.roomCode).emit("chat_received", chatMsg);
      }
    });

    // Animated Overhead Emote
    socket.on("send_emote", (payload: { emote: string }) => {
      const room = roomStore.getRoomBySocketId(socket.id);
      if (room) {
        const player = room.players[socket.id];
        io.to(room.roomCode).emit("emote_received", {
          socketId: socket.id,
          sender: player ? player.user.username : "Player",
          role: player ? player.role : null,
          emote: payload.emote,
        });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      const { roomCode, room, wasDeleted } = roomStore.leaveRoom(socket.id);
      if (roomCode && !wasDeleted && room) {
        io.to(roomCode).emit("room_updated", room);
        io.to(roomCode).emit("player_left", { socketId: socket.id });
      }
    });
  });

  return io;
}