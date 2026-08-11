import { useEffect, useRef, useState, useContext } from "react";
import { GameStateContext } from "../../context/GameStateContext.tsx";
import { soundService } from "../../services/soundService.ts";
import { socket } from "../../services/socket.ts";
import confetti from "canvas-confetti";
import type {
  PlayerPosition,
  CharacterRole,
  Rect,
} from "../../types/types.ts";

interface PhysicsPlayer {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  facing: "left" | "right";
  isGrounded: boolean;
  animation: "idle" | "run" | "jump" | "fall" | "dead" | "win";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function GameCanvasArea() {
  const {
    gameMode,
    roomState,
    myRole,
    currentLevelData,
    sendEmote,
    activeEmotes,
    restartLevel,
    nextLevel,
  } = useContext(GameStateContext);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game Engine Internal States
  const [levelStartTime, setLevelStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [gemsCollected, setGemsCollected] = useState<Record<string, boolean>>({});
  const [leversState, setLeversState] = useState<Record<string, boolean>>({});
  const [buttonsState, setButtonsState] = useState<Record<string, boolean>>({});
  const [cratesState, setCratesState] = useState<Record<string, { x: number; y: number }>>({});
  const [isDead, setIsDead] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [victoryStats, setVictoryStats] = useState<{ time: number; gems: number } | null>(null);

  // Player physics state
  const fireboyRef = useRef<PhysicsPlayer>({
    x: currentLevelData.fireboySpawn.x,
    y: currentLevelData.fireboySpawn.y,
    w: 24,
    h: 36,
    vx: 0,
    vy: 0,
    facing: "right",
    isGrounded: false,
    animation: "idle",
  });

  const watergirlRef = useRef<PhysicsPlayer>({
    x: currentLevelData.watergirlSpawn.x,
    y: currentLevelData.watergirlSpawn.y,
    w: 24,
    h: 36,
    vx: 0,
    vy: 0,
    facing: "right",
    isGrounded: false,
    animation: "idle",
  });

  // Peer Interpolation target for online multiplayer
  const peerTargetRef = useRef<PlayerPosition | null>(null);

  // Particle System
  const particlesRef = useRef<Particle[]>([]);

  // Key state listener
  const keysRef = useRef<Record<string, boolean>>({});

  // Reset Level Physics on level change
  useEffect(() => {
    fireboyRef.current = {
      x: currentLevelData.fireboySpawn.x,
      y: currentLevelData.fireboySpawn.y,
      w: 24,
      h: 36,
      vx: 0,
      vy: 0,
      facing: "right",
      isGrounded: false,
      animation: "idle",
    };
    watergirlRef.current = {
      x: currentLevelData.watergirlSpawn.x,
      y: currentLevelData.watergirlSpawn.y,
      w: 24,
      h: 36,
      vx: 0,
      vy: 0,
      facing: "right",
      isGrounded: false,
      animation: "idle",
    };

    // Initial Crates position
    const initialCrates: Record<string, { x: number; y: number }> = {};
    currentLevelData.crates.forEach((c) => {
      initialCrates[c.id] = { x: c.x, y: c.y };
    });
    setCratesState(initialCrates);

    setGemsCollected({});
    setLeversState({});
    setButtonsState({});
    setIsDead(false);
    setIsVictory(false);
    setVictoryStats(null);
    setLevelStartTime(Date.now());
  }, [currentLevelData]);

  // Handle Socket Events for Online Multiplayer Sync
  useEffect(() => {
    if (gameMode !== "online") return;

    const handlePeerMoved = (payload: { socketId: string; role: CharacterRole; position: PlayerPosition }) => {
      if (payload.role !== myRole) {
        peerTargetRef.current = payload.position;
      }
    };

    const handleLeverUpdated = (payload: { leverId: string; isToggled: boolean }) => {
      setLeversState((prev) => ({ ...prev, [payload.leverId]: payload.isToggled }));
      soundService.playLeverToggle();
    };

    const handleButtonUpdated = (payload: { buttonId: string; isPressed: boolean }) => {
      setButtonsState((prev) => ({ ...prev, [payload.buttonId]: payload.isPressed }));
    };

    const handleGemCollected = (payload: { gemId: string }) => {
      setGemsCollected((prev) => ({ ...prev, [payload.gemId]: true }));
      soundService.playGemCollect();
    };

    const handlePlayerDied = () => {
      setIsDead(true);
      soundService.playDeathSound();
    };

    const handleLevelRestarted = () => {
      fireboyRef.current.x = currentLevelData.fireboySpawn.x;
      fireboyRef.current.y = currentLevelData.fireboySpawn.y;
      fireboyRef.current.vx = 0;
      fireboyRef.current.vy = 0;

      watergirlRef.current.x = currentLevelData.watergirlSpawn.x;
      watergirlRef.current.y = currentLevelData.watergirlSpawn.y;
      watergirlRef.current.vx = 0;
      watergirlRef.current.vy = 0;

      setGemsCollected({});
      setLeversState({});
      setButtonsState({});
      setIsDead(false);
      setIsVictory(false);
      setLevelStartTime(Date.now());
    };

    socket.on("peer_moved", handlePeerMoved);
    socket.on("lever_updated", handleLeverUpdated);
    socket.on("button_updated", handleButtonUpdated);
    socket.on("gem_collected", handleGemCollected);
    socket.on("player_died", handlePlayerDied);
    socket.on("level_restarted", handleLevelRestarted);

    return () => {
      socket.off("peer_moved", handlePeerMoved);
      socket.off("lever_updated", handleLeverUpdated);
      socket.off("button_updated", handleButtonUpdated);
      socket.off("gem_collected", handleGemCollected);
      socket.off("player_died", handlePlayerDied);
      socket.off("level_restarted", handleLevelRestarted);
    };
  }, [gameMode, myRole, currentLevelData]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;

      // Handle Lever interaction (E key or Down Arrow)
      if (e.key === "e" || e.key === "E" || e.key === "ArrowDown") {
        checkLeverInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [leversState]);

  // Lever Check Logic
  const checkLeverInteraction = () => {
    currentLevelData.levers.forEach((lever) => {
      const fb = fireboyRef.current;
      const wg = watergirlRef.current;

      const fbNear = Math.hypot(fb.x + fb.w / 2 - lever.x, fb.y + fb.h / 2 - lever.y) < 35;
      const wgNear = Math.hypot(wg.x + wg.w / 2 - lever.x, wg.y + wg.h / 2 - lever.y) < 35;

      if (fbNear || wgNear) {
        const nextState = !leversState[lever.id];
        setLeversState((prev) => ({ ...prev, [lever.id]: nextState }));
        soundService.playLeverToggle();

        if (gameMode === "online") {
          socket.emit("interact_lever", { leverId: lever.id, isToggled: nextState });
        }
      }
    });
  };

  // Main 60FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastNetworkSync = 0;

    const gameLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Timer update
      if (!isVictory && !isDead) {
        setElapsedTime(Math.floor((Date.now() - levelStartTime) / 1000));
      }

      // Physics update (if not dead or victory)
      if (!isDead && !isVictory) {
        updatePhysics();
      }

      // Network Movement Broadcast (Online mode, 30Hz throttled)
      const now = Date.now();
      if (gameMode === "online" && roomState && now - lastNetworkSync > 33) {
        lastNetworkSync = now;
        const myChar = myRole === "fireboy" ? fireboyRef.current : watergirlRef.current;
        const posPayload: PlayerPosition = {
          x: myChar.x,
          y: myChar.y,
          vx: myChar.vx,
          vy: myChar.vy,
          facing: myChar.facing,
          animation: myChar.animation,
          isGrounded: myChar.isGrounded,
        };
        socket.emit("player_move", posPayload);
      }

      // Peer position interpolation for online mode
      if (gameMode === "online" && peerTargetRef.current) {
        const peerRole: CharacterRole = myRole === "fireboy" ? "watergirl" : "fireboy";
        const peer = peerRole === "fireboy" ? fireboyRef.current : watergirlRef.current;
        const target = peerTargetRef.current;

        peer.x += (target.x - peer.x) * 0.3;
        peer.y += (target.y - peer.y) * 0.3;
        peer.vx = target.vx;
        peer.vy = target.vy;
        peer.facing = target.facing;
        peer.animation = target.animation;
        peer.isGrounded = target.isGrounded;
      }

      // Render graphics
      renderGame(ctx);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameMode, myRole, isDead, isVictory, levelStartTime, leversState, buttonsState, cratesState, gemsCollected]);

  // Update Player Physics, Collisions, Triggers, & Hazards
  const updatePhysics = () => {
    const GRAVITY = 0.55;
    const JUMP_FORCE = -10.5;
    const MOVE_SPEED = 3.8;

    const fb = fireboyRef.current;
    const wg = watergirlRef.current;

    // Controls Handling
    if (gameMode === "local" || myRole === "fireboy") {
      // Fireboy Movement (WASD or Arrows if solo)
      const leftKey = keysRef.current["a"] || keysRef.current["A"] || (gameMode === "local" ? false : keysRef.current["ArrowLeft"]);
      const rightKey = keysRef.current["d"] || keysRef.current["D"] || (gameMode === "local" ? false : keysRef.current["ArrowRight"]);
      const jumpKey = keysRef.current["w"] || keysRef.current["W"] || keysRef.current[" "] || (gameMode === "local" ? false : keysRef.current["ArrowUp"]);

      if (leftKey) {
        fb.vx = -MOVE_SPEED;
        fb.facing = "left";
      } else if (rightKey) {
        fb.vx = MOVE_SPEED;
        fb.facing = "right";
      } else {
        fb.vx *= 0.75;
      }

      if (jumpKey && fb.isGrounded) {
        fb.vy = JUMP_FORCE;
        fb.isGrounded = false;
        soundService.playJump();
      }
    }

    if (gameMode === "local" || myRole === "watergirl") {
      // Watergirl Movement (Arrow keys or WASD if online)
      const leftKey = gameMode === "local" ? keysRef.current["ArrowLeft"] : (keysRef.current["a"] || keysRef.current["A"] || keysRef.current["ArrowLeft"]);
      const rightKey = gameMode === "local" ? keysRef.current["ArrowRight"] : (keysRef.current["d"] || keysRef.current["D"] || keysRef.current["ArrowRight"]);
      const jumpKey = gameMode === "local" ? keysRef.current["ArrowUp"] : (keysRef.current["w"] || keysRef.current["W"] || keysRef.current[" "] || keysRef.current["ArrowUp"]);

      if (leftKey) {
        wg.vx = -MOVE_SPEED;
        wg.facing = "left";
      } else if (rightKey) {
        wg.vx = MOVE_SPEED;
        wg.facing = "right";
      } else {
        wg.vx *= 0.75;
      }

      if (jumpKey && wg.isGrounded) {
        wg.vy = JUMP_FORCE;
        wg.isGrounded = false;
        soundService.playJump();
      }
    }

    // Apply Gravity
    fb.vy += GRAVITY;
    wg.vy += GRAVITY;

    // Evaluate Moving Platforms positions
    const activePlatforms: Rect[] = [...currentLevelData.platforms];
    currentLevelData.movingPlatforms.forEach((mp) => {
      const isTriggered = mp.activeStateNeeded ? (leversState[mp.id] || buttonsState[mp.id]) : true;
      const targetPos = isTriggered ? { x: mp.endX, y: mp.endY } : { x: mp.startX, y: mp.startY };

      // Interpolate platform position (stored in activePlatforms)
      const curX = mp.x + (targetPos.x - mp.x) * 0.05;
      const curY = mp.y + (targetPos.y - mp.y) * 0.05;
      mp.x = curX;
      mp.y = curY;

      activePlatforms.push({ x: mp.x, y: mp.y, w: mp.w, h: mp.h });
    });

    // Move & Collide Fireboy
    moveAndCollide(fb, activePlatforms);
    moveAndCollide(wg, activePlatforms);

    // Button Triggers & Crate Physics
    const newButtonStates: Record<string, boolean> = {};
    currentLevelData.buttons.forEach((btn) => {
      const fbOnBtn = checkOverlap({ x: fb.x, y: fb.y, w: fb.w, h: fb.h }, { x: btn.x - 15, y: btn.y - 5, w: 30, h: 10 });
      const wgOnBtn = checkOverlap({ x: wg.x, y: wg.y, w: wg.w, h: wg.h }, { x: btn.x - 15, y: btn.y - 5, w: 30, h: 10 });
      let crateOnBtn = false;

      currentLevelData.crates.forEach((c) => {
        const cratePos = cratesState[c.id] || { x: c.x, y: c.y };
        if (checkOverlap({ x: cratePos.x, y: cratePos.y, w: c.w, h: c.h }, { x: btn.x - 15, y: btn.y - 5, w: 30, h: 10 })) {
          crateOnBtn = true;
        }
      });

      const isPressed = fbOnBtn || wgOnBtn || crateOnBtn;
      newButtonStates[btn.id] = isPressed;

      if (isPressed && !buttonsState[btn.id]) {
        soundService.playButtonPress();
        if (gameMode === "online") {
          socket.emit("interact_button", { buttonId: btn.id, isPressed: true });
        }
      }
    });
    setButtonsState(newButtonStates);

    // Gem Collection Check
    currentLevelData.gems.forEach((gem) => {
      if (gemsCollected[gem.id]) return;

      const gemRect = { x: gem.x - 10, y: gem.y - 10, w: 20, h: 20 };
      const fbCollected = gem.type !== "water" && checkOverlap({ x: fb.x, y: fb.y, w: fb.w, h: fb.h }, gemRect);
      const wgCollected = gem.type !== "fire" && checkOverlap({ x: wg.x, y: wg.y, w: wg.w, h: wg.h }, gemRect);

      if (fbCollected || wgCollected) {
        setGemsCollected((prev) => ({ ...prev, [gem.id]: true }));
        soundService.playGemCollect(gem.type);
        spawnParticles(gem.x, gem.y, gem.type === "fire" ? "#ff4500" : gem.type === "water" ? "#00bfff" : "#ffffff", 12);

        if (gameMode === "online") {
          socket.emit("collect_gem", { gemId: gem.id });
        }
      }
    });

    // Pool Hazards Check (Lava, Water, Sludge)
    currentLevelData.pools.forEach((pool) => {
      const fbInPool = checkOverlap({ x: fb.x + 4, y: fb.y + 10, w: fb.w - 8, h: fb.h - 10 }, pool.rect);
      const wgInPool = checkOverlap({ x: wg.x + 4, y: wg.y + 10, w: wg.w - 8, h: wg.h - 10 }, pool.rect);

      // Fireboy dies in Water or Sludge
      if (fbInPool && (pool.type === "water" || pool.type === "sludge")) {
        triggerDeath("fireboy", pool.type);
      }

      // Watergirl dies in Lava or Sludge
      if (wgInPool && (pool.type === "lava" || pool.type === "sludge")) {
        triggerDeath("watergirl", pool.type);
      }
    });

    // Exit Doors Check (Victory Condition)
    const fbDoor = currentLevelData.fireboyDoor;
    const wgDoor = currentLevelData.watergirlDoor;

    const fbInDoor = checkOverlap(
      { x: fb.x, y: fb.y, w: fb.w, h: fb.h },
      { x: fbDoor.x, y: fbDoor.y, w: 36, h: 54 }
    );
    const wgInDoor = checkOverlap(
      { x: wg.x, y: wg.y, w: wg.w, h: wg.h },
      { x: wgDoor.x, y: wgDoor.y, w: 36, h: 54 }
    );

    if (fbInDoor && wgInDoor && !isVictory) {
      triggerVictory();
    }
  };

  // Move player & resolve box collisions against platforms
  const moveAndCollide = (p: PhysicsPlayer, platforms: Rect[]) => {
    // Horizontal Movement
    p.x += p.vx;
    for (const plat of platforms) {
      if (checkOverlap({ x: p.x, y: p.y, w: p.w, h: p.h }, plat)) {
        if (p.vx > 0) p.x = plat.x - p.w;
        else if (p.vx < 0) p.x = plat.x + plat.w;
        p.vx = 0;
      }
    }

    // Vertical Movement
    p.y += p.vy;
    p.isGrounded = false;
    for (const plat of platforms) {
      if (checkOverlap({ x: p.x, y: p.y, w: p.w, h: p.h }, plat)) {
        if (p.vy > 0) {
          p.y = plat.y - p.h;
          p.vy = 0;
          p.isGrounded = true;
        } else if (p.vy < 0) {
          p.y = plat.y + plat.h;
          p.vy = 0;
        }
      }
    }

    // Update Animation state
    if (!p.isGrounded) {
      p.animation = p.vy < 0 ? "jump" : "fall";
    } else if (Math.abs(p.vx) > 0.5) {
      p.animation = "run";
    } else {
      p.animation = "idle";
    }
  };

  // Helper Rect Collision
  const checkOverlap = (r1: Rect, r2: Rect): boolean => {
    return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y;
  };

  // Trigger Death
  const triggerDeath = (character: CharacterRole, cause: string) => {
    if (isDead) return;
    setIsDead(true);
    soundService.playDeathSound();

    const charObj = character === "fireboy" ? fireboyRef.current : watergirlRef.current;
    spawnParticles(charObj.x + 12, charObj.y + 18, character === "fireboy" ? "#ff4500" : "#00bfff", 25);

    if (gameMode === "online") {
      socket.emit("player_died", { character, cause });
    }
  };

  // Trigger Level Victory
  const triggerVictory = () => {
    setIsVictory(true);
    soundService.playVictoryFanfare();

    const totalGems = Object.keys(gemsCollected).length;
    setVictoryStats({ time: elapsedTime, gems: totalGems });

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    if (gameMode === "online") {
      socket.emit("level_completed", {
        levelIndex: currentLevelData.id,
        timeSeconds: elapsedTime,
        gemsCollected: totalGems,
      });
    }
  };

  // Spawn visual particle burst
  const spawnParticles = (x: number, y: number, color: string, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: Math.random() * 4 + 2,
        color,
        life: 0,
        maxLife: Math.random() * 25 + 15,
      });
    }
  };

  // Main Canvas Renderer
  const renderGame = (ctx: CanvasRenderingContext2D) => {
    const W = currentLevelData.width;
    const H = currentLevelData.height;

    // 1. Temple Background
    ctx.fillStyle = "#12141c";
    ctx.fillRect(0, 0, W, H);

    // Subtle stone grid texture
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // 2. Render Platforms
    currentLevelData.platforms.forEach((plat) => {
      ctx.fillStyle = "#2d3345";
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

      // Gold/Bronze trim top edge
      ctx.fillStyle = "#c59b27";
      ctx.fillRect(plat.x, plat.y, plat.w, 4);
    });

    // 3. Render Moving Platforms
    currentLevelData.movingPlatforms.forEach((mp) => {
      ctx.fillStyle = "#4a5568";
      ctx.fillRect(mp.x, mp.y, mp.w, mp.h);

      ctx.fillStyle = leversState[mp.id] || buttonsState[mp.id] ? "#38a169" : "#e53e3e";
      ctx.fillRect(mp.x + 4, mp.y + 3, mp.w - 8, 3);
    });

    // 4. Render Liquid Pools (Lava, Water, Sludge) with Sine Wave Animation
    const timeWave = Date.now() * 0.005;
    currentLevelData.pools.forEach((pool) => {
      const { x, y, w, h } = pool.rect;
      let grad: CanvasGradient;

      if (pool.type === "lava") {
        grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, "#ff4500");
        grad.addColorStop(1, "#8b0000");
      } else if (pool.type === "water") {
        grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, "#00bfff");
        grad.addColorStop(1, "#00008b");
      } else {
        grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, "#32cd32");
        grad.addColorStop(1, "#006400");
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.lineTo(x, y);

      for (let px = 0; px <= w; px += 10) {
        const waveY = y + Math.sin(timeWave + px * 0.05) * 3;
        ctx.lineTo(x + px, waveY);
      }
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      ctx.fill();
    });

    // 5. Render Levers & Buttons
    currentLevelData.levers.forEach((lever) => {
      const isToggled = leversState[lever.id];
      ctx.fillStyle = "#718096";
      ctx.fillRect(lever.x - 8, lever.y, 16, 6);

      ctx.strokeStyle = isToggled ? "#38a169" : "#e53e3e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(lever.x, lever.y);
      ctx.lineTo(isToggled ? lever.x + 12 : lever.x - 12, lever.y - 18);
      ctx.stroke();
    });

    currentLevelData.buttons.forEach((btn) => {
      const isPressed = buttonsState[btn.id];
      ctx.fillStyle = "#4a5568";
      ctx.fillRect(btn.x - 15, btn.y, 30, 6);

      ctx.fillStyle = isPressed ? "#38a169" : "#e53e3e";
      ctx.fillRect(btn.x - 12, isPressed ? btn.y + 3 : btn.y - 3, 24, isPressed ? 3 : 6);
    });

    // 6. Render Exit Doors
    renderDoor(ctx, currentLevelData.fireboyDoor, "fire");
    renderDoor(ctx, currentLevelData.watergirlDoor, "water");

    // 7. Render Gems
    currentLevelData.gems.forEach((gem) => {
      if (gemsCollected[gem.id]) return;

      const pulse = Math.sin(Date.now() * 0.008) * 2;
      ctx.save();
      ctx.translate(gem.x, gem.y + pulse);

      ctx.fillStyle = gem.type === "fire" ? "#ff4500" : gem.type === "water" ? "#00bfff" : "#ffffff";
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(8, 0);
      ctx.lineTo(0, 10);
      ctx.lineTo(-8, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.stroke();
      ctx.restore();
    });

    // 8. Render Pushable Crates
    currentLevelData.crates.forEach((c) => {
      const pos = cratesState[c.id] || { x: c.x, y: c.y };
      ctx.fillStyle = "#8b4513";
      ctx.fillRect(pos.x, pos.y, c.w, c.h);
      ctx.strokeStyle = "#5c2e0b";
      ctx.lineWidth = 2;
      ctx.strokeRect(pos.x, pos.y, c.w, c.h);
    });

    // 9. Render Characters (Fireboy & Watergirl)
    renderCharacter(ctx, fireboyRef.current, "fireboy");
    renderCharacter(ctx, watergirlRef.current, "watergirl");

    // 10. Render Active Particles
    const activeParticles: Particle[] = [];
    particlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      const alpha = 1 - p.life / p.maxLife;
      if (alpha > 0) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        activeParticles.push(p);
      }
    });
    particlesRef.current = activeParticles;

    // 11. Render Overhead Floating Emotes
    Object.values(activeEmotes).forEach((item) => {
      const char = item.role === "fireboy" ? fireboyRef.current : watergirlRef.current;
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.emote, char.x + char.w / 2, char.y - 15);
    });

    // 12. Overlay UI Banners (Victory / Game Over)
    if (isDead) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ff4d4d";
      ctx.font = "bold 36px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Lava or Water Claimed a Hero!", W / 2, H / 2 - 20);
      ctx.font = "18px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Click 'Retry Level' or press 'R' to try again", W / 2, H / 2 + 30);
    }
  };

  // Character Sprite Renderer
  const renderCharacter = (ctx: CanvasRenderingContext2D, char: PhysicsPlayer, role: CharacterRole) => {
    const { x, y, w, h, facing } = char;

    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    if (facing === "left") ctx.scale(-1, 1);

    if (role === "fireboy") {
      // Fireboy Body (Radiant Flame Red)
      ctx.fillStyle = "#ff3300";
      ctx.beginPath();
      ctx.arc(0, -4, 12, Math.PI, 0); // Head
      ctx.lineTo(10, 16);
      ctx.lineTo(-10, 16);
      ctx.closePath();
      ctx.fill();

      // Flame Flickering Crown
      const flameHeight = Math.sin(Date.now() * 0.02) * 4;
      ctx.fillStyle = "#ff9900";
      ctx.beginPath();
      ctx.moveTo(-8, -12);
      ctx.quadraticCurveTo(-4, -22 - flameHeight, 0, -12);
      ctx.quadraticCurveTo(4, -24 - flameHeight, 8, -12);
      ctx.closePath();
      ctx.fill();

      // Glowing Eyes
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(2, -8, 4, 4);
      ctx.fillRect(7, -8, 3, 4);
    } else {
      // Watergirl Body (Fluid Azure Blue)
      ctx.fillStyle = "#00aaff";
      ctx.beginPath();
      ctx.arc(0, -4, 12, Math.PI, 0); // Head
      ctx.lineTo(10, 16);
      ctx.lineTo(-10, 16);
      ctx.closePath();
      ctx.fill();

      // Water Drop Crest
      ctx.fillStyle = "#66ccff";
      ctx.beginPath();
      ctx.moveTo(-6, -12);
      ctx.quadraticCurveTo(0, -26, 6, -12);
      ctx.closePath();
      ctx.fill();

      // Glowing Eyes
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(2, -8, 4, 4);
      ctx.fillRect(7, -8, 3, 4);
    }

    ctx.restore();
  };

  // Exit Door Renderer
  const renderDoor = (ctx: CanvasRenderingContext2D, door: { x: number; y: number }, type: "fire" | "water") => {
    const { x, y } = door;
    const color = type === "fire" ? "#ff4500" : "#00bfff";

    // Door Frame
    ctx.fillStyle = "#2d3748";
    ctx.fillRect(x, y, 36, 54);

    // Glowing Archway
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 2, y + 2, 32, 50);

    // Symbol Icon overhead
    ctx.fillStyle = color;
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(type === "fire" ? "🔥" : "💧", x + 18, y - 8);
  };

  return (
    <div className="relative w-full max-w-[1000px] mx-auto flex flex-col items-center select-none">
      {/* Game Canvas Container */}
      <div className="relative border-4 border-amber-900/60 rounded-xl overflow-hidden shadow-2xl bg-slate-950">
        <canvas
          ref={canvasRef}
          width={currentLevelData.width}
          height={currentLevelData.height}
          className="w-full h-auto max-h-[70vh] block"
        />

        {/* Victory Modal Overlay */}
        {isVictory && victoryStats && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
            <h2 className="text-4xl font-extrabold text-amber-400 mb-2 drop-shadow-lg">
              🏆 LEVEL CLEARED! 🏆
            </h2>
            <p className="text-slate-300 text-lg mb-6">
              Fireboy & Watergirl reached the exit doors safely!
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm w-full bg-slate-900/80 p-4 rounded-xl border border-slate-700 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-sm">Completion Time</span>
                <span className="text-2xl font-bold text-emerald-400">{victoryStats.time}s</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-sm">Gems Collected</span>
                <span className="text-2xl font-bold text-amber-400">
                  {victoryStats.gems} / {currentLevelData.gems.length}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => restartLevel()}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg shadow-md transition"
              >
                Replay Level
              </button>
              <button
                onClick={() => nextLevel()}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-lg shadow-lg transition transform hover:scale-105"
              >
                Next Level ➔
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Emote Quick Bar */}
      <div className="mt-4 flex gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-800 shadow-lg">
        {["🔥", "💧", "👑", "👏", "💀", "⏱️", "❤️"].map((emo) => (
          <button
            key={emo}
            onClick={() => sendEmote(emo)}
            className="w-10 h-10 text-xl flex items-center justify-center bg-slate-800 hover:bg-slate-700 active:scale-95 rounded-lg transition"
            title={`Send ${emo} emote`}
          >
            {emo}
          </button>
        ))}

        <button
          onClick={() => restartLevel()}
          className="ml-4 px-3 py-1.5 bg-rose-900/40 hover:bg-rose-800/60 border border-rose-700/50 text-rose-200 text-xs font-semibold rounded-lg transition"
        >
          🔄 Restart Level
        </button>
      </div>
    </div>
  );
}