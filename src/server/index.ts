import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { db } from '../db';
import { authRouter } from './routes/auth';
import { gameRouter } from './routes/games';
import { userRouter } from './routes/users';
import { tokenRouter } from './routes/tokens';
import { setupSocketHandlers } from './socket';

async function startServer() {
  try {
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? 'https://echecs.stackblitz.io' 
          : 'http://localhost:5173',
        methods: ['GET', 'POST']
      }
    });

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Health check
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    // Routes
    app.use('/api/auth', authRouter);
    app.use('/api/games', gameRouter);
    app.use('/api/users', userRouter);
    app.use('/api/tokens', tokenRouter);

    // Error handling
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Something broke!' });
    });

    // Socket.io setup
    setupSocketHandlers(io);

    const PORT = process.env.PORT || 3000;

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch(console.error);