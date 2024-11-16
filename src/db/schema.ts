import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  phone: z.string(),
  passwordHash: z.string(),
  rating: z.number().default(1200),
  tokens: z.number().default(100),
  gamesPlayed: z.number().default(0),
  wins: z.number().default(0),
  losses: z.number().default(0),
  draws: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const GameSchema = z.object({
  id: z.string(),
  whitePlayerId: z.string(),
  blackPlayerId: z.string(),
  result: z.enum(['white', 'black', 'draw']).optional(),
  pgn: z.string(),
  startTime: z.date(),
  endTime: z.date().optional(),
  tokensPrize: z.number().default(0)
});

export const TokenTransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number(),
  type: z.enum(['win', 'loss', 'reward', 'penalty']),
  description: z.string(),
  gameId: z.string().optional(),
  createdAt: z.date()
});

export type User = z.infer<typeof UserSchema>;
export type Game = z.infer<typeof GameSchema>;
export type TokenTransaction = z.infer<typeof TokenTransactionSchema>;