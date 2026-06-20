# Nestify — Technical Architecture & Implementation Blueprint

> **Purpose:** Single source of truth for building the Nestify MERN assignment.  
> **Stack:** MongoDB, Express, React (Vite), Node.js  
> **Auth:** Firebase Authentication + JWT + RBAC  
> **Payments:** Stripe  
> **Design refs:** `home.html`, `browse.html`, `details.html`, `list_your_property.html`, `owner_dashboard.html`, `tanant_dashboard.html`

---

## Quick Reference

| Item | Value |
|------|-------|
| Roles | `tenant`, `owner`, `admin` |
| Google login default role | `tenant` |
| Property statuses | `pending`, `approved`, `rejected` |
| Booking statuses | `pending`, `approved`, `rejected` |
| Payment statuses | `unpaid`, `paid`, `refunded`, `failed` |
| Public listings | `status: approved` only |
| Featured on home | 6 approved properties (`limit(6)`) |
| Pagination required | ≥2 pages (All Properties + one admin/tenant list) |
| All search/filter | Backend only |
| Primary color | `#3525cd` |
| Font | Inter |

---

## 1. Functional Requirements

### Platform Core
- Owners list properties; tenants discover, book, pay reservation fees
- RBAC: Tenant, Owner, Admin
- Stripe payments, property approval, booking approval, reviews, favorites, admin moderation

### Global UI
- Layout: Header → Dynamic Content → Footer
- Loading page, Error/404 page
- SPA: no errors on reload; logged-in users stay on private routes
- Responsive; Framer Motion on banner + featured (+ optional sections)
- Design tokens from HTML mockups (glass panels, equal-height cards, 3-col grid)

### Auth
- Register: name, email, photo (URL/ImgBB), password, role
- Login: JWT sessions
- Google social login → default role **tenant**
- Backend RBAC middleware

### Public Pages

**Home `/`**
- Navbar, hero + search (location, type, min/max price)
- 6 featured approved properties
- View Details → login if guest; details if logged in
- Why Choose Us, 4 tenant reviews, 2+ extra sections

**All Properties `/properties`**
- 3-column grid, approved only
- Backend: search, filter (type, price, beds, baths), sort (price asc/desc), pagination

### Private Pages

**Property Details `/properties/:id`**
- Favorites, book modal (move-in, contact, user info, notes) → payment → success
- Reviews (rating + comment)

**Tenant Dashboard `/dashboard/tenant/*`**
- My Bookings (table), Favorites (table + remove), Profile

**Owner Dashboard `/dashboard/owner/*`**
- Analytics (3 KPI cards + 12-month Recharts line chart)
- Add Property (multi-step wizard), My Properties (CRUD + rejection feedback 👁️), Booking Requests (approve/reject)

**Admin Dashboard `/dashboard/admin/*`**
- All Users (change role), All Properties (approve/reject w/ feedback, edit, delete), All Bookings, Transactions

### Submission Requirements
- 20+ client commits, 12+ server commits
- README with live URL, features, packages
- Env vars for Firebase, MongoDB, Stripe, API URL
- Production deploy without CORS/404/reload issues
- Admin seed credentials for submission

### Optional
- PDF monthly earnings report, dark/light theme, share property

---

## 2. User Roles & Permissions

| Action | Guest | Tenant | Owner | Admin |
|--------|:-----:|:------:|:-----:|:-----:|
| Home / All Properties | ✅ | ✅ | ✅ | ✅ |
| Property Details | ❌ | ✅ | ✅ | ✅ |
| Favorites / Book / Pay | ❌ | ✅ | ❌ | ❌ |
| Review (after approved booking) | ❌ | ✅ | ❌ | ❌ |
| Manage own properties | ❌ | ❌ | ✅ | ✅ |
| Approve/reject bookings (own) | ❌ | ❌ | ✅ | ✅ |
| Owner analytics | ❌ | ❌ | ✅ | ✅ |
| Admin moderation | ❌ | ❌ | ❌ | ✅ |
| Profile | ❌ | ✅ | ✅ | ✅ |

**Dashboard redirect after login:**
- `admin` → `/dashboard/admin`
- `owner` → `/dashboard/owner`
- `tenant` → `/dashboard/tenant`

---

## 3. Database Schema (MongoDB)

### `users`
```javascript
{
  firebaseUid: String,       // unique, sparse
  name: String,
  email: String,             // unique, lowercase
  photo: String,
  passwordHash: String,      // null for Google-only
  role: 'tenant' | 'owner' | 'admin',
  phone: String,
  isActive: Boolean,
  authProvider: 'email' | 'google' | 'both',
  createdAt, updatedAt
}
// Indexes: email (unique), firebaseUid (unique sparse), role
```

