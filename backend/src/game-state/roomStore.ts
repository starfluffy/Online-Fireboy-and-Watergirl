import type {
  RoomState,
  RoomPlayer,
  User,
  CharacterRole,
  PlayerPosition,
  LevelState,
} from "../types/types.js";

class RoomStore {
  private rooms: Map<string, RoomState> = new Map();
  private leaderboard: Array<{
    username: string;
    levelIndex: number;
    timeSeconds: number;
    gems: number;
    date: string;
  }> = [
    { username: "FireHero", levelIndex: 0, timeSeconds: 24, gems: 6, date: "2026-08-10" },
    { username: "AquaQueen", levelIndex: 0, timeSeconds: 28, gems: 6, date: "2026-08-11" },
    { username: "LavaBoi", levelIndex: 1, timeSeconds: 42, gems: 8, date: "2026-08-11" },
  ];

  generateRoomCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    do {
      code = "";
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));
    return code;
  }

  createRoom(hostSocketId: string, user: User, preferredRole?: CharacterRole): RoomState {
    const roomCode = this.generateRoomCode();
    const role = preferredRole || "fireboy";

    const initialLevelState: LevelState = {
      levelIndex: 0,
      leversState: {},
      buttonsState: {},
      cratesPosition: {},
      gemsCollected: {},
      isCompleted: false,
      startTime: Date.now(),
      elapsedTime: 0,
    };

    const hostPlayer: RoomPlayer = {
      socketId: hostSocketId,
      user,
      role,
      isReady: true,
      isHost: true,
    };

    const room: RoomState = {
      roomCode,
      hostSocketId,
      players: { [hostSocketId]: hostPlayer },
      levelIndex: 0,
      status: "lobby",
      levelState: initialLevelState,
    };

    this.rooms.set(roomCode, room);
    return room;
  }

  joinRoom(roomCode: string, socketId: string, user: User): { room?: RoomState; error?: string } {
    const upperCode = roomCode.toUpperCase().trim();
    const room = this.rooms.get(upperCode);

    if (!room) {
      return { error: "Room not found. Check your 4-letter room code!" };
    }

    const currentSockets = Object.keys(room.players);
    if (currentSockets.length >= 2 && !room.players[socketId]) {
      return { error: "Room is full! Fireboy & Watergirl is a 2-player game." };
    }

    // Determine available role
    let role: CharacterRole | null = null;
    const takenRoles = Object.values(room.players).map((p) => p.role);
    if (!takenRoles.includes("fireboy")) {
      role = "fireboy";
    } else if (!takenRoles.includes("watergirl")) {
      role = "watergirl";
    }

    const player: RoomPlayer = {
      socketId,
      user,
      role,
      isReady: false,
      isHost: room.hostSocketId === socketId,
    };

    room.players[socketId] = player;
    return { room };
  }

  leaveRoom(socketId: string): { roomCode?: string; room?: RoomState; wasDeleted?: boolean } {
    for (const [code, room] of this.rooms.entries()) {
      if (room.players[socketId]) {
        delete room.players[socketId];
        const remainingSockets = Object.keys(room.players);

        if (remainingSockets.length === 0) {
          this.rooms.delete(code);
          return { roomCode: code, wasDeleted: true };
        }

        // Reassign host if host left
        if (room.hostSocketId === socketId) {
          const newHostSocket = remainingSockets[0];
          room.hostSocketId = newHostSocket;
          if (room.players[newHostSocket]) {
            room.players[newHostSocket].isHost = true;
          }
        }

        return { roomCode: code, room };
      }
    }
    return {};
  }

  getRoom(roomCode: string): RoomState | undefined {
    return this.rooms.get(roomCode.toUpperCase().trim());
  }

  getRoomBySocketId(socketId: string): RoomState | undefined {
    for (const room of this.rooms.values()) {
      if (room.players[socketId]) return room;
    }
    return undefined;
  }

  selectCharacter(socketId: string, role: CharacterRole): RoomState | null {
    const room = this.getRoomBySocketId(socketId);
    if (!room) return null;

    // Switch role if not taken by another player
    for (const pSocketId of Object.keys(room.players)) {
      if (pSocketId !== socketId && room.players[pSocketId].role === role) {
        // Swap roles between the two players
        room.players[pSocketId].role = room.players[socketId].role;
      }
    }
    room.players[socketId].role = role;
    return room;
  }

  toggleReady(socketId: string): RoomState | null {
    const room = this.getRoomBySocketId(socketId);
    if (!room) return null;
    if (room.players[socketId]) {
      room.players[socketId].isReady = !room.players[socketId].isReady;
    }
    return room;
  }

  setLevel(roomCode: string, levelIndex: number): RoomState | null {
    const room = this.getRoom(roomCode);
    if (!room) return null;
    room.levelIndex = levelIndex;
    this.resetLevelState(room);
    return room;
  }

  resetLevelState(room: RoomState): void {
    room.levelState = {
      levelIndex: room.levelIndex,
      leversState: {},
      buttonsState: {},
      cratesPosition: {},
      gemsCollected: {},
      isCompleted: false,
      startTime: Date.now(),
      elapsedTime: 0,
    };
  }

  updatePlayerPosition(socketId: string, position: PlayerPosition): RoomState | null {
    const room = this.getRoomBySocketId(socketId);
    if (!room || !room.players[socketId]) return null;
    room.players[socketId].position = position;
    return room;
  }

  updateLeverState(roomCode: string, leverId: string, isToggled: boolean): RoomState | null {
    const room = this.getRoom(roomCode);
    if (!room) return null;
    room.levelState.leversState[leverId] = isToggled;
    return room;
  }

  updateButtonState(roomCode: string, buttonId: string, isPressed: boolean): RoomState | null {
    const room = this.getRoom(roomCode);
    if (!room) return null;
    room.levelState.buttonsState[buttonId] = isPressed;
    return room;
  }

  updateCratePosition(roomCode: string, crateId: string, pos: { x: number; y: number }): RoomState | null {
    const room = this.getRoom(roomCode);
    if (!room) return null;
    room.levelState.cratesPosition[crateId] = pos;
    return room;
  }

  collectGem(roomCode: string, gemId: string): RoomState | null {
    const room = this.getRoom(roomCode);
    if (!room) return null;
    room.levelState.gemsCollected[gemId] = true;
    return room;
  }

  addLeaderboardEntry(username: string, levelIndex: number, timeSeconds: number, gems: number) {
    this.leaderboard.push({
      username,
      levelIndex,
      timeSeconds,
      gems,
      date: new Date().toISOString().split("T")[0],
    });
    this.leaderboard.sort((a, b) => a.timeSeconds - b.timeSeconds);
    if (this.leaderboard.length > 50) {
      this.leaderboard = this.leaderboard.slice(0, 50);
    }
  }

  getLeaderboard() {
    return this.leaderboard;
  }
}

export const roomStore = new RoomStore();
