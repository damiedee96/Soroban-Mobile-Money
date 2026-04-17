import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { calculateFee } from '@soroban-mm/shared';
import { StellarService } from '../services/stellar';

export const transactionRouter = Router();
transactionRouter.use(authenticate);

// GET /api/transactions — list user transactions
transactionRouter.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const result = await db.query(
      `SELECT * FROM transactions
       WHERE sender_id = $1 OR receiver_id = $1
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [req.userId, limit, offset]
    );
    res.json({ success: true, data: result.rows });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
});

// POST /api/transactions/send — P2P transfer
transactionRouter.post('/send', async (req: AuthRequest, res: Response) => {
  try {
    const { receiverPhone, amount, currency = 'XLM', memo } = req.body;
    if (!receiverPhone || !amount) {
      res.status(400).json({ success: false, error: 'receiverPhone and amount are required' });
      return;
    }
    const receiver = await db.query('SELECT id, wallet_address FROM users WHERE phone = $1', [receiverPhone]);
    if (receiver.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Receiver not found' });
      return;
    }
    const fee = calculateFee(parseFloat(amount));
    const txId = uuidv4();
    await db.query(
      `INSERT INTO transactions (id, type, status, sender_id, receiver_id, amount, currency, fee, memo)
       VALUES ($1, 'send', 'pending', $2, $3, $4, $5, $6, $7)`,
      [txId, req.userId, receiver.rows[0].id, amount, currency, fee.toString(), memo || null]
    );
    // Submit to Stellar (async)
    StellarService.submitPayment({
      senderId: req.userId!,
      receiverAddress: receiver.rows[0].wallet_address,
      amount,
      currency,
      memo,
    }).then(async (hash) => {
      await db.query(
        'UPDATE transactions SET status = $1, stellar_tx_hash = $2, updated_at = NOW() WHERE id = $3',
        ['completed', hash, txId]
      );
    }).catch(async () => {
      await db.query(
        "UPDATE transactions SET status = 'failed', updated_at = NOW() WHERE id = $1",
        [txId]
      );
    });
    res.status(202).json({ success: true, data: { txId, status: 'pending' } });
  } catch {
    res.status(500).json({ success: false, error: 'Transaction failed' });
  }
});

// GET /api/transactions/:id
transactionRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query(
      'SELECT * FROM transactions WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)',
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Transaction not found' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch transaction' });
  }
});
