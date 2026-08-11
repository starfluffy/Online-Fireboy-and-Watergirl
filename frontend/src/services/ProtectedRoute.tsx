import { Navigate } from "react-router-dom";
import { useContext, type ReactNode } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import { Progress } from "../types/types.ts";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredStep?: Progress;
};

export default function ProtectedRoute({ children, requiredStep }: ProtectedRouteProps) {
  const { isAuthenticated, progress } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (typeof requiredStep === "number" && typeof progress === "number" && progress < requiredStep) {
    return <Navigate to="/home" replace />;
  }

  return children;
}