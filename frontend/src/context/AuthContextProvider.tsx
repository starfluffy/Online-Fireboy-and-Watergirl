import { useEffect, useMemo, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { AuthContext } from "./AuthContext.tsx";
import { Progress, type User } from "../types/types.ts";

export interface AuthContextType {
  getJwt: () => string | null;
  setJwt: (jwt: string) => void;
  clearJwt: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isJwtValid: () => Promise<boolean>;
  getJwtEmail: () => string | null;
  progress: Progress | null;
  setProgress: Dispatch<SetStateAction<Progress | null>>;
  getUserByEmail: (email: string) => Promise<User>;
}

const demoUser: User = {
  _id: "demo-user",
  username: "Player One",
  email: "player@example.com",
  profilePicture: "profile-pictures/bear.png",
  totalGames: 0,
  totalPoints: 0,
  highScore: 0,
  totalWins: 0,
};

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("jwt")));
  }, []);

  const getJwt = () => localStorage.getItem("jwt");

  const setJwt = (jwt: string) => {
    localStorage.setItem("jwt", jwt);
  };

  const clearJwt = () => {
    localStorage.removeItem("jwt");
  };

  const getJwtEmail = () => {
    const jwt = getJwt();
    if (!jwt) return null;

    try {
      const payload = JSON.parse(atob(jwt.split(".")[1] ?? "")) as { email?: string };
      return payload.email ?? null;
    } catch {
      return null;
    }
  };

  const isJwtValid = async () => Boolean(getJwt());

  const getUserByEmail = async (_email: string) => demoUser;

  const value = useMemo(
    () => ({
      getJwt,
      setJwt,
      clearJwt,
      isAuthenticated,
      setIsAuthenticated,
      isJwtValid,
      getJwtEmail,
      progress,
      setProgress,
      getUserByEmail,
    }),
    [isAuthenticated, progress],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};