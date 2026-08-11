import { Router } from "express";
import { roomStore } from "../../game-state/roomStore.js";

const router = Router();

const inMemoryUsers: Record<string, any> = {
  "demo-user": {
    _id: "demo-user",
    username: "Player 1",
    email: "player1@example.com",
    profilePicture: "profile-pictures/bear.png",
    totalGames: 12,
    totalWins: 8,
    highScore: 4500,
  },
};

router.get("/", (_req, res) => {
  res.json(Object.values(inMemoryUsers));
});

router.post("/login", (req, res) => {
  const { email, username, profilePicture } = req.body;
  const cleanEmail = (email || `guest_${Date.now()}@fireboywatergirl.io`).toLowerCase();
  const cleanUsername = username || cleanEmail.split("@")[0] || "Explorer";

  if (!inMemoryUsers[cleanEmail]) {
    inMemoryUsers[cleanEmail] = {
      _id: `user_${Date.now()}`,
      username: cleanUsername,
      email: cleanEmail,
      profilePicture: profilePicture || "profile-pictures/bear.png",
      totalGames: 0,
      totalWins: 0,
      highScore: 0,
    };
  }

  const user = inMemoryUsers[cleanEmail];
  // Simple jwt generator without external dependency for frictionless setup
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ email: user.email, username: user.username, sub: user._id }));
  const token = `${header}.${payload}.signature`;

  res.json({ token, user });
});

router.get("/leaderboard", (_req, res) => {
  res.json(roomStore.getLeaderboard());
});

router.get("/:email", (req, res) => {
  const email = req.params.email.toLowerCase();
  const user = inMemoryUsers[email] || Object.values(inMemoryUsers).find((u) => u._id === req.params.email);

  if (!user) {
    res.json({
      _id: `user_${Date.now()}`,
      username: email.split("@")[0] || "Player",
      email: email,
      profilePicture: "profile-pictures/bear.png",
      totalGames: 0,
      totalWins: 0,
      highScore: 0,
    });
    return;
  }

  res.json(user);
});

export default router;