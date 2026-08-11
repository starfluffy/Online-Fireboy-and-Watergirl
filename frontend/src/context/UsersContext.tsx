import { createContext } from "react";
import type { UsersContextType } from "./UsersContextProvider.tsx";

export const UsersContext = createContext<UsersContextType>({} as UsersContextType);