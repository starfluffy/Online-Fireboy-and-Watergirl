import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.tsx";
import { GameStateContext } from "../context/GameStateContext.tsx";
import {
  Flame,
  Droplets,
  PlusCircle,
  LogIn,
  Gamepad2,
  Trophy,
  User,
  LogOut,
  HelpCircle,
  Sparkles,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser, clearJwt } = useContext(AuthContext);
  const { createRoom, joinRoom, setGameMode, setCurrentLevelIndex, socketConnected } = useContext(GameStateContext);

  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);

  const handleCreateOnlineRoom = async () => {
    if (isCreating) return;
    setIsCreating(true);
    setGameMode("online");
    try {
      const roomCode = await createRoom("fireboy");
      if (roomCode) {
        navigate("/lobby");
      } else {
        navigate("/lobby");
      }
    } catch {
      navigate("/lobby");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinOnlineRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim() || isJoining) return;

    setIsJoining(true);
    setJoinError(null);
    setGameMode("online");

    const res = await joinRoom(joinCodeInput.trim());
    setIsJoining(false);

    if (res.success) {
      navigate("/lobby");
    } else {
      setJoinError(res.error || "Could not join room.");
    }
  };

  const handleStartLocalCoop = () => {
    setGameMode("local");
    setCurrentLevelIndex(0);
    navigate("/play");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-8">
        {/* Header Bar */}
        <header className="w-full flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl px-6 py-4 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md">
              🔥💧
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-100">
                FIREBOY & WATERGIRL
              </h1>
              <div className="flex items-center gap-3 text-xs">
                <p className="text-amber-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Online Multiplayer
                </p>
                <span className="text-slate-600">•</span>
                <span className={`font-mono flex items-center gap-1 ${socketConnected ? "text-emerald-400" : "text-rose-400 font-bold"}`}>
                  {socketConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {socketConnected ? "Server Online" : "Server Disconnected"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{currentUser?.username || "Player"}</span>
            </button>

            <button
              onClick={() => {
                clearJwt();
                navigate("/login");
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Online Room */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-col justify-between transition transform hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 mb-2">Create Online Room</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Host a private multiplayer room and get a 4-letter Room Code to share with your friend in another city!
              </p>
            </div>

            <button
              onClick={handleCreateOnlineRoom}
              disabled={isCreating}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <span>{isCreating ? "Creating Room..." : "Create New Room"}</span>
            </button>
          </div>

          {/* Join Online Room */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 shadow-2xl flex flex-col justify-between transition transform hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <LogIn className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 mb-2">Join Friend's Room</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Enter the 4-letter Room Code given to you by your friend to join their game room instantly.
              </p>

              <form onSubmit={handleJoinOnlineRoom} className="space-y-3">
                <input
                  type="text"
                  maxLength={4}
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="Enter Code (e.g. A3F8)"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-center text-lg font-black font-mono tracking-widest text-amber-400 uppercase placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
                />

                {joinError && (
                  <p className="text-xs text-rose-400 text-center font-semibold">{joinError}</p>
                )}

                <button
                  type="submit"
                  disabled={isJoining || !joinCodeInput.trim()}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
                >
                  {isJoining ? "Joining..." : "Join Game Room"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Secondary Row: Local Co-op & Leaderboard & Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Local 2-Player Co-op */}
          <button
            onClick={handleStartLocalCoop}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl text-left flex items-center gap-4 transition hover:bg-slate-800/80 cursor-pointer"
          >
            <div className="p-3 bg-slate-800 rounded-xl text-purple-400 border border-purple-800/40">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Same Keyboard Co-op</h3>
              <p className="text-xs text-slate-400">Play WASD & Arrows on 1 PC</p>
            </div>
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => navigate("/leaderboard")}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl text-left flex items-center gap-4 transition hover:bg-slate-800/80 cursor-pointer"
          >
            <div className="p-3 bg-slate-800 rounded-xl text-amber-400 border border-amber-800/40">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Hall of Fame</h3>
              <p className="text-xs text-slate-400">View Top Speedruns & Gems</p>
            </div>
          </button>

          {/* Rules & Controls */}
          <button
            onClick={() => setShowRules(true)}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl text-left flex items-center gap-4 transition hover:bg-slate-800/80 cursor-pointer"
          >
            <div className="p-3 bg-slate-800 rounded-xl text-emerald-400 border border-emerald-800/40">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Controls & Rules</h3>
              <p className="text-xs text-slate-400">Lava, Water, Levers & Doors</p>
            </div>
          </button>
        </div>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-200">
            <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> How to Play
            </h3>
            <ul className="space-y-3 text-xs leading-relaxed text-slate-300 mb-6">
              <li className="flex items-start gap-2">
                <Flame className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Fireboy:</strong> Move with <strong>W/A/D</strong>. Safe in Red Lava. Extinguished by Blue Water!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Droplets className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Watergirl:</strong> Move with <strong>Arrow Keys</strong>. Safe in Blue Water. Dissolved by Red Lava!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">☣</span>
                <span>
                  <strong>Toxic Sludge:</strong> Green sludge kills <em>both</em> Fireboy and Watergirl!
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">🚪</span>
                <span>
                  <strong>Door Exits:</strong> Level is won when Fireboy stands in the Red Door AND Watergirl stands in the Blue Door!
                </span>
              </li>
            </ul>

            <button
              onClick={() => setShowRules(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}