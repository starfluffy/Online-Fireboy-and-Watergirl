import { useMemo, useState, useEffect, useContext } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { GameStateContext } from "./GameStateContext.tsx";
import { AuthContext } from "./AuthContext.tsx";
import { socket } from "../services/socket.ts";
import { LEVELS } from "../services/levelData.ts";
import type {
  RoomState,
  CharacterRole,
  ChatMessage,
  EmotePayload,
  LevelData,
  User,
} from "../types/types.ts";

export type GameMode = "online" | "local";

export interface GameStateContextType {
  gameMode: GameMode;
  setGameMode: Dispatch<SetStateAction<GameMode>>;
  roomState: RoomState | null;
  setRoomState: Dispatch<SetStateAction<RoomState | null>>;
  myRole: CharacterRole;
  setMyRole: Dispatch<SetStateAction<CharacterRole>>;
  currentLevelIndex: number;
  setCurrentLevelIndex: Dispatch<SetStateAction<number>>;
  currentLevelData: LevelData;
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  activeEmotes: Record<string, EmotePayload & { id: string; expiresAt: number }>;
  sendEmote: (emote: string) => void;
  createRoom: (preferredRole?: CharacterRole) => Promise<string | null>;
  joinRoom: (code: string) => Promise<{ success: boolean; error?: string }>;
  selectRole: (role: CharacterRole) => void;
  toggleReady: () => void;
  startGame: () => void;
  leaveRoom: () => void;
  restartLevel: () => void;
  nextLevel: () => void;
  socketConnected: boolean;
  soundMuted: boolean;
  setSoundMuted: Dispatch<SetStateAction<boolean>>;
}

