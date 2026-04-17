import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth';
import { db } from '../db';

export const merchantRouter = Router();
merchantRouter.use(authenticate);

// POST /api/merchants/register
merchantRouter.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { businessName } = req.body;
    if (!businessName) {
      res.status(400).json({ success: false, error: 'businessName is required' });
      return;
    }
    const merchantId = uuidv4();
    const qrCode = `smm://pay/${req.userId}`;
    await db.query(
      'INSERT INTO merchants (id, user_id, business_name, qr_code) VALUES ($1, $2, $3, $4)',
      [merchantId, req.userId, businessName, qrCode]
    );
    await db.query("UPDATE users SET role = 'merchant' WHERE id = $1", [req.userId]);
    res.status(201).json({ success: true, data: { merchantId, qrCode } });
  } catch {
    res.status(500).json({ success: false, error: 'Merchant registration failed' });
  }
});

// GET /api/merchants/me
merchantRouter.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM merchants WHERE user_id = $1', [req.userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, error: 'Merchant profile not found' });
      return;
    }
    res.json({ success: true, data: result.rows[0] });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch merchant' });
  }
});
