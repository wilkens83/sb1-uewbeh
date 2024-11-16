import { create } from 'zustand';
import type { User } from '../types';

interface GameState {
  gameId: string | null;
  whitePlayer: User | null;
  blackPlayer: User | null;
  currentTurn: 'w' | 'b';
  isSpectator: boolean;
  playerColor: 'white' | 'black' | null;
  setGameId: (id: string) => void;
  setPlayers: (white: User | null, black: User | null) => void;
  setPlayerColor: (color: 'white' | 'black' | null) => void;
  setCurrentTurn: (turn: 'w' | 'b') => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameId: null,
  whitePlayer: null,
  blackPlayer: null,
  currentTurn: 'w',
  isSpectator: false,
  playerColor: null,
  
  setGameId: (id) => set({ gameId: id }),
  
  setPlayers: (white, black) => set({ whitePlayer: white, blackPlayer: black }),
  
  setPlayerColor: (color) => set({ playerColor: color }),
  
  setCurrentTurn: (turn) => set({ currentTurn: turn }),
  
  resetGame: () => set({
    gameId: null,
    whitePlayer: null,
    blackPlayer: null,
    currentTurn: 'w',
    isSpectator: false,
    playerColor: null
  })
}));