### `properties`
```javascript
{
  title, description,
  location: { address, city, state, zip, country, coordinates? },
  locationSearch: String,    // denormalized for regex search
  propertyType: 'apartment'|'house'|'condo'|'villa'|'townhouse',
  rent: Number,
  rentType: 'monthly'|'weekly'|'daily',
  bedrooms, bathrooms, propertySize,
  amenities: [String], extraFeatures: [String], images: [String],
  status: 'pending'|'approved'|'rejected',
  rejectionFeedback: String,
  ownerId: ObjectId,
  ownerInfo: { name, email, photo },
  averageRating: Number, reviewCount: Number,
  createdAt, updatedAt
}
// Indexes: status+createdAt, ownerId+status, rent, propertyType, locationSearch text
```

### `bookings`
```javascript
{
  propertyId, tenantId, ownerId,
  moveInDate, contactNumber,
  tenantInfo: { name, email },
  additionalNotes: String,
  bookingStatus: 'pending'|'approved'|'rejected',
  paymentStatus: 'unpaid'|'paid'|'refunded'|'failed',
  amount, currency: 'usd',
  stripeSessionId, stripePaymentIntentId,
  transactionId, rejectedReason?,
  createdAt, updatedAt
}
// Indexes: tenantId+createdAt, ownerId+bookingStatus, propertyId, stripeSessionId unique sparse
```

### `transactions`
```javascript
{
  bookingId, propertyId, tenantId, ownerId,
  stripePaymentIntentId, stripeSessionId,
  amount, currency,
  status: 'succeeded'|'pending'|'failed'|'refunded',
  paidAt, metadata, createdAt
}
// Indexes: ownerId+paidAt, stripePaymentIntentId unique, status+paidAt
```

### `favorites`
```javascript
{ userId, propertyId, createdAt }
// Compound unique: userId + propertyId
```

### `reviews`
```javascript
{
  propertyId, userId, bookingId,
  rating: 1-5, comment,
  userSnapshot: { name, email },
  createdAt, updatedAt
}
// Unique: userId + propertyId
```

---

## 4. REST API Structure

**Base:** `/api/v1` or `/api`  
**Auth header:** `Authorization: Bearer <JWT>`  
**Pagination:** `?page=1&limit=12`  
**Sort:** `?sort=price_asc|price_desc|newest|rating`

### Auth — `/api/auth`
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/register` | Public |
| POST | `/login` | Public |
| POST | `/google` | Public (Firebase ID token → JWT) |
| GET | `/me` | Private |

### Users — `/api/users`
| PATCH | `/profile` | Private |
| PATCH | `/:id/role` | Admin |

### Properties — `/api/properties`
| GET | `/` | Public (approved, filter/sort/page) |
| GET | `/featured` | Public (limit 6) |
| GET | `/:id` | Private |
| POST | `/` | Owner |
| PATCH/DELETE | `/:id` | Owner/Admin |
| GET | `/owner/my-properties` | Owner |
| GET | `/admin/all` | Admin |
| PATCH | `/:id/approve` | Admin |
| PATCH | `/:id/reject` | Admin `{ rejectionFeedback }` |

### Bookings — `/api/bookings`
| POST | `/` | Tenant |
| GET | `/my-bookings` | Tenant |
| GET | `/owner/requests` | Owner |
| GET | `/admin/all` | Admin |
| PATCH | `/:id/approve` | Owner |
| PATCH | `/:id/reject` | Owner |

### Payments — `/api/payments`
| POST | `/create-checkout-session` | Tenant |
| POST | `/webhook` | Stripe (raw body) |
| GET | `/verify/:sessionId` | Tenant |

### Favorites — `/api/favorites`
| GET/POST | `/` | Tenant |
| DELETE | `/:propertyId` | Tenant |
| GET | `/check/:propertyId` | Tenant |

### Reviews — `/api/reviews`
| GET | `/property/:propertyId` | Private |
| GET | `/featured` | Public (limit 4) |
| POST/PATCH/DELETE | `/` | Tenant |

### Admin — `/api/admin`
| GET | `/users`, `/transactions`, `/stats` | Admin |

### Analytics — `/api/analytics`
| GET | `/owner/summary` | Owner |
| GET | `/owner/monthly-earnings` | Owner |
| GET | `/owner/earnings-report` | Owner (optional PDF) |

---

## 5. Frontend Routes

```
/                              Home (public)
/properties                    All Properties (public)
/login, /register              Auth
/properties/:id                Details (private)
/payment/:bookingId            Payment (tenant)
/payment/success, /payment/cancel

