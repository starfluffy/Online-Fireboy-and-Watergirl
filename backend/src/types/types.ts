export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  totalGames?: number;
  totalPoints?: number;
  highScore?: number;
  totalWins?: number;
}

export interface Phrase {
  _id: string;
  phrase: string;
}