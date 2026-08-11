import type { User } from "../types/types.js";

const users: User[] = [
  {
    _id: "demo-user",
    username: "Player One",
    email: "player@example.com",
    profilePicture: "profile-pictures/bear.png",
    totalGames: 0,
    totalPoints: 0,
    highScore: 0,
    totalWins: 0,
  },
];

export default users;