/dashboard                     → role redirect
/dashboard/tenant/bookings|favorites|profile
/dashboard/owner               Analytics (index)
/dashboard/owner/add-property|properties|bookings|profile
/dashboard/admin/users|properties|bookings|transactions|profile
*                              404
```

---

## 6. Dashboard Structures

### Tenant
- **Bookings:** Property Name, Booking Date, Amount Paid, Booking Status, Payment Status
- **Favorites:** table + Remove
- **Profile:** name, photo, phone (email read-only)
- Sidebar: Bookings | Favorites | Profile | Logout (NO "Add Property")

### Owner
- **Analytics:** Total Earnings (sum succeeded transactions), Total Properties, Total Bookings (approved+paid), 12-month Recharts line chart
- **Add Property:** 3-step wizard per `list_your_property.html`
- **My Properties:** table + edit/delete + 👁️ rejection feedback modal
- **Booking Requests:** approve/reject

### Admin
- Users (change role), Properties (approve/reject/edit/delete), Bookings (monitor), Transactions

---

## 7. Project Folder Structure

```
nestify/
├── client/                 # Vite + React
│   ├── src/
│   │   ├── api/
│   │   ├── components/layout|shared|home|properties|dashboard
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── hooks/
│   │   ├── pages/          # tenant/, owner/, admin/
│   │   ├── routes/         # AppRoutes, PrivateRoute, RoleRoute
│   │   ├── firebase/
│   │   └── utils/
│   └── public/_redirects   # SPA fallback
├── server/
│   └── src/
│       ├── config/         # db, firebaseAdmin, stripe
│       ├── models/
│       ├── controllers/
│       ├── middleware/     # verifyJWT, verifyRole
│       ├── routes/
│       └── services/       # stripe, earnings, propertyQuery
├── docs/ARCHITECTURE.md    # this file
└── *.html                  # design references
```

---

## 8. NPM Packages

### Client
`react`, `react-dom`, `react-router-dom`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `axios`, `@tanstack/react-query`, `firebase`, `framer-motion`, `recharts`, `@stripe/stripe-js`, `react-hook-form`, `react-hot-toast`, `date-fns`

### Server
`express`, `mongoose`, `dotenv`, `cors`, `helmet`, `morgan`, `bcryptjs`, `jsonwebtoken`, `firebase-admin`, `stripe`, `express-validator`, `express-rate-limit`, `nodemon`

---

## 9. Auth Flow (Firebase + JWT)

1. **Email register:** Client → `POST /auth/register` → bcrypt + MongoDB user → JWT
2. **Email login:** Client → `POST /auth/login` → JWT
3. **Google:** Client Firebase popup → ID token → `POST /auth/google` → firebase-admin verify → upsert user (role=tenant if new) → JWT
4. **API calls:** `Authorization: Bearer JWT` → `verifyJWT` → `verifyRole`
5. **Reload persistence:** AuthContext reads token → `GET /auth/me` before rendering routes (show loader, no flash redirect)

**JWT payload:** `{ userId, email, role, iat, exp }` — 7d expiry

---

## 10. Stripe Payment Workflow

1. Tenant submits booking modal → `POST /bookings` (pending, unpaid)
2. `POST /payments/create-checkout-session` { bookingId }
3. Redirect to Stripe Checkout
4. Webhook `checkout.session.completed` → booking `paymentStatus=paid`, create `transaction`
5. Success URL → `/payment/success?session_id=...` → poll `GET /payments/verify/:sessionId`

**Reservation fee:** e.g. first month rent or `rent * 0.1` — store on booking at creation.

**Dev:** Stripe CLI `stripe listen --forward-to localhost:5000/api/payments/webhook`

---

## 11. Booking Workflow

```
Pending (unpaid) → [Stripe success] → Pending (paid) → Owner Approve → Approved
                                                    → Owner Reject → Rejected
```

**Confirmed booking (analytics):** `bookingStatus=approved` AND `paymentStatus=paid`

Only **approved** properties can be booked.

---

## 12. Property Approval Workflow

```
Owner publish → pending → Admin approve → approved (public)
                      → Admin reject + feedback → rejected (owner sees 👁️)
