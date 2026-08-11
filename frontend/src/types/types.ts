export const Progress = {
  LOGIN: 0,
  HOME: 1,
  LOBBY: 2,
  GAME: 3,
} as const;

export type Progress = (typeof Progress)[keyof typeof Progress];

export interface PlayerState {
  user: User;
  points: number;
  scoreMultiplier: boolean;
  hasLeftGame: boolean;
  hasGuessedWord: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  totalGames?: number;
  totalPoints?: number;
  highScore?: number;
  totalWins?: number;
}

export interface GameState {
  round: number;
  wordToGuess: string;
  drawer: User | null;
  playerStates: PlayerState[];
  timeRemaining: number;
  splashExpiries: Record<string, number>;
}