import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { walletRouter } from './routes/wallet';
import { transactionRouter } from './routes/transactions';
import { agentRouter } from './routes/agents';
import { merchantRouter } from './routes/merchants';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/agents', agentRouter);
app.use('/api/merchants', merchantRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Soroban Mobile Money API running on port ${PORT}`);
});

export default app;
