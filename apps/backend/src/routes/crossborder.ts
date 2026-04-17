import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../db';
import { calculateFee } from '@soroban-mm/shared';
import { convertAmount, getRate } from '../services/conversion';

export const crossBorderRouter = Router();
crossBorderRouter.use(authenticate);

// GET /api/crossborder/rates — get supported exchange rates
crossBorderRouter.get('/rates', (_req, res) => {
  const pairs = ['XLM_USD', 'XLM_KES', 'XLM_GHS', 'XLM_NGN', 'XLM_TZS', 'USDC_USD', 'USDC_KES'];
  const rates: Record<string, number> = {};
  pairs.forEach((p) => {
    const [from, to] = p.split('_');
    try { rates[p] = getRate(from, to); } catch { /* skip */ }
  });
  res.json({ success: true, data: rates });
});

// POST /api/crossborder/send — cross-border transfer with conversion
crossBorderRouter.post('/send', async (req: AuthRequest, res: Response) => {
  try {
    const { receiverPhone, amount, fromCurrency, toCurrency, memo } = req.body;
    if (!receiverPhone || !amount || !fromCurrency || !toCurrency) {
      res.status(400).json({ success: false, error: 'receiverPhone, amount, fromCurrency, toCurrency required' });
      return;
    }
    const receiver = await db.query('SELECT id FROM users WHERE phone = $1', [receiverPhone]);
    if (receiver.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Receiver not found' });
      return;
    }
    const convertedAmount = convertAmount(parseFloat(amount), fromCurrency, toCurrency);
    const fee = calculateFee(parseFloat(amount), true); // cross-border fee
    const txId = uuidv4();
    await db.query(
      `INSERT INTO transactions (id, type, status, sender_id, receiver_id, amount, currency, fee, memo)
       VALUES ($1, 'cross_border', 'pending', $2, $3, $4, $5, $6, $7)`,
      [txId, req.userId, receiver.rows[0].id, convertedAmount.toString(), toCurrency, fee.toString(), memo || null]
    );
    res.status(202).json({
      success: true,
      data: {
        txId,
        status: 'pending',
        sentAmount: amount,
        fromCurrency,
        receivedAmount: convertedAmount,
        toCurrency,
        fee,
      },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Cross-border transfer failed' });
  }
});
