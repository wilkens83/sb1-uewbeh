import { db } from '../../db';
import type { Game } from '../../types';

export class GameService {
  static async createGame(whitePlayerId: string, tokensPrize: number = 0): Promise<Game> {
    // Verify user has enough tokens
    const user = await db.getUserById(whitePlayerId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.tokens < tokensPrize) {
      throw new Error('Insufficient tokens');
    }

    // Create game
    const game = await db.createGame({
      whitePlayerId,
      pgn: '',
      startTime: new Date(),
      tokensPrize
    });

    // Lock tokens if there's a prize
    if (tokensPrize > 0) {
      await db.createTokenTransaction({
        userId: whitePlayerId,
        amount: -tokensPrize,
        type: 'penalty',
        description: 'Token stake for game',
        gameId: game.id
      });
    }

    return game;
  }

  static async joinGame(gameId: string, blackPlayerId: string): Promise<Game> {
    const game = await db.getGameById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    if (game.blackPlayerId) {
      throw new Error('Game already has a black player');
    }
    if (game.whitePlayerId === blackPlayerId) {
      throw new Error('Cannot play against yourself');
    }

    // Verify user has enough tokens if there's a prize
    if (game.tokensPrize > 0) {
      const user = await db.getUserById(blackPlayerId);
      if (!user || user.tokens < game.tokensPrize) {
        throw new Error('Insufficient tokens');
      }

      // Lock tokens
      await db.createTokenTransaction({
        userId: blackPlayerId,
        amount: -game.tokensPrize,
        type: 'penalty',
        description: 'Token stake for game',
        gameId
      });
    }

    return db.updateGame(gameId, { blackPlayerId });
  }

  static async endGame(gameId: string, result: 'white' | 'black' | 'draw'): Promise<void> {
    const game = await db.getGameById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    // Update game result
    await db.updateGame(gameId, {
      result,
      endTime: new Date()
    });

    // Handle token distribution if there was a prize
    if (game.tokensPrize > 0) {
      const totalPrize = game.tokensPrize * 2;
      
      if (result === 'draw') {
        // Return stakes to both players
        await db.createTokenTransaction({
          userId: game.whitePlayerId,
          amount: game.tokensPrize,
          type: 'reward',
          description: 'Returned stake from drawn game',
          gameId
        });
        await db.createTokenTransaction({
          userId: game.blackPlayerId!,
          amount: game.tokensPrize,
          type: 'reward',
          description: 'Returned stake from drawn game',
          gameId
        });
      } else {
        // Award total prize to winner
        const winnerId = result === 'white' ? game.whitePlayerId : game.blackPlayerId;
        await db.createTokenTransaction({
          userId: winnerId!,
          amount: totalPrize,
          type: 'win',
          description: 'Won game prize',
          gameId
        });
      }
    }
  }
}