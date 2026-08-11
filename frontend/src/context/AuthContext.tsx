import { createContext } from "react";
import type { AuthContextType } from "./AuthContextProvider.tsx";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);