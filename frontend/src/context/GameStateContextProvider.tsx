import { useMemo, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { GameStateContext } from "./GameStateContext.tsx";
import type { GameState, PlayerState, User } from "../types/types.ts";

export interface GameStateContextType {
  lobbyPlayers: User[];
  currentDrawer: User | null;
  isSelectingWord: boolean;
  round: number;
  wordToGuess: string;
  playerStates: PlayerState[];
  timeRemaining: number;
  isTurnFinished: boolean;
  phrases: string[];
  setLobbyPlayers: Dispatch<SetStateAction<User[]>>;
  setCurrentDrawer: Dispatch<SetStateAction<User | null>>;
  setIsSelectingWord: Dispatch<SetStateAction<boolean>>;
  setRound: Dispatch<SetStateAction<number>>;
  setWordToGuess: Dispatch<SetStateAction<string>>;
  setPlayerStates: Dispatch<SetStateAction<PlayerState[]>>;
  setTimeRemaining: Dispatch<SetStateAction<number>>;
  clearCanvas: () => void;
  setIsTurnFinished: Dispatch<SetStateAction<boolean>>;
  setPhrases: Dispatch<SetStateAction<string[]>>;
}

const demoPlayers: User[] = [
  {
    _id: "demo-user",
    username: "Player One",
    email: "player@example.com",
    profilePicture: "profile-pictures/bear.png",
  },
];

const defaultState: GameState = {
  round: 1,
  wordToGuess: "",
  drawer: demoPlayers[0],
  playerStates: [
    {
      user: demoPlayers[0],
      points: 0,
      scoreMultiplier: false,
      hasLeftGame: false,
      hasGuessedWord: false,
    },
  ],
  timeRemaining: 90,
  splashExpiries: {},
};

export const GameStateContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lobbyPlayers, setLobbyPlayers] = useState<User[]>(demoPlayers);
  const [currentDrawer, setCurrentDrawer] = useState<User | null>(defaultState.drawer);
  const [isSelectingWord, setIsSelectingWord] = useState(true);
  const [round, setRound] = useState(defaultState.round);
  const [wordToGuess, setWordToGuess] = useState(defaultState.wordToGuess);
  const [playerStates, setPlayerStates] = useState<PlayerState[]>(defaultState.playerStates);
  const [timeRemaining, setTimeRemaining] = useState(defaultState.timeRemaining);
  const [isTurnFinished, setIsTurnFinished] = useState(false);
  const [phrases, setPhrases] = useState<string[]>([
    "A simple scaffold",
    "A clean starting point",
    "A routed React shell",
  ]);

  const clearCanvas = () => undefined;

  const value = useMemo(
    () => ({
      lobbyPlayers,
      currentDrawer,
      isSelectingWord,
      round,
      wordToGuess,
      playerStates,
      timeRemaining,
      isTurnFinished,
      phrases,
      setLobbyPlayers,
      setCurrentDrawer,
      setIsSelectingWord,
      setRound,
      setWordToGuess,
      setPlayerStates,
      setTimeRemaining,
      clearCanvas,
      setIsTurnFinished,
      setPhrases,
    }),
    [
      lobbyPlayers,
      currentDrawer,
      isSelectingWord,
      round,
      wordToGuess,
      playerStates,
      timeRemaining,
      isTurnFinished,
      phrases,
    ],
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};