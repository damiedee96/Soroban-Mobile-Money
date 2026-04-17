# Soroban Mobile Money

A blockchain-enabled mobile payment platform built on the Soroban (Stellar) ecosystem, designed for fast, low-cost, and accessible financial transactions — especially in emerging markets.

## Overview

Soroban Mobile Money bridges traditional mobile money systems with decentralized infrastructure, enabling users to send, receive, store, and manage funds across both fiat and digital currencies.

## Monorepo Structure

```
soroban-mobile-money/
├── apps/
│   ├── mobile/          # React Native mobile app
│   └── backend/         # Node.js REST API
├── contracts/           # Soroban smart contracts (Rust)
├── packages/
│   └── shared/          # Shared types, utilities, constants
└── docs/                # Architecture and API documentation
```

## Tech Stack

- **Frontend**: React Native (iOS & Android)
- **Backend**: Node.js + Express
- **Blockchain**: Soroban (Stellar smart contracts in Rust)
- **Database**: PostgreSQL
- **Infrastructure**: AWS / GCP

## Getting Started

### Prerequisites

- Node.js >= 18
- Rust + Cargo
- Stellar CLI (`stellar`)
- React Native environment (Android Studio / Xcode)

### Install Dependencies

```bash
# Install backend dependencies
cd apps/backend && npm install

# Install mobile dependencies
cd apps/mobile && npm install

# Build shared package
cd packages/shared && npm install && npm run build
```

### Environment Setup

Copy `.env.example` to `.env` in each app directory and fill in the required values.

### Run Backend

```bash
cd apps/backend
npm run dev
```

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
```

## Implementation Phases

| Phase | Features |
|-------|----------|
| 1 | Core Wallet & P2P Payments |
| 2 | Merchant & Agent Network |
| 3 | Cross-Border Transfers |
| 4 | Analytics, Reporting & SDK |

## License

MIT
