import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoomLobby from "../components/gameComponents/RoomLobby.tsx";
import { GameStateContext } from "../context/GameStateContext.tsx";
import { ArrowLeft } from "lucide-react";

export default function LobbyPage() {
  const navigate = useNavigate();
  const { roomState, leaveRoom } = useContext(GameStateContext);

  useEffect(() => {
    if (roomState?.status === "playing") {
      navigate("/play");
    }
  }, [roomState?.status, navigate]);

  const handleLeave = () => {
    leaveRoom();
    navigate("/home");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex items-center justify-between mb-6">
        <button
          onClick={handleLeave}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" /> Leave Room
        </button>
      </header>

      {roomState ? (
        <RoomLobby />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-md w-full">
          <p className="text-slate-400 mb-4">No active room found.</p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            Back to Main Menu
          </button>
        </div>
      )}
    </main>
  );
}