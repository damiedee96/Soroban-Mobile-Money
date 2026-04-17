import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../db';

export const agentRouter = Router();
agentRouter.use(authenticate);

// POST /api/agents/register
agentRouter.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { businessName, location } = req.body;
    if (!businessName) {
      res.status(400).json({ success: false, error: 'businessName is required' });
      return;
    }
    const agentId = uuidv4();
    await db.query(
      'INSERT INTO agents (id, user_id, business_name, location) VALUES ($1, $2, $3, $4)',
      [agentId, req.userId, businessName, location]
    );
    await db.query("UPDATE users SET role = 'agent' WHERE id = $1", [req.userId]);
    res.status(201).json({ success: true, data: { agentId } });
  } catch {
    res.status(500).json({ success: false, error: 'Agent registration failed' });
  }
});

// GET /api/agents/me
agentRouter.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM agents WHERE user_id = $1', [req.userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Agent profile not found' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch agent' });
  }
});

// POST /api/agents/cash-in
agentRouter.post('/cash-in', async (req: AuthRequest, res: Response) => {
  try {
    const { userId, amount, currency = 'XLM' } = req.body;
    // TODO: integrate with mobile money API for actual cash-in
    const txId = uuidv4();
    await db.query(
      `INSERT INTO transactions (id, type, status, sender_id, receiver_id, amount, currency, fee)
       VALUES ($1, 'cash_in', 'completed', $2, $3, $4, $5, 0)`,
      [txId, req.userId, userId, amount, currency]
    );
    res.status(201).json({ success: true, data: { txId } });
  } catch {
    res.status(500).json({ success: false, error: 'Cash-in failed' });
  }
});

// POST /api/agents/cash-out
agentRouter.post('/cash-out', async (req: AuthRequest, res: Response) => {
  try {
    const { userId, amount, currency = 'XLM' } = req.body;
    // TODO: integrate with mobile money API for actual cash-out
    const txId = uuidv4();
    await db.query(
      `INSERT INTO transactions (id, type, status, sender_id, receiver_id, amount, currency, fee)
       VALUES ($1, 'cash_out', 'completed', $2, $3, $4, $5, 0)`,
      [txId, userId, req.userId, amount, currency]
    );
    res.status(201).json({ success: true, data: { txId } });
  } catch {
    res.status(500).json({ success: false, error: 'Cash-out failed' });
  }
});
