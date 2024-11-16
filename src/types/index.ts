export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  passwordHash: string;
  rating: number;
  tokens: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  whitePlayerId: string;
  blackPlayerId?: string;
  result?: 'white' | 'black' | 'draw';
  pgn: string;
  startTime: Date;
  endTime?: Date;
  tokensPrize: number;
}

export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'win' | 'loss' | 'reward' | 'penalty';
  description: string;
  gameId?: string;
  createdAt: Date;
}