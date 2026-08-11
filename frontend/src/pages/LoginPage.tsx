import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.tsx";
import { Flame, Droplets, Sparkles, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginAsGuest } = useContext(AuthContext);
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    setIsLoading(true);
    await loginAsGuest(nickname.trim());
    setIsLoading(false);
    navigate("/home");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elemental Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      <section className="relative z-10 w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center">
        {/* Elemental Emblem Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-950/50">
            <Flame className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-black tracking-widest text-slate-400">&</span>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <Droplets className="w-7 h-7 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight mb-1 text-slate-100">
          FIREBOY & WATERGIRL
        </h1>
        <p className="text-xs font-semibold tracking-wider uppercase text-amber-400 mb-6 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> Online Co-op Temple
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Choose Player Nickname
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                maxLength={16}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. FireHero / AquaQueen"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !nickname.trim()}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <span>Enter Temple Lobby</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-400">
          No sign up or password required. Play with friends instantly!
        </p>
      </section>
    </main>
  );
}