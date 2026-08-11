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
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  progress: Progress | null;
  setProgress: Dispatch<SetStateAction<Progress | null>>;
  getUserByEmail: (email: string) => Promise<User>;
  loginAsGuest: (nickname: string) => Promise<User>;
}

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(localStorage.getItem("jwt")));
  const [progress, setProgress] = useState<Progress | null>(Progress.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user_profile");
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      _id: `user_${Math.random().toString(36).substring(2, 7)}`,
      username: "FireExplorer",
      email: "player@example.com",
      profilePicture: "🔥",
      totalGames: 0,
      totalWins: 0,
      highScore: 0,
    };
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user_profile", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const getJwt = () => localStorage.getItem("jwt");

  const setJwt = (jwt: string) => {
    localStorage.setItem("jwt", jwt);
    setIsAuthenticated(true);
  };

  const clearJwt = () => {
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
  };

  const getJwtEmail = () => {
    const jwt = getJwt();
    if (!jwt) return currentUser?.email ?? null;
    try {
      const payload = JSON.parse(atob(jwt.split(".")[1] ?? "")) as { email?: string };
      return payload.email ?? currentUser?.email ?? null;
    } catch {
      return currentUser?.email ?? null;
    }
  };

  const isJwtValid = async () => true;

  const getUserByEmail = async (email: string): Promise<User> => {
    if (currentUser && currentUser.email === email) return currentUser;
    return {
      _id: `user_${Date.now()}`,
      username: email.split("@")[0] || "Explorer",
      email,
      profilePicture: "🔥",
    };
  };

  const loginAsGuest = async (nickname: string): Promise<User> => {
    const cleanName = nickname.trim() || "FireBoyGuest";
    const newUser: User = {
      _id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      username: cleanName,
      email: `${cleanName.toLowerCase().replace(/\s+/g, "")}@player.io`,
      profilePicture: "🔥",
      totalGames: 0,
      totalWins: 0,
      highScore: 0,
    };

    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ email: newUser.email, username: newUser.username, sub: newUser._id }));
    const mockJwt = `${header}.${payload}.sig`;

    setJwt(mockJwt);
    setCurrentUser(newUser);
    return newUser;
  };

  const value = useMemo(
    () => ({
      getJwt,
      setJwt,
      clearJwt,
      isAuthenticated,
      setIsAuthenticated,
      isJwtValid,
      getJwtEmail,
      currentUser,
      setCurrentUser,
      progress,
      setProgress,
      getUserByEmail,
      loginAsGuest,
    }),
    [isAuthenticated, progress, currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};