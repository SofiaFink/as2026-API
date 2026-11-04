# AS2026 E-commerce Checkout API

REST API for a small checkout flow. It exposes four business endpoints — **Register**, **Login**, **Cart**, and **Checkout** — built with Express and an in-memory store. Paying with cash applies a 10% discount; paying with a credit card does not.

## How to install

Requirements: Node.js 18 or later.

```bash
npm install
```

## How to run

```bash
npm start
```

The server listens on [http://localhost:3000](http://localhost:3000). Data lives in process memory and resets every time the process restarts.

## Test data

All seeded users share the password `Password123!`.

### Users

| ID | Name | Email |
| --- | --- | --- |
| 1 | Alice Rivera | alice@shop.test |
| 2 | Bob Chen | bob@shop.test |
| 3 | Carol Diaz | carol@shop.test |

### Products

| ID | Name | Price |
| --- | --- | --- |
| 1 | Wireless Headphones | 100 |
| 2 | USB-C Cable | 15 |
| 3 | Ceramic Coffee Mug | 20 |

### Example flow

```bash
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"email\":\"alice@shop.test\",\"password\":\"Password123!\"}"
```

Use the returned `token` as `Authorization: Bearer <token>`:

```bash
curl -X POST http://localhost:3000/cart -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d "{\"items\":[{\"productId\":1,\"quantity\":1},{\"productId\":2,\"quantity\":2}]}"

curl -X POST http://localhost:3000/checkout -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d "{\"paymentMethod\":\"cash\"}"
```

For that cart the subtotal is `100 + 15 * 2 = 130`. Cash checkout totals `117`. Credit card checkout totals `130`.

## Business rules

- Register requires a name, a valid email, and a password of at least 8 characters. Duplicate emails are rejected.
- Login returns a JWT. Cart and Checkout require `Authorization: Bearer <token>`.
- Cart replaces the authenticated user's cart with the given product list. Unknown product IDs are rejected.
- Checkout requires `paymentMethod` of `cash` or `credit_card`. An empty cart cannot be checked out.
- **Cash** applies a **10% discount** on the cart subtotal.
- **Credit card** applies **no discount**.
- A successful checkout empties the user's cart.

## Important URLs

| URL | Description |
| --- | --- |
| http://localhost:3000/register | Register a user (`POST`) |
| http://localhost:3000/login | Log in (`POST`) |
| http://localhost:3000/cart | Set the cart (`POST`, authenticated) |
| http://localhost:3000/checkout | Complete checkout (`POST`, authenticated) |
| http://localhost:3000/swagger.yaml | OpenAPI YAML specification |
| http://localhost:3000/docs | Swagger UI rendering of the YAML spec |
| http://localhost:3000/health | Process health check |
