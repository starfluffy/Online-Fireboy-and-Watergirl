import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LobbyPage from "./pages/LobbyPage.tsx";
import GamePage from "./pages/GamePage.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import PodiumPage from "./pages/PodiumPage.tsx";
import LoadingSpinner from "./components/layoutComponents/LoadingSpinner.tsx";
import ProtectedRoute from "./services/ProtectedRoute.tsx";
import { Progress } from "./types/types.ts";
import { useJwtValidation } from "./hooks/useJwtValidation.ts";

function App() {
  const { validJwt, isLoading } = useJwtValidation();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={validJwt ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lobby"
        element={
          <ProtectedRoute requiredStep={Progress.HOME}>
            <LobbyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/play"
        element={
          <ProtectedRoute requiredStep={Progress.LOBBY}>
            <GamePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/podium"
        element={
          <ProtectedRoute requiredStep={Progress.GAME}>
            <PodiumPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
