import { useContext } from "react";
import { UsersContext } from "../context/UsersContext.tsx";

export default function useCurrentUser() {
  const { user } = useContext(UsersContext);
  return user;
}