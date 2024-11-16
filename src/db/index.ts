import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { User, Game, TokenTransaction } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '../../data/echecs.db');

class DB {
  private static instance: DB;
  private db: any;

  private constructor() {}

  public static async getInstance(): Promise<DB> {
    if (!DB.instance) {
      DB.instance = new DB();
      DB.instance.db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });
      await DB.instance.db.run('PRAGMA foreign_keys = ON');
    }
    return DB.instance;
  }

  // User methods
  public async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = crypto.randomUUID();
    await this.db.run(
      `INSERT INTO users (id, username, email, phone, passwordHash, rating, tokens)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, user.username, user.email, user.phone, user.passwordHash, user.rating || 1200, user.tokens || 100]
    );
    return (await this.getUserById(id))!;
  }

  public async getUserById(id: string): Promise<User | null> {
    return this.db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    return this.db.get('SELECT * FROM users WHERE username = ?', [username]);
  }

  public async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = await this.getUserById(id);
    if (!user) return null;

    const fields = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'createdAt')
      .map(key => `${key} = ?`)
      .join(', ');

    const values = Object.keys(updates)
      .filter(key => key !== 'id' && key !== 'createdAt')
      .map(key => (updates as any)[key]);

    await this.db.run(
      `UPDATE users SET ${fields}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );

    return this.getUserById(id);
  }

  // Game methods
  public async createGame(game: Omit<Game, 'id'>): Promise<Game> {
    const id = crypto.randomUUID();
    await this.db.run(
      `INSERT INTO games (id, whitePlayerId, blackPlayerId, pgn, startTime, tokensPrize)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, game.whitePlayerId, game.blackPlayerId, game.pgn, game.startTime.toISOString(), game.tokensPrize]
    );
    return (await this.getGameById(id))!;
  }

  public async getGameById(id: string): Promise<Game | null> {
    const game = await this.db.get('SELECT * FROM games WHERE id = ?', [id]);
    if (game) {
      game.startTime = new Date(game.startTime);
      if (game.endTime) {
        game.endTime = new Date(game.endTime);
      }
    }
    return game;
  }

  public async getUserGames(userId: string): Promise<Game[]> {
    const games = await this.db.all(
      `SELECT * FROM games 
       WHERE whitePlayerId = ? OR blackPlayerId = ?
       ORDER BY startTime DESC`,
      [userId, userId]
    );
    return games.map(game => ({
      ...game,
      startTime: new Date(game.startTime),
      endTime: game.endTime ? new Date(game.endTime) : undefined
    }));
  }

  public async updateGame(id: string, updates: Partial<Game>): Promise<Game | null> {
    const game = await this.getGameById(id);
    if (!game) return null;

    const fields = Object.keys(updates)
      .filter(key => key !== 'id')
      .map(key => `${key} = ?`)
      .join(', ');

    const values = Object.keys(updates)
      .filter(key => key !== 'id')
      .map(key => (updates as any)[key]);

    await this.db.run(
      `UPDATE games SET ${fields} WHERE id = ?`,
      [...values, id]
    );

    return this.getGameById(id);
  }

  // Token transaction methods
  public async createTokenTransaction(
    transaction: Omit<TokenTransaction, 'id' | 'createdAt'>
  ): Promise<TokenTransaction> {
    const id = crypto.randomUUID();
    await this.db.run(
      `INSERT INTO token_transactions (id, userId, amount, type, description, gameId)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, transaction.userId, transaction.amount, transaction.type, transaction.description, transaction.gameId]
    );
    return (await this.getTokenTransactionById(id))!;
  }

  public async getTokenTransactionById(id: string): Promise<TokenTransaction | null> {
    const transaction = await this.db.get(
      'SELECT * FROM token_transactions WHERE id = ?',
      [id]
    );
    if (transaction) {
      transaction.createdAt = new Date(transaction.createdAt);
    }
    return transaction;
  }

  public async getUserTokenTransactions(userId: string): Promise<TokenTransaction[]> {
    const transactions = await this.db.all(
      `SELECT * FROM token_transactions 
       WHERE userId = ?
       ORDER BY createdAt DESC`,
      [userId]
    );
    return transactions.map(transaction => ({
      ...transaction,
      createdAt: new Date(transaction.createdAt)
    }));
  }
}

// Export a function to get the DB instance
export async function getDb(): Promise<DB> {
  return DB.getInstance();
}