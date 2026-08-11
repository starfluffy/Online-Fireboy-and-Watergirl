import { createContext } from "react";
import type { GameStateContextType } from "./GameStateContextProvider.tsx";

export const GameStateContext = createContext<GameStateContextType>({} as GameStateContextType);