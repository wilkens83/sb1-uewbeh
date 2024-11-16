import type { Server, Socket } from 'socket.io';
import { db } from '../db';

interface GameState {
  gameId: string;
  whitePlayer: string;
  blackPlayer?: string;
  pgn: string;
  currentTurn: 'w' | 'b';
}

const games = new Map<string, GameState>();

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_game', (gameId: string, userId: string) => {
      const game = db.getGameById(gameId);
      if (!game) {
        socket.emit('error', 'Game not found');
        return;
      }

      socket.join(gameId);
      
      if (!games.has(gameId)) {
        games.set(gameId, {
          gameId,
          whitePlayer: game.whitePlayerId,
          blackPlayer: game.blackPlayerId,
          pgn: game.pgn,
          currentTurn: 'w'
        });
      }

      socket.emit('game_state', games.get(gameId));
    });

    socket.on('make_move', (gameId: string, userId: string, move: string) => {
      const gameState = games.get(gameId);
      if (!gameState) {
        socket.emit('error', 'Game not found');
        return;
      }

      const isWhite = gameState.whitePlayer === userId;
      const isBlack = gameState.blackPlayer === userId;

      if (!isWhite && !isBlack) {
        socket.emit('error', 'Not a player in this game');
        return;
      }

      if ((gameState.currentTurn === 'w' && !isWhite) || 
          (gameState.currentTurn === 'b' && !isBlack)) {
        socket.emit('error', 'Not your turn');
        return;
      }

      // Update game state
      gameState.pgn += ' ' + move;
      gameState.currentTurn = gameState.currentTurn === 'w' ? 'b' : 'w';
      games.set(gameId, gameState);

      // Broadcast the move to all players in the game
      io.to(gameId).emit('move_made', {
        move,
        currentTurn: gameState.currentTurn
      });

      // Update the database
      db.updateGame(gameId, { pgn: gameState.pgn });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}