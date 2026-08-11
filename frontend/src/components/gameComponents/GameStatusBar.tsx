import { useContext } from "react";
import { GameStateContext } from "../../context/GameStateContext.tsx";
import { soundService } from "../../services/soundService.ts";
import { Volume2, VolumeX, Copy, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function GameStatusBar() {
  const {
    gameMode,
    roomState,
    myRole,
    currentLevelData,
    soundMuted,
    setSoundMuted,
    leaveRoom,
  } = useContext(GameStateContext);

  const [copied, setCopied] = useState(false);

  const toggleSound = () => {
    const isMuted = soundService.toggleMute();
    setSoundMuted(isMuted);
  };

  const copyRoomCode = () => {
    if (!roomState?.roomCode) return;
    navigator.clipboard.writeText(roomState.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full max-w-[1000px] mx-auto mb-3 flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 shadow-md">
      {/* Left: Back / Leave button + Level Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => leaveRoom()}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
          title="Back to Lobby"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            {currentLevelData.name}
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/60 font-mono">
              {currentLevelData.difficulty}
            </span>
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            {gameMode === "online" ? "Online Co-op" : "Local 2-Player Co-op"}
          </p>
        </div>
      </div>

      {/* Center: Character Role Indicator */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/60 border border-slate-800 rounded-lg">
        <span className="text-xs text-slate-400 font-semibold">Playing As:</span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${
            myRole === "fireboy"
              ? "bg-red-950 text-red-400 border border-red-800"
              : "bg-cyan-950 text-cyan-400 border border-cyan-800"
          }`}
        >
          {myRole === "fireboy" ? "🔥 FIREBOY" : "💧 WATERGIRL"}
        </span>
      </div>

      {/* Right: Room Code & Sound Toggle */}
      <div className="flex items-center gap-3">
        {gameMode === "online" && roomState?.roomCode && (
          <button
            onClick={copyRoomCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-mono text-amber-300 font-bold transition"
            title="Click to copy Room Code"
          >
            <span>ROOM: {roomState.roomCode}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        )}

        <button
          onClick={toggleSound}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
          title={soundMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>
    </header>
  );
}