import { Router } from 'express';
import { getDb } from '../../db';
import { z } from 'zod';

const router = Router();

const CreateGameSchema = z.object({
  whitePlayerId: z.string(),
  blackPlayerId: z.string().optional(),
  tokensPrize: z.number().default(0)
});

router.post('/', async (req, res) => {
  try {
    const data = CreateGameSchema.parse(req.body);
    const db = await getDb();
    const game = await db.createGame({
      whitePlayerId: data.whitePlayerId,
      blackPlayerId: data.blackPlayerId,
      pgn: '',
      startTime: new Date(),
      tokensPrize: data.tokensPrize
    });
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ error: 'Invalid game data' });
  }
});

router.get('/:id', async (req, res) => {
  const db = await getDb();
  const game = await db.getGameById(req.params.id);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  res.json(game);
});

router.get('/user/:userId', async (req, res) => {
  const db = await getDb();
  const games = await db.getUserGames(req.params.userId);
  res.json(games);
});

export const gameRouter = router;