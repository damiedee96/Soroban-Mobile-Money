import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';

export const authRouter = Router();

// POST /api/auth/register
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { phone, name, password, role = 'user' } = req.body;
    if (!phone || !name || !password) {
      res.status(400).json({ success: false, error: 'phone, name, and password are required' });
      return;
    }
    const existing = await db.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length > 0) {
      res.status(409).json({ success: false, error: 'Phone already registered' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    await db.query(
      'INSERT INTO users (id, phone, name, password_hash, role) VALUES ($1, $2, $3, $4, $5)',
      [userId, phone, name, passwordHash, role]
    );
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    res.status(201).json({ success: true, data: { token, userId } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// POST /api/auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    const result = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    res.json({ success: true, data: { token, userId: user.id, role: user.role } });
  } catch {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});
