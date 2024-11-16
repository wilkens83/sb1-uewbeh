import { db } from '../../db';
import type { User } from '../../types';
import { z } from 'zod';

const UserUpdateSchema = z.object({
  rating: z.number().optional(),
  tokens: z.number().optional(),
  gamesPlayed: z.number().optional(),
  wins: z.number().optional(),
  losses: z.number().optional(),
  draws: z.number().optional()
});

export class UserService {
  static async updateStats(userId: string, gameResult: 'win' | 'loss' | 'draw'): Promise<User | null> {
    const user = await db.getUserById(userId);
    if (!user) return null;

    const updates: z.infer<typeof UserUpdateSchema> = {
      gamesPlayed: user.gamesPlayed + 1
    };

    switch (gameResult) {
      case 'win':
        updates.wins = user.wins + 1;
        updates.rating = user.rating + 15;
        break;
      case 'loss':
        updates.losses = user.losses + 1;
        updates.rating = Math.max(100, user.rating - 15);
        break;
      case 'draw':
        updates.draws = user.draws + 1;
        updates.rating = user.rating + 5;
        break;
    }

    return db.updateUser(userId, updates);
  }

  static async awardDailyBonus(userId: string): Promise<void> {
    const DAILY_BONUS = 10;
    
    await db.createTokenTransaction({
      userId,
      amount: DAILY_BONUS,
      type: 'reward',
      description: 'Daily login bonus'
    });
  }
}