import type { LevelData } from "../types/types.ts";

export const LEVELS: LevelData[] = [
  // LEVEL 0: Forest Temple Intro (Basics)
  {
    id: 0,
    name: "Level 1: The Forest Temple",
    description: "Learn the ropes! Fireboy crosses lava, Watergirl crosses water, and both avoid green sludge.",
    difficulty: "Easy",
    width: 1000,
    height: 600,
    platforms: [
      // Outer boundaries
      { x: 0, y: 0, w: 1000, h: 20 }, // Top
      { x: 0, y: 0, w: 20, h: 600 }, // Left wall
      { x: 980, y: 0, w: 20, h: 600 }, // Right wall
      { x: 0, y: 580, w: 1000, h: 20 }, // Bottom floor

      // Bottom section floors
      { x: 20, y: 530, w: 150, h: 50 }, // Spawn ledge left
      { x: 310, y: 530, w: 140, h: 50 }, // Middle bottom platform 1
      { x: 590, y: 530, w: 140, h: 50 }, // Middle bottom platform 2
      { x: 870, y: 530, w: 110, h: 50 }, // Bottom right platform

      // Middle tier floors
      { x: 20, y: 380, w: 260, h: 20 }, // Mid left
      { x: 360, y: 380, w: 280, h: 20 }, // Mid center
      { x: 720, y: 380, w: 260, h: 20 }, // Mid right

      // Top tier floors (Exits area)
      { x: 20, y: 220, w: 320, h: 20 }, // Top left platform
      { x: 420, y: 200, w: 560, h: 20 }, // Top exit floor
    ],
    pools: [
      { id: "p1", type: "lava", rect: { x: 170, y: 550, w: 140, h: 30 } },
      { id: "p2", type: "water", rect: { x: 450, y: 550, w: 140, h: 30 } },
      { id: "p3", type: "sludge", rect: { x: 730, y: 550, w: 140, h: 30 } },
      { id: "p4", type: "lava", rect: { x: 280, y: 360, w: 80, h: 20 } },
      { id: "p5", type: "water", rect: { x: 640, y: 360, w: 80, h: 20 } },
    ],
    gems: [
      { id: "g1", type: "fire", x: 230, y: 510 },
      { id: "g2", type: "water", x: 510, y: 510 },
      { id: "g3", type: "diamond", x: 800, y: 510 },
      { id: "g4", type: "fire", x: 320, y: 330 },
      { id: "g5", type: "water", x: 680, y: 330 },
      { id: "g6", type: "diamond", x: 500, y: 160 },
    ],
    levers: [
      { id: "l1", x: 200, y: 340, targetId: "mp1" },
    ],
    buttons: [],
    movingPlatforms: [
      {
        id: "mp1",
        x: 340,
        y: 220,
        w: 80,
        h: 15,
        startX: 340,
        startY: 380,
        endX: 340,
        endY: 220,
        speed: 2,
        activeStateNeeded: true,
      },
    ],
    crates: [],
    fireboySpawn: { x: 50, y: 470 },
    watergirlSpawn: { x: 100, y: 470 },
    fireboyDoor: { id: "fd0", type: "fire", x: 840, y: 120 },
    watergirlDoor: { id: "wd0", type: "water", x: 910, y: 120 },
  },

  // LEVEL 1: Dual Levers & Elevators
  {
    id: 1,
    name: "Level 2: Dual Switch Chamber",
    description: "Help each other! One player flips a lever to raise an elevator for their partner.",
    difficulty: "Medium",
    width: 1000,
    height: 600,
    platforms: [
      // Outer boundaries
      { x: 0, y: 0, w: 1000, h: 20 },
      { x: 0, y: 0, w: 20, h: 600 },
      { x: 980, y: 0, w: 20, h: 600 },
      { x: 0, y: 580, w: 1000, h: 20 },

      // Bottom section
      { x: 20, y: 530, w: 250, h: 50 },
      { x: 370, y: 530, w: 260, h: 50 },
      { x: 750, y: 530, w: 230, h: 50 },

      // Middle tier
      { x: 20, y: 370, w: 380, h: 20 },
      { x: 480, y: 370, w: 500, h: 20 },

      // Upper tier
      { x: 20, y: 210, w: 460, h: 20 },
      { x: 540, y: 210, w: 440, h: 20 },
    ],
    pools: [
      { id: "p1", type: "water", rect: { x: 270, y: 550, w: 100, h: 30 } },
      { id: "p2", type: "lava", rect: { x: 630, y: 550, w: 120, h: 30 } },
      { id: "p3", type: "sludge", rect: { x: 400, y: 350, w: 80, h: 20 } },
    ],
    gems: [
      { id: "g1", type: "fire", x: 320, y: 510 },
      { id: "g2", type: "water", x: 690, y: 510 },
      { id: "g3", type: "diamond", x: 440, y: 310 },
      { id: "g4", type: "fire", x: 200, y: 170 },
      { id: "g5", type: "water", x: 800, y: 170 },
    ],
    levers: [
      { id: "l1", x: 120, y: 330, targetId: "mp_right" },
      { id: "l2", x: 880, y: 330, targetId: "mp_left" },
    ],
    buttons: [],
    movingPlatforms: [
      {
        id: "mp_left",
        x: 20,
        y: 530,
        w: 80,
        h: 15,
        startX: 20,
        startY: 530,
        endX: 20,
        endY: 370,
        speed: 2.5,
        activeStateNeeded: true,
      },
      {
        id: "mp_right",
        x: 900,
        y: 530,
        w: 80,
        h: 15,
        startX: 900,
        startY: 530,
        endX: 900,
        endY: 370,
        speed: 2.5,
        activeStateNeeded: true,
      },
    ],
    crates: [],
    fireboySpawn: { x: 50, y: 470 },
    watergirlSpawn: { x: 100, y: 470 },
    fireboyDoor: { id: "fd1", type: "fire", x: 750, y: 130 },
    watergirlDoor: { id: "wd1", type: "water", x: 840, y: 130 },
  },

  // LEVEL 2: Crate & Pressure Plates
  {
    id: 2,
    name: "Level 3: Pressure & Crates",
    description: "Push heavy wooden crates onto pressure buttons to keep doors and bridges open!",
    difficulty: "Hard",
    width: 1000,
    height: 600,
    platforms: [
      // Outer boundaries
      { x: 0, y: 0, w: 1000, h: 20 },
      { x: 0, y: 0, w: 20, h: 600 },
      { x: 980, y: 0, w: 20, h: 600 },
      { x: 0, y: 580, w: 1000, h: 20 },

      // Base floor
      { x: 20, y: 530, w: 320, h: 50 },
      { x: 440, y: 530, w: 540, h: 50 },

      // Mid floor
      { x: 20, y: 380, w: 420, h: 20 },
      { x: 520, y: 380, w: 460, h: 20 },

      // Top floor
      { x: 20, y: 220, w: 460, h: 20 },
      { x: 540, y: 220, w: 440, h: 20 },
    ],
    pools: [
      { id: "p1", type: "sludge", rect: { x: 340, y: 550, w: 100, h: 30 } },
      { id: "p2", type: "lava", rect: { x: 440, y: 360, w: 80, h: 20 } },
    ],
    gems: [
      { id: "g1", type: "fire", x: 390, y: 510 },
      { id: "g2", type: "water", x: 480, y: 330 },
      { id: "g3", type: "diamond", x: 500, y: 170 },
      { id: "g4", type: "fire", x: 100, y: 170 },
      { id: "g5", type: "water", x: 900, y: 170 },
    ],
    levers: [],
    buttons: [
      { id: "b1", x: 250, y: 370, targetId: "mp_bridge" },
    ],
    movingPlatforms: [
      {
        id: "mp_bridge",
        x: 440,
        y: 220,
        w: 100,
        h: 15,
        startX: 440,
        startY: 300,
        endX: 440,
        endY: 220,
        speed: 3,
        activeStateNeeded: true,
      },
    ],
    crates: [
      { id: "crate1", x: 150, y: 340, w: 35, h: 35 },
    ],
    fireboySpawn: { x: 50, y: 470 },
    watergirlSpawn: { x: 100, y: 470 },
    fireboyDoor: { id: "fd2", type: "fire", x: 750, y: 140 },
    watergirlDoor: { id: "wd2", type: "water", x: 840, y: 140 },
  },

  // LEVEL 3: The Gauntlet
  {
    id: 3,
    name: "Level 4: The Elemental Gauntlet",
    description: "The ultimate test of coordination! Synchronize movements across moving platforms and deadly pools.",
    difficulty: "Expert",
    width: 1000,
    height: 600,
    platforms: [
      { x: 0, y: 0, w: 1000, h: 20 },
      { x: 0, y: 0, w: 20, h: 600 },
      { x: 980, y: 0, w: 20, h: 600 },
      { x: 0, y: 580, w: 1000, h: 20 },

      // Bottom
      { x: 20, y: 530, w: 180, h: 50 },
      { x: 300, y: 530, w: 140, h: 50 },
      { x: 540, y: 530, w: 140, h: 50 },
      { x: 780, y: 530, w: 200, h: 50 },

      // Mid
      { x: 20, y: 370, w: 300, h: 20 },
      { x: 420, y: 370, w: 200, h: 20 },
      { x: 700, y: 370, w: 280, h: 20 },

      // Top
      { x: 20, y: 200, w: 960, h: 20 },
    ],
    pools: [
      { id: "p1", type: "lava", rect: { x: 200, y: 550, w: 100, h: 30 } },
      { id: "p2", type: "water", rect: { x: 440, y: 550, w: 100, h: 30 } },
      { id: "p3", type: "sludge", rect: { x: 680, y: 550, w: 100, h: 30 } },
      { id: "p4", type: "water", rect: { x: 320, y: 350, w: 100, h: 20 } },
      { id: "p5", type: "lava", rect: { x: 620, y: 350, w: 80, h: 20 } },
    ],
    gems: [
      { id: "g1", type: "fire", x: 250, y: 510 },
      { id: "g2", type: "water", x: 490, y: 510 },
      { id: "g3", type: "diamond", x: 730, y: 510 },
      { id: "g4", type: "fire", x: 660, y: 310 },
      { id: "g5", type: "water", x: 370, y: 310 },
      { id: "g6", type: "diamond", x: 500, y: 150 },
    ],
    levers: [
      { id: "l1", x: 880, y: 330, targetId: "mp_top" },
    ],
    buttons: [],
    movingPlatforms: [
      {
        id: "mp_top",
        x: 880,
        y: 200,
        w: 90,
        h: 15,
        startX: 880,
        startY: 370,
        endX: 880,
        endY: 200,
        speed: 2,
        activeStateNeeded: true,
      },
    ],
    crates: [],
    fireboySpawn: { x: 50, y: 470 },
    watergirlSpawn: { x: 100, y: 470 },
    fireboyDoor: { id: "fd3", type: "fire", x: 100, y: 120 },
    watergirlDoor: { id: "wd3", type: "water", x: 200, y: 120 },
  },
];
