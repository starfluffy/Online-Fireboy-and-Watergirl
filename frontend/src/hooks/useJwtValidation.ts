import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext.tsx";

export function useJwtValidation() {
  const { getJwt } = useContext(AuthContext);

  return useMemo(
    () => ({
      validJwt: Boolean(getJwt()),
      isLoading: false,
    }),
    [getJwt],
  );
}