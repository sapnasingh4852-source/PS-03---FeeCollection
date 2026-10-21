# FeeFlow backend

Express 5 + Mongoose JSON API for the Fee Collection & Receipt Management System.

## Run

```bash
npm install
cp .env.example .env   # JWT_SECRET
npm start              # http://localhost:3000
```

Requires MongoDB running at `mongodb://127.0.0.1:27017/feeDB` (see `config/db.js`).

## Structure

| File | Purpose |
| --- | --- |
| `app.js` | express app, global middleware (cors, logger), route mounting |
| `config/db.js` | mongoose connection |
| `models/User.js` | student/admin (roll no + course for students) |
| `models/FeeStructure.js` | fee head per course with due date and late fee/day |
| `models/Payment.js` | payment with mode, date, transaction ref, unique receipt no |
| `controllers/` | one object-style controller per resource |
| `routes/` | one router per resource; JWT via `middleware/authHandler.js` |
| `middleware/authHandler.js` | `authHandler` (JWT verify) + `adminOnly` (role check) |
| `middleware/logger.js` | appends every request to `logs/data.txt` |
| `utils/helpers.js` | `computeSummary` (payable/late fee/paid/pending/status) + `generateReceiptNo` |

All protected routes send `Authorization: Bearer <token>`; the token comes from
`POST /api/auth/login` / `POST /api/auth/register`.

Payment rules enforced in `controllers/paymentController.js`: amount must be
greater than zero and not more than the student's pending fee; the receipt
number `RCP-<year>-<sequence>` is generated automatically.
