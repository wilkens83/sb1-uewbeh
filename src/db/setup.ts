import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbDir = join(__dirname, '../../data');
const dbPath = join(dbDir, 'echecs.db');

async function setupDatabase() {
  try {
    // Ensure the data directory exists
    await fs.mkdir(dbDir, { recursive: true });
    console.log('Data directory ready:', dbDir);

    // Create or connect to the database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Enable foreign keys and create tables
    await db.exec('PRAGMA foreign_keys = ON');

    // Users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        passwordHash TEXT NOT NULL,
        rating INTEGER DEFAULT 1200,
        tokens INTEGER DEFAULT 100,
        gamesPlayed INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        draws INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Games table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS games (
        id TEXT PRIMARY KEY,
        whitePlayerId TEXT NOT NULL,
        blackPlayerId TEXT,
        result TEXT CHECK(result IN ('white', 'black', 'draw')),
        pgn TEXT NOT NULL DEFAULT '',
        startTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        endTime DATETIME,
        tokensPrize INTEGER DEFAULT 0,
        FOREIGN KEY (whitePlayerId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (blackPlayerId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Token transactions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS token_transactions (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        amount INTEGER NOT NULL,
        type TEXT CHECK(type IN ('win', 'loss', 'reward', 'penalty')) NOT NULL,
        description TEXT NOT NULL,
        gameId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (gameId) REFERENCES games(id) ON DELETE SET NULL
      )
    `);

    // Create indexes
    await db.exec('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
    await db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await db.exec('CREATE INDEX IF NOT EXISTS idx_games_players ON games(whitePlayerId, blackPlayerId)');
    await db.exec('CREATE INDEX IF NOT EXISTS idx_token_transactions_user ON token_transactions(userId)');

    // Close the database connection
    await db.close();
    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase().catch(console.error);