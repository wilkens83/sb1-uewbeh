import { Router } from 'express';
import { getDb } from '../../db';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const CreateTransactionSchema = z.object({
  amount: z.number(),
  type: z.enum(['win', 'loss', 'reward', 'penalty']),
  description: z.string(),
  gameId: z.string().optional()
});

router.use(authMiddleware);

router.post('/transactions', async (req, res) => {
  try {
    const data = CreateTransactionSchema.parse(req.body);
    const userId = (req as any).userId;
    const db = await getDb();

    const transaction = await db.createTokenTransaction({
      userId,
      ...data
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: 'Invalid transaction data' });
  }
});

router.get('/transactions', async (req, res) => {
  const userId = (req as any).userId;
  const db = await getDb();
  const transactions = await db.getUserTokenTransactions(userId);
  res.json(transactions);
});

router.get('/balance', async (req, res) => {
  const userId = (req as any).userId;
  const db = await getDb();
  const user = await db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ balance: user.tokens });
});

export const tokenRouter = router;