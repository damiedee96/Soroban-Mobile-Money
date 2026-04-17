# API Reference

Base URL: `http://localhost:3000/api`

## Auth

### POST /auth/register
```json
{ "phone": "+254700000000", "name": "Jane Doe", "password": "secret" }
```
Response: `{ token, userId }`

### POST /auth/login
```json
{ "phone": "+254700000000", "password": "secret" }
```
Response: `{ token, userId, role }`

---

## Wallet

> Requires `Authorization: Bearer <token>`

### GET /wallet
Returns wallet address and balances.

### POST /wallet/create
Creates a new Stellar wallet for the authenticated user.

---

## Transactions

> Requires `Authorization: Bearer <token>`

### GET /transactions
Returns paginated transaction history. Query params: `limit`, `offset`.

### POST /transactions/send
```json
{ "receiverPhone": "+254711111111", "amount": "10", "currency": "XLM", "memo": "rent" }
```
Response: `{ txId, status: "pending" }`

### GET /transactions/:id
Returns a single transaction.

---

## Agents

> Requires `Authorization: Bearer <token>`

### POST /agents/register
```json
{ "businessName": "Mama Pesa", "location": "Nairobi CBD" }
```

### GET /agents/me
Returns agent profile.

### POST /agents/cash-in
```json
{ "userId": "<user-id>", "amount": "100", "currency": "XLM" }
```

### POST /agents/cash-out
```json
{ "userId": "<user-id>", "amount": "50", "currency": "XLM" }
```

---

## Merchants

> Requires `Authorization: Bearer <token>`

### POST /merchants/register
```json
{ "businessName": "Duka la Pesa" }
```
Response: `{ merchantId, qrCode }`

### GET /merchants/me
Returns merchant profile.
