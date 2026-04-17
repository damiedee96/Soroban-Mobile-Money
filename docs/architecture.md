# Architecture Overview

## System Components

```
┌─────────────────────────────────────────────────────┐
│                  Mobile App (React Native)           │
│  Auth | Wallet | Send | Transactions | Agents        │
└──────────────────────┬──────────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────────┐
│               Backend API (Node.js/Express)          │
│  /auth  /wallet  /transactions  /agents  /merchants  │
└──────────────────────┬──────────────────────────────┘
          ┌────────────┴────────────┐
          │                         │
┌─────────▼──────────┐   ┌─────────▼──────────┐
│   PostgreSQL DB     │   │  Stellar Network    │
│  Users, Wallets,    │   │  Horizon API        │
│  Transactions       │   │  Soroban RPC        │
└────────────────────┘   └─────────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │  Smart Contracts     │
                         │  wallet.wasm         │
                         │  payment.wasm        │
                         └─────────────────────┘
```

## Data Flow: P2P Payment

1. User submits send request via mobile app
2. Backend validates request and creates a `pending` transaction record
3. Backend calls `StellarService.submitPayment()` asynchronously
4. Stellar transaction is signed and submitted to Horizon
5. On success, transaction record updated to `completed` with `stellar_tx_hash`
6. On failure, transaction record updated to `failed`

## Authentication

- Phone + password registration
- JWT tokens (7-day expiry)
- Role-based access: `user`, `merchant`, `agent`, `admin`

## Smart Contracts

| Contract | Purpose |
|----------|---------|
| `wallet` | On-chain balance tracking, deposit/withdraw |
| `payment` | Immutable payment record on Soroban ledger |
