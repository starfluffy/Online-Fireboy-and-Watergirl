export const Progress = {
  LOGIN: 0,
  HOME: 1,
  LOBBY: 2,
  GAME: 3,
} as const;

export type Progress = (typeof Progress)[keyof typeof Progress];

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
  leversState: Record<string, boolean>;
  buttonsState: Record<string, boolean>;
  cratesPosition: Record<string, { x: number; y: number }>;
  gemsCollected: Record<string, boolean>;
  isCompleted: boolean;
  startTime: number;
  elapsedTime: number;
}

export interface RoomState {
  roomCode: string;
  hostSocketId: string;
  players: Record<string, RoomPlayer>;
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

// Level Tilemap Data Types
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Pool {
  id: string;
  type: "lava" | "water" | "sludge";
  rect: Rect;
}

export interface Gem {
  id: string;
  type: "fire" | "water" | "diamond";
  x: number;
  y: number;
}

export interface Lever {
  id: string;
  x: number;
  y: number;
  targetId: string;
}

export interface Button {
  id: string;
  x: number;
  y: number;
  targetId: string;
}

export interface MovingPlatform {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  speed: number;
  activeStateNeeded?: boolean;
}

export interface Door {
  id: string;
  type: "fire" | "water";
  x: number;
  y: number;
}

export interface Crate {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LevelData {
  id: number;
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  width: number;
  height: number;
  platforms: Rect[];
  pools: Pool[];
  gems: Gem[];
  levers: Lever[];
  buttons: Button[];
  movingPlatforms: MovingPlatform[];
  crates: Crate[];
  fireboySpawn: { x: number; y: number };
  watergirlSpawn: { x: number; y: number };
  fireboyDoor: Door;
  watergirlDoor: Door;
}