export const GameStateContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useContext(AuthContext);
  const [gameMode, setGameMode] = useState<GameMode>("online");
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [myRole, setMyRole] = useState<CharacterRole>("fireboy");
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeEmotes, setActiveEmotes] = useState<Record<string, EmotePayload & { id: string; expiresAt: number }>>({});
  const [socketConnected, setSocketConnected] = useState<boolean>(socket.connected);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  const currentLevelData = useMemo(() => {
    return LEVELS[currentLevelIndex] || LEVELS[0];
  }, [currentLevelIndex]);

  // Socket Connection Monitoring & Global Event Listeners
  useEffect(() => {
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.on("room_updated", (updatedRoom: RoomState) => {
      setRoomState(updatedRoom);
      const sId = socket.id || "";
      if (updatedRoom.players[sId]) {
        const assignedRole = updatedRoom.players[sId].role;
        if (assignedRole) setMyRole(assignedRole);
      }
      if (updatedRoom.levelIndex !== undefined) {
        setCurrentLevelIndex(updatedRoom.levelIndex);
      }
    });

    socket.on("game_started", (startedRoom: RoomState) => {
      setRoomState(startedRoom);
      if (startedRoom.levelIndex !== undefined) {
        setCurrentLevelIndex(startedRoom.levelIndex);
      }
    });

    socket.on("chat_received", (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev.slice(-49), msg]);
    });

    socket.on("emote_received", (payload: EmotePayload) => {
      const emoteId = Math.random().toString(36).substring(2, 9);
      setActiveEmotes((prev) => ({
        ...prev,
        [payload.socketId]: {
          ...payload,
          id: emoteId,
          expiresAt: Date.now() + 3000,
        },
      }));
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room_updated");
      socket.off("game_started");
      socket.off("chat_received");
      socket.off("emote_received");
    };
  }, []);

  // Cleanup expired floating emotes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveEmotes((prev) => {
        let changed = false;
        const next = { ...prev };
        for (const [key, item] of Object.entries(next)) {
          if (item.expiresAt < now) {
            delete next[key];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const getActiveUser = (): User => {
    return currentUser || {
      _id: `user_${Math.random().toString(36).substring(2, 7)}`,
      username: "FireExplorer",
      email: "player@example.com",
      profilePicture: "🔥",
    };
  };

  const createRoom = async (preferredRole: CharacterRole = "fireboy"): Promise<string | null> => {
    const user = getActiveUser();

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let fallbackCode = "";
    for (let i = 0; i < 4; i++) {
      fallbackCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const sId = socket.id || "local-host";
    const fallbackRoom: RoomState = {
      roomCode: fallbackCode,
      hostSocketId: sId,
      players: {
        [sId]: {
          socketId: sId,
          user,
          role: preferredRole,
          isReady: true,
          isHost: true,
        },
      },
      levelIndex: currentLevelIndex,
      status: "lobby",
      levelState: {
        levelIndex: currentLevelIndex,
        leversState: {},
        buttonsState: {},
        cratesPosition: {},
        gemsCollected: {},
        isCompleted: false,
        startTime: Date.now(),
        elapsedTime: 0,
      },
    };

    if (!socket.connected) {
      socket.connect();
    }

    return new Promise((resolve) => {
      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          setRoomState(fallbackRoom);
          setMyRole(preferredRole);
          resolve(fallbackCode);
        }
      }, 1200);

      socket.emit("create_room", { user, preferredRole }, (res: { success: boolean; room: RoomState }) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          if (res?.success && res?.room) {
            setRoomState(res.room);
            setMyRole(preferredRole);
            resolve(res.room.roomCode);
          } else {
            setRoomState(fallbackRoom);
            setMyRole(preferredRole);
            resolve(fallbackCode);
          }
        }
      });
    });
  };

  const joinRoom = async (code: string): Promise<{ success: boolean; error?: string }> => {
    const user = getActiveUser();

    if (!socket.connected) {
      socket.connect();
    }

    return new Promise((resolve) => {
      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve({ success: false, error: "Connection timed out. Make sure your friend's room code is active!" });
        }
      }, 2500);

      socket.emit("join_room", { roomCode: code, user }, (res: { success: boolean; room?: RoomState; error?: string }) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          if (res?.success && res?.room) {
            setRoomState(res.room);
            const sId = socket.id || "";
            if (res.room.players[sId]?.role) {
              setMyRole(res.room.players[sId].role!);
            }
            resolve({ success: true });
          } else {
            resolve({ success: false, error: res?.error || "Could not join room." });
          }
        }
      });
    });
  };

  const selectRole = (role: CharacterRole) => {
    setMyRole(role);
    if (gameMode === "online" && roomState) {
      socket.emit("select_character", { role });
    }
  };

  const toggleReady = () => {
    if (gameMode === "online" && roomState) {
      socket.emit("toggle_ready");
    }
  };

  const startGame = () => {
    if (gameMode === "online" && roomState) {
      socket.emit("start_game");
    } else if (gameMode === "local") {
      if (roomState) {
        setRoomState({ ...roomState, status: "playing" });
      }
    }
  };

  const leaveRoom = () => {
    setRoomState(null);
    setChatMessages([]);
  };

  const restartLevel = () => {
    if (gameMode === "online" && roomState) {
      socket.emit("restart_level");
    }
  };

  const nextLevel = () => {
    const nextIdx = (currentLevelIndex + 1) % LEVELS.length;
    setCurrentLevelIndex(nextIdx);
    if (gameMode === "online" && roomState) {
      socket.emit("change_level", { levelIndex: nextIdx });
    }
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    if (gameMode === "online" && roomState) {
      socket.emit("send_chat", { text });
    } else {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          sender: currentUser?.username || "Player",
          role: myRole,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const sendEmote = (emote: string) => {
    if (gameMode === "online" && roomState) {
      socket.emit("send_emote", { emote });
    } else {
      setActiveEmotes((prev) => ({
        ...prev,
        local: {
          socketId: "local",
          sender: currentUser?.username || "Player",
          role: myRole,
          emote,
          id: Math.random().toString(36).substring(2, 9),
          expiresAt: Date.now() + 3000,
        },
      }));
    }
  };

  const value = useMemo(
    () => ({
      gameMode,
      setGameMode,
      roomState,
      setRoomState,
      myRole,
      setMyRole,
      currentLevelIndex,
      setCurrentLevelIndex,
      currentLevelData,
      chatMessages,
      sendChatMessage,
      activeEmotes,
      sendEmote,
      createRoom,
      joinRoom,
      selectRole,
      toggleReady,
      startGame,
      leaveRoom,
      restartLevel,
      nextLevel,
      socketConnected,
      soundMuted,
      setSoundMuted,
    }),
    [
      gameMode,
      roomState,
      myRole,
      currentLevelIndex,
      currentLevelData,
      chatMessages,
      activeEmotes,
      socketConnected,
      soundMuted,
    ],
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};