import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { StellarService } from '../services/stellar';

export const walletRouter = Router();
walletRouter.use(authenticate);

// GET /api/wallet — get wallet + balances
walletRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(
      `SELECT w.*, json_agg(json_build_object('currency', wb.currency, 'amount', wb.amount)) AS balances
       FROM wallets w
       LEFT JOIN wallet_balances wb ON wb.wallet_id = w.id
       WHERE w.user_id = $1
       GROUP BY w.id`,
      [req.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Wallet not found' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch wallet' });
  }
});

// POST /api/wallet/create — create wallet + Stellar keypair
walletRouter.post('/create', async (req: AuthRequest, res: Response) => {
  try {
    const existing = await db.query('SELECT id FROM wallets WHERE user_id = $1', [req.userId]);
    if (existing.rows.length > 0) {
      res.status(409).json({ success: false, error: 'Wallet already exists' });
      return;
    }
    const { publicKey } = StellarService.generateKeypair();
    const walletId = uuidv4();
    await db.query('INSERT INTO wallets (id, user_id, address) VALUES ($1, $2, $3)', [
      walletId, req.userId, publicKey,
    ]);
    await db.query(
      'INSERT INTO wallet_balances (wallet_id, currency, amount) VALUES ($1, $2, $3)',
      [walletId, 'XLM', '0']
    );
    await db.query('UPDATE users SET wallet_address = $1 WHERE id = $2', [publicKey, req.userId]);
    res.status(201).json({ success: true, data: { walletId, address: publicKey } });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to create wallet' });
  }
});
