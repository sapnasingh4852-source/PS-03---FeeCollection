# FeeFlow frontend

React (Vite) client for the FeeFlow backend, in the Lect-31 style: `App.jsx`
holds the `BrowserRouter`, the navbar (`Link`s that change with the role) and
all `Route`s; each page is a small component in `src/components/` that calls
`fetch('/api/...')` directly with the Bearer token from `localStorage`.
Vite proxies `/api` to the backend on port 3000.

## Run

```bash
npm install
npm run dev     # http://localhost:5173
```

The backend must be running on port 3000 (`cd ../backend && npm start`).

## Pages → API

| React route | API used |
| --- | --- |
| `/login` | `POST /api/auth/login` |
| `/register` | `POST /api/auth/register` |
| `/admin/dashboard` | `GET /api/dashboard` |
| `/admin/fees` | `GET/DELETE /api/fees(/:id)` |
| `/admin/fees/new` | `POST /api/fees` |
| `/admin/fees/:id/edit` | `GET /api/fees` + `PUT /api/fees/:id` |
| `/admin/payments/new` | `GET /api/students`, `GET /api/students/:id/fees`, `POST /api/payments` |
| `/admin/students/:id/fees` | `GET /api/students/:id/fees` |
| `/my-fees` | `GET /api/students/:id/fees` (own id from `localStorage`) |
| `/receipts/:receiptNo` | `GET /api/payments/receipt/:receiptNo` |

Role checks: the navbar only shows the links of the logged-in role and the
backend re-checks the JWT role on every request (a student calling
`/api/dashboard` gets 403).

Checks: `npm run lint` (oxlint) and `npm run build` both run clean.