Owner edit rejected → back to pending
```

Reject modal **requires** `rejectionFeedback`. Owner My Properties shows 👁️ on rejected rows.

---

## 13. Reviews Workflow

- Tenant only, one per property
- Gate: approved booking for that property recommended
- Display: name, email, date, rating, comment
- Update `property.averageRating` + `reviewCount` on CRUD
- Home: top 4 reviews (`rating >= 4`)

---

## 14. Favorites Workflow

- `POST /favorites { propertyId }` — compound unique userId+propertyId
- Toggle on property details; table in tenant dashboard with Remove
- Populate property details in list response

---

## 15. Owner Analytics

### Summary (`GET /analytics/owner/summary`)
- **Total Earnings:** sum `transactions.amount` where `ownerId` + `status=succeeded`
- **Total Properties:** count `properties` where `ownerId`
- **Total Bookings:** count `bookings` where `ownerId` + approved + paid

### Monthly chart (`GET /analytics/owner/monthly-earnings`)
Aggregate transactions by year/month for last 12 months; fill zero months for Recharts.

```javascript
// Response shape
[{ month: 'Jan', earnings: 8000, bookings: 3 }, ...]
```

Source: **transactions only**, not booking amounts.

---

## 16. Admin Moderation

- **Users:** list + `PATCH /users/:id/role` (never allow self-demotion to non-admin accidentally)
- **Properties:** approve, reject (feedback modal), edit, delete
- **Bookings:** read-only monitor
- **Transactions:** full ledger with property/tenant/owner names

---

## 17. Protected Routes & Middleware

### Server middleware chain
`verifyJWT` → `verifyRole(...)` → `validateRequest` → controller

| Route | Middleware |
|-------|------------|
| GET /properties | none |
| GET /properties/:id | verifyJWT |
| POST /properties | verifyJWT + owner |
| POST /bookings | verifyJWT + tenant |
| PATCH /bookings/:id/approve | verifyJWT + owner + ownership |
| POST /payments/webhook | Stripe signature only |
| GET /admin/* | verifyJWT + admin |
| GET /analytics/owner/* | verifyJWT + owner |

### Client guards
- `PrivateRoute` — any authenticated user
- `RoleRoute roles={['tenant'|'owner'|'admin']}`

---

## 18. Search, Filter, Sort, Pagination

```
GET /api/properties?page=1&limit=12&location=beverly&propertyType=apartment,villa
  &minPrice=1000&maxPrice=5000&bedrooms=2&bathrooms=1&sort=price_asc
```

- All filtering **backend only**
- Home banner search → navigate to `/properties?...` with query params
- Debounce location input (~400ms) or "Apply Filters" button
- Pagination pages: All Properties (required) + Admin Users or Transactions

---

## 19. Development Phases

| Phase | Focus |
|-------|-------|
| 0 | Scaffold, Tailwind tokens, env, layouts, loading/404 |
| 1 | Auth (register, login, Google, JWT, AuthContext, reload fix) |
| 2 | Properties CRUD, admin approve/reject, browse + home + pagination |
| 3 | Property details, favorites |
| 4 | Bookings + Stripe + owner approve/reject |
| 5 | Reviews + owner analytics Recharts |
| 6 | Admin dashboard full |
| 7 | Polish, deploy, README, commits |

---

## 20. Key Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| SPA reload 404 | `public/_redirects` or Vercel rewrites |
| Auth lost on reload | Bootstrap `/auth/me` before routes render |
| Firebase + JWT sync | MongoDB = source of truth for roles; Firebase = identity only |
| Stripe webhook local | Stripe CLI forward; verify session on success page as fallback |
| Rejection feedback | Store on property; 👁️ modal in owner table |
| Client-side filtering | Forbidden — all query params to API |
| CORS production | Whitelist exact `CLIENT_URL` |
| Tenant HTML mock wrong nav | Use visual style only; routes = Bookings/Favorites/Profile |
| Earnings accuracy | Aggregate from `transactions` where `succeeded` only |

---

## Environment Variables

### Client
```
VITE_API_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_IMGBB_API_KEY=
```

### Server
```
PORT=5000
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLIENT_URL=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

---

## Design → Component Map

| HTML | React |
|------|-------|
| `home.html` | HomePage, HeroBanner, SearchBar, FeaturedProperties |
| `browse.html` | AllPropertiesPage, FilterSidebar, PropertyGrid, Pagination |
| `details.html` | PropertyDetailsPage, Gallery, BookingWidget, Reviews |
| `list_your_property.html` | AddPropertyPage, PropertyFormWizard |
| `owner_dashboard.html` | OwnerAnalytics, Sidebar, KPICards, EarningsChart |
| `tanant_dashboard.html` | Tenant layout styling only (fix nav items) |

---

*Last updated: project planning phase — no application code yet.*
