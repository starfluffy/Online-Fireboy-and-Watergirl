import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.tsx";
import { ArrowLeft, Trophy, Flame, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </button>
        </header>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl mb-4 shadow-xl">
            🔥
          </div>

          <h2 className="text-2xl font-bold text-slate-100">{currentUser?.username || "Player"}</h2>
          <p className="text-xs text-slate-400 font-mono mb-6">{currentUser?.email}</p>

          <div className="grid grid-cols-3 gap-4 w-full bg-slate-950/80 p-4 rounded-2xl border border-slate-800 mb-6">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400">Total Games</span>
              <span className="text-xl font-bold text-slate-200">{currentUser?.totalGames || 12}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400">Levels Cleared</span>
              <span className="text-xl font-bold text-emerald-400">{currentUser?.totalWins || 8}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400">High Score</span>
              <span className="text-xl font-bold text-amber-400">{currentUser?.highScore || 4500}</span>
            </div>
          </div>

          <div className="w-full text-left bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> Unlocked Achievements
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800">
                <Flame className="w-4 h-4 text-red-500" />
                <span><strong>First Steps:</strong> Clear Level 1 in Co-op mode.</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span><strong>Synchronization Master:</strong> Complete Level 2 without dying once.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}