export type CharacterRole = "fireboy" | "watergirl";

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  totalGames?: number;
  totalWins?: number;
  totalPoints?: number;
  highScore?: number;
}

export interface Phrase {
  _id: string;
  phrase: string;
}

export interface PlayerPosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: "left" | "right";
  animation: "idle" | "run" | "jump" | "fall" | "dead" | "win";
  isGrounded: boolean;
}

export interface RoomPlayer {
  socketId: string;
  user: User;
  role: CharacterRole | null;
  isReady: boolean;
  isHost: boolean;
  position?: PlayerPosition;
}

export interface LevelState {
  levelIndex: number;
  leversState: Record<string, boolean>; // leverId -> isToggled
  buttonsState: Record<string, boolean>; // buttonId -> isPressed
  cratesPosition: Record<string, { x: number; y: number }>; // crateId -> {x, y}
  gemsCollected: Record<string, boolean>; // gemId -> isCollected
  isCompleted: boolean;
  startTime: number;
  elapsedTime: number;
}

export interface RoomState {
  roomCode: string;
  hostSocketId: string;
  players: Record<string, RoomPlayer>; // socketId -> RoomPlayer
  levelIndex: number;
  status: "lobby" | "playing" | "completed";
  levelState: LevelState;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  role?: CharacterRole;
}

export interface EmotePayload {
  socketId: string;
  sender: string;
  role: CharacterRole | null;
  emote: string;
}