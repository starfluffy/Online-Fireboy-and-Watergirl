import type { User } from "../types/types.js";

const maxRounds = 3;
const turnTime = 90;

export interface PlayerState {
  user: User;
  points: number;
  scoreMultiplier: boolean;
  hasLeftGame: boolean;
  hasGuessedWord: boolean;
}

export interface GameState {
  round: number;
  wordToGuess: string;
  drawer: User | null;
  playerStates: PlayerState[];
  timeRemaining: number;
  splashExpiries: Record<string, number>;
}

export const getMaxRounds = () => maxRounds;

export const getInitialGameState = (players: User[]): GameState => ({
  round: 1,
  wordToGuess: "",
  drawer: players[0] ?? null,
  playerStates: players.map((player) => ({
    user: player,
    points: 0,
    scoreMultiplier: false,
    hasLeftGame: false,
    hasGuessedWord: false,
  })),
  timeRemaining: turnTime,
  splashExpiries: {},
});