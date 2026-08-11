import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Clock, Gem } from "lucide-react";

interface LeaderboardEntry {
  username: string;
  levelIndex: number;
  timeSeconds: number;
  gems: number;
  date: string;
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([
    { username: "FireHero", levelIndex: 0, timeSeconds: 24, gems: 6, date: "2026-08-10" },
    { username: "AquaQueen", levelIndex: 0, timeSeconds: 28, gems: 6, date: "2026-08-11" },
    { username: "LavaBoi", levelIndex: 1, timeSeconds: 42, gems: 8, date: "2026-08-11" },
  ]);

  useEffect(() => {
    fetch("/api/users/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setEntries(data);
      })
      .catch(() => { /* fallback to default */ });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </button>
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Trophy className="w-5 h-5" /> Hall of Fame
          </div>
        </header>

        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Top Temple Speedruns</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Player</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Gems</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {entries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-amber-400">
                      {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                    </td>
                    <td className="p-3 font-bold text-slate-100">{entry.username}</td>
                    <td className="p-3 font-mono text-slate-400">Level {entry.levelIndex + 1}</td>
                    <td className="p-3 text-emerald-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {entry.timeSeconds}s
                    </td>
                    <td className="p-3 text-amber-400 font-semibold flex items-center gap-1">
                      <Gem className="w-3 h-3" /> {entry.gems}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}