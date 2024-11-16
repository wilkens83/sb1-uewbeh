import { Router } from 'express';
import { getDb } from '../../db';
import { z } from 'zod';

const router = Router();

const CreateUserSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  phone: z.string(),
  passwordHash: z.string()
});

const UpdateUserSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  rating: z.number().optional(),
  tokens: z.number().optional()
});

router.post('/', async (req, res) => {
  try {
    const data = CreateUserSchema.parse(req.body);
    const db = await getDb();
    const user = await db.createUser(data);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid user data' });
  }
});

router.get('/:id', async (req, res) => {
  const db = await getDb();
  const user = await db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

router.patch('/:id', async (req, res) => {
  try {
    const data = UpdateUserSchema.parse(req.body);
    const db = await getDb();
    const user = await db.updateUser(req.params.id, data);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid update data' });
  }
});

export const userRouter = router;