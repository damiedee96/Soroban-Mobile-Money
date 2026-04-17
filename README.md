# Soroban Mobile Money

A blockchain-enabled mobile payment platform built on the Soroban (Stellar) ecosystem, designed for fast, low-cost, and accessible financial transactions — especially in emerging markets.

## Overview

Soroban Mobile Money bridges traditional mobile money systems with decentralized infrastructure, enabling users to send, receive, store, and manage funds across both fiat and digital currencies.

## Monorepo Structure

```
soroban-mobile-money/
├── apps/
│   ├── frontend/        # React + Vite web dashboard (Tailwind CSS)
│   ├── backend/         # Node.js REST API (Express + TypeScript)
│   └── mobile/          # React Native mobile app (iOS & Android)
├── contracts/
│   ├── wallet/          # Soroban wallet smart contract (Rust)
│   └── payment/         # Soroban payment smart contract (Rust)
├── packages/
│   └── shared/          # Shared TypeScript types, utilities, constants
└── docs/                # Architecture and API documentation
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Mobile App | React Native 0.73 |
| Backend API | Node.js, Express, TypeScript |
| Blockchain | Soroban (Stellar smart contracts in Rust) |
| Database | PostgreSQL |
| Auth | JWT (phone + password) |
| State | Zustand |

## Features

- Mobile wallet with Stellar keypair generation
- P2P money transfers (XLM / USDC)
- Cross-border transfers with live FX rates
- Agent cash-in / cash-out network
- Merchant QR payment portal
- Transaction history with status tracking
- Dashboard with charts and analytics

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- Rust + Cargo (for smart contracts)
- Stellar CLI (`stellar`)

### Install Dependencies

```bash
npm install
```

### Environment Setup

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env   # optional
```

Fill in your DB credentials and Stellar keys in `apps/backend/.env`.

### Run Database Migration

```bash
psql -d your_database -f apps/backend/src/db/migrations/001_initial.sql
```

### Start Backend

```bash
cd apps/backend && npm run dev
```

### Start Web Frontend

```bash
cd apps/frontend && npm run dev
```

Open http://localhost:5173

### Run Mobile App

```bash
cd apps/mobile
npx react-native run-android
# or
npx react-native run-ios
```

### Deploy Smart Contracts

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/wallet.wasm
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/payment.wasm
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/wallet | Get wallet + balances |
| POST | /api/wallet/create | Create Stellar wallet |
| GET | /api/transactions | List transactions |
| POST | /api/transactions/send | P2P transfer |
| POST | /api/crossborder/send | Cross-border transfer |
| GET | /api/crossborder/rates | Exchange rates |
| POST | /api/agents/register | Register as agent |
| POST | /api/agents/cash-in | Agent cash-in |
| POST | /api/agents/cash-out | Agent cash-out |
| POST | /api/merchants/register | Register as merchant |

See [docs/api.md](docs/api.md) for full reference.

## Implementation Phases

| Phase | Features | Status |
|-------|----------|--------|
| 1 | Core Wallet & P2P Payments | ✅ Scaffolded |
| 2 | Merchant & Agent Network | ✅ Scaffolded |
| 3 | Cross-Border Transfers | ✅ Scaffolded |
| 4 | Analytics, Reporting & SDK | 🔜 Planned |

## License

MIT
