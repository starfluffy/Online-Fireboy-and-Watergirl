import { useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext.tsx";
import { UsersContext } from "./UsersContext.tsx";
import type { User } from "../types/types.ts";

export interface UsersContextType {
  usersList: User[];
  usersLoading: boolean;
  user: User | null;
  refreshUsers: () => Promise<void>;
  getUsers: () => Promise<User[]>;
  addUser: (username: string, profilePicture: string, email: string) => Promise<User>;
  getUserById: (id: string) => Promise<User>;
  getUserByEmail: (email: string) => Promise<User>;
  updateGamePlayer: (user: User) => Promise<User>;
  updateCurrentUser: (user: User) => Promise<User>;
  clearCurrentUser: () => void;
}

const seedUsers: User[] = [
  {
    _id: "demo-user",
    username: "Player One",
    email: "player@example.com",
    profilePicture: "profile-pictures/bear.png",
    totalGames: 0,
    totalPoints: 0,
    highScore: 0,
    totalWins: 0,
  },
];

export const UsersContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [usersList, setUsersList] = useState<User[]>(seedUsers);
  const [user, setUser] = useState<User | null>(seedUsers[0]);
  const [usersLoading, setUsersLoading] = useState(false);
  const { getJwtEmail } = useContext(AuthContext);

  const refreshUsers = async () => {
    setUsersLoading(true);
    const currentEmail = getJwtEmail();
    if (currentEmail) {
      setUser(usersList.find((entry) => entry.email === currentEmail) ?? user);
    }
    setUsersLoading(false);
  };

  const getUsers = async () => usersList;

  const addUser = async (username: string, profilePicture: string, email: string) => {
    const nextUser: User = {
      _id: crypto.randomUUID(),
      username,
      profilePicture,
      email,
      totalGames: 0,
      totalPoints: 0,
      highScore: 0,
      totalWins: 0,
    };

    setUsersList((current) => [...current, nextUser]);
    return nextUser;
  };

  const getUserById = async (id: string) => {
    const foundUser = usersList.find((entry) => entry._id === id);
    if (!foundUser) {
      throw new Error(`User not found: ${id}`);
    }
    return foundUser;
  };

  const getUserByEmail = async (email: string) => {
    const foundUser = usersList.find((entry) => entry.email === email);
    if (!foundUser) {
      throw new Error(`User not found: ${email}`);
    }
    return foundUser;
  };

  const updateGamePlayer = async (nextUser: User) => {
    setUsersList((current) => current.map((entry) => (entry._id === nextUser._id ? nextUser : entry)));
    setUser(nextUser);
    return nextUser;
  };

  const updateCurrentUser = async (nextUser: User) => {
    setUser(nextUser);
    return nextUser;
  };

  const clearCurrentUser = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      usersList,
      usersLoading,
      user,
      refreshUsers,
      getUsers,
      addUser,
      getUserById,
      getUserByEmail,
      updateGamePlayer,
      updateCurrentUser,
      clearCurrentUser,
    }),
    [usersList, usersLoading, user],
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
};