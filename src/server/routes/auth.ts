import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../../db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const RegisterSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  phone: z.string(),
  password: z.string().min(8)
});

const LoginSchema = z.object({
  username: z.string(),
  password: z.string()
});

router.post('/register', async (req, res) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const db = await getDb();
    
    // Check if user already exists
    const existingUser = await db.getUserByUsername(data.username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Create user
    const user = await db.createUser({
      username: data.username,
      email: data.email,
      phone: data.phone,
      passwordHash,
      rating: 1200,
      tokens: 100
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        rating: user.rating,
        tokens: user.tokens
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = LoginSchema.parse(req.body);
    const db = await getDb();
    
    // Find user
    const user = await db.getUserByUsername(data.username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        rating: user.rating,
        tokens: user.tokens
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Login failed' });
    }
  }
});

export const authRouter = router;