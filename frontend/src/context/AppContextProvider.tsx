import type { ReactNode } from "react";
import { AuthContextProvider } from "./AuthContextProvider.tsx";
import { GameStateContextProvider } from "./GameStateContextProvider.tsx";
import { UsersContextProvider } from "./UsersContextProvider.tsx";

export function AppContextProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContextProvider>
      <GameStateContextProvider>
        <UsersContextProvider>{children}</UsersContextProvider>
      </GameStateContextProvider>
    </AuthContextProvider>
  );
}