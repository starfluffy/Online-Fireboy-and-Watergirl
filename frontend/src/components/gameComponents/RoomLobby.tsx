import React, { useContext, useState } from "react";
import { GameStateContext } from "../../context/GameStateContext.tsx";
import { LEVELS } from "../../services/levelData.ts";
import { socket } from "../../services/socket.ts";
import { Copy, Check, Play, Send, Sparkles } from "lucide-react";

export default function RoomLobby() {
  const {
    roomState,
    myRole,
    selectRole,
    toggleReady,
    startGame,
    currentLevelIndex,
    setCurrentLevelIndex,
    chatMessages,
    sendChatMessage,
  } = useContext(GameStateContext);

  const [chatInput, setChatInput] = useState("");
  const [copied, setCopied] = useState(false);

  if (!roomState) return null;

  const sId = socket.id || "";
  const isHost = roomState.hostSocketId === sId;
  const playersList = Object.values(roomState.players);
  const fireboyPlayer = playersList.find((p) => p.role === "fireboy");
  const watergirlPlayer = playersList.find((p) => p.role === "watergirl");
  const myPlayerState = roomState.players[sId];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomState.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in p-4">
      {/* Top Banner: Room Code & Instructions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">Co-op Game Room</h2>
          </div>
          <p className="text-sm text-slate-400">
            Share this room code with your friend so they can join from another city!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium uppercase">Room Code</span>
            <span className="text-2xl font-black font-mono tracking-wider text-amber-400">
              {roomState.roomCode}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Character Pick Cards & Chat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fireboy & Watergirl Player Selection Cards (Span 2) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fireboy Card */}
            <div
              className={`relative bg-gradient-to-b from-red-950/60 to-slate-900 border-2 rounded-2xl p-6 flex flex-col items-center justify-between text-center min-h-[220px] transition ${
                myRole === "fireboy" ? "border-red-500 shadow-red-950/50 shadow-xl" : "border-red-900/40"
              }`}
            >
              <div className="text-4xl mb-2">🔥</div>
              <h3 className="text-xl font-bold text-red-400">FIREBOY</h3>
              <p className="text-xs text-slate-400 mb-4">
                Immune to Lava • Fragile to Water
              </p>

              {fireboyPlayer ? (
                <div className="w-full bg-slate-950/80 p-3 rounded-xl border border-red-900/40 flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold text-slate-200">
                    {fireboyPlayer.user.username}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      fireboyPlayer.isReady
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {fireboyPlayer.isReady ? "READY" : "WAITING"}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => selectRole("fireboy")}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition shadow-md"
                >
                  Choose Fireboy
                </button>
              )}
            </div>

            {/* Watergirl Card */}
            <div
              className={`relative bg-gradient-to-b from-cyan-950/60 to-slate-900 border-2 rounded-2xl p-6 flex flex-col items-center justify-between text-center min-h-[220px] transition ${
                myRole === "watergirl" ? "border-cyan-500 shadow-cyan-950/50 shadow-xl" : "border-cyan-900/40"
              }`}
            >
              <div className="text-4xl mb-2">💧</div>
              <h3 className="text-xl font-bold text-cyan-400">WATERGIRL</h3>
              <p className="text-xs text-slate-400 mb-4">
                Immune to Water • Fragile to Lava
              </p>

              {watergirlPlayer ? (
                <div className="w-full bg-slate-950/80 p-3 rounded-xl border border-cyan-900/40 flex flex-col items-center gap-1">
                  <span className="text-sm font-semibold text-slate-200">
                    {watergirlPlayer.user.username}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      watergirlPlayer.isReady
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {watergirlPlayer.isReady ? "READY" : "WAITING"}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => selectRole("watergirl")}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-xl transition shadow-md"
                >
                  Choose Watergirl
                </button>
              )}
            </div>
          </div>

          {/* Level Selector & Ready / Start Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-200">Select Level</h4>
              <span className="text-xs text-slate-400">
                {isHost ? "Host controls level selection" : "Selected by Host"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  disabled={!isHost}
                  onClick={() => setCurrentLevelIndex(lvl.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    currentLevelIndex === lvl.id
                      ? "bg-amber-950/60 border-amber-500 text-amber-300"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <span className="block text-xs font-bold font-mono">LVL {lvl.id + 1}</span>
                  <span className="block text-xs font-semibold truncate">{lvl.name.split(":")[1] || lvl.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-800">
              <button
                onClick={toggleReady}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition shadow-md ${
                  myPlayerState?.isReady
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                }`}
              >
                {myPlayerState?.isReady ? "✓ READY TO PLAY" : "CLICK WHEN READY"}
              </button>

              {isHost && (
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center gap-2 transition transform hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-white" /> START GAME
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-[380px] shadow-xl">
          <h4 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 mb-2">
            Room Chat
          </h4>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            {chatMessages.length === 0 ? (
              <p className="text-slate-500 italic text-center py-8">
                No messages yet. Say hi to your partner!
              </p>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-bold ${
                        msg.role === "fireboy"
                          ? "text-red-400"
                          : msg.role === "watergirl"
                          ? "text-cyan-400"
                          : "text-amber-400"
                      }`}
                    >
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-200 break-words">{msg.text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
