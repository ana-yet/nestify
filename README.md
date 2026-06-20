# Nestify

Property Rental & Booking Platform — a premium marketplace where owners list rental properties and tenants discover, book, and pay reservation fees online.

## Live URL

- **Frontend:** (add Vercel URL after deploy)
- **Backend API:** (add Render URL after deploy)

## Project Overview

Nestify is a full-stack MERN application with Firebase authentication, JWT-secured APIs, Stripe payments, role-based dashboards, and admin moderation. Tenants browse approved listings, book properties, pay reservation fees, and leave reviews. Owners manage listings, approve bookings, and view earnings analytics. Admins moderate users, properties, bookings, and transactions.

## Key Features

- **Authentication:** Email/password + Google sign-in (Google defaults to tenant role)
- **Role-based access:** Tenant, Owner, Admin with protected routes
- **Properties:** CRUD, admin approval workflow, backend search/filter/sort/pagination
- **Bookings & Stripe:** Checkout sessions, webhooks, transaction ledger
- **Reviews:** Tenant reviews after approved bookings; featured reviews on homepage
- **Favorites:** Save properties to tenant dashboard
- **Owner analytics:** KPI cards + 12-month Recharts earnings chart
- **Admin panel:** Users, properties, bookings (read-only), transactions with search
- **UX:** Framer Motion animations, loading/error/empty states, mobile-responsive dashboards

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, DaisyUI, TanStack Query, React Hook Form, Framer Motion, Recharts |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Firebase Admin |
| Auth | Firebase Authentication + custom JWT |
| Payments | Stripe Checkout + webhooks |

## Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster
- Firebase project (Email/Password + Google enabled)
- Firebase service account JSON for the server
- Stripe account (test mode for development)

### Server

```bash
cd server
cp .env.example .env
npm install
npm run seed:admin   # creates admin user from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev
```

Server runs at `http://localhost:5000`

### Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Client runs at `http://localhost:5173`

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `FIREBASE_PROJECT_ID` | Firebase Admin project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `ADMIN_EMAIL` | Admin seed email |
| `ADMIN_PASSWORD` | Admin seed password |
| `ADMIN_NAME` | Admin display name |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base (e.g. `http://localhost:5000/api`) |
| `VITE_FIREBASE_*` | Firebase web SDK config |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `VITE_IMGBB_API_KEY` | ImgBB for image uploads (optional) |

## Deployment

### Frontend — Vercel

1. Connect the `client` folder to Vercel
2. Set all `VITE_*` environment variables in the Vercel dashboard
3. `vercel.json` includes SPA rewrites so reload on any route works
4. `public/_redirects` is included for Netlify-compatible hosts

### Backend — Render

1. Create a **Web Service** pointing to the `server` folder
2. Build command: `npm install`
3. Start command: `npm start`
4. Add all server environment variables
5. Set `CLIENT_URL` to your Vercel frontend URL (exact origin, no trailing slash)

### MongoDB Atlas

1. Create a free cluster and database user
2. Allow access from anywhere (`0.0.0.0/0`) or Render's IP range
3. Copy the connection string into `MONGODB_URI`

### Stripe Webhook (Production)

1. In Stripe Dashboard → Developers → Webhooks, add endpoint:
   `https://your-render-api.onrender.com/api/payments/webhook`
2. Select event: `checkout.session.completed`
3. Copy the signing secret into `STRIPE_WEBHOOK_SECRET` on Render
4. Use live or test keys consistently across client and server

### Local Stripe Webhook Testing

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## Admin Credentials (Submission)

After running `npm run seed:admin`:

- **Email:** value of `ADMIN_EMAIL` in `.env` (default `admin@nestify.com`)
- **Password:** value of `ADMIN_PASSWORD` in `.env`

## API Endpoints

### Auth

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/google` | Public |
| GET | `/api/auth/me` | JWT |

### Properties

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/properties` | Public (approved, filter/sort/page) |
| GET | `/api/properties/:id` | JWT |
| POST/PATCH/DELETE | `/api/properties` | Owner/Admin |
| GET | `/api/properties/admin/all` | Admin |

### Bookings & Payments

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/bookings` | Tenant |
| GET | `/api/bookings/my-bookings` | Tenant |
| GET | `/api/bookings/owner/requests` | Owner |
| PATCH | `/api/bookings/:id/approve` | Owner |
| POST | `/api/payments/create-checkout-session` | Tenant |
| POST | `/api/payments/webhook` | Stripe |
| GET | `/api/payments/verify/:sessionId` | Tenant |

### Reviews & Analytics

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/reviews/featured` | Public |
| GET | `/api/reviews/property/:propertyId` | JWT |
| POST/PATCH/DELETE | `/api/reviews` | Tenant |
| GET | `/api/analytics/owner/summary` | Owner |
| GET | `/api/analytics/owner/monthly-earnings` | Owner |

### Admin

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/admin/users` | Admin |
| GET | `/api/admin/bookings` | Admin |
| GET | `/api/admin/transactions` | Admin |
| PATCH | `/api/users/:id/role` | Admin |

## NPM Packages

See `client/package.json` and `server/package.json`.

## Architecture

Full blueprint: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## Repository Links

- **Client:** (add GitHub URL)
- **Server:** (add GitHub URL)

## Implementation Status

- [x] Phase 0–1: Auth, JWT, Firebase, layouts
- [x] Phase 2: Properties CRUD, browse, pagination
- [x] Phase 3: Favorites, bookings foundation, tenant dashboard
- [x] Phase 4: Stripe payments, transactions, owner booking management
- [x] Phase 5: Reviews, owner analytics (Recharts)
- [x] Final Phase: Admin users/bookings/transactions, global loading/error UX, deployment prep
