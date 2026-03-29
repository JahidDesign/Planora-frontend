# Planora — Frontend

> A secure, JWT-protected event management platform built with Next.js and Tailwind CSS.

🔗 **Live Demo:** [https://planoranet.vercel.app](https://planoranet.vercel.app)
📦 **Repository:** [https://github.com/JahidDesign/Planora-frontend](https://github.com/JahidDesign/Planora-frontend)

---

## 🔐 Admin Credentials

| Field | Value |
|---|---|
| **Email** | jahid@planora.dev |
| **Password** | jahid@1234 |
| **Role** | ADMIN |

> Use these credentials to access the Admin Panel at `/admin` — monitor events, manage users, and remove inappropriate content.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State | Zustand |
| HTTP Client | Axios |
| Payments | Stripe.js |
| Notifications | React Hot Toast |
| Date Formatting | date-fns |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running (see server README)

### Installation

```bash
# Clone the repository
git clone https://github.com/JahidDesign/Planora-frontend.git
cd Planora-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
Planora-frontend/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Homepage
│   ├── events/
│   │   ├── page.tsx            # Events listing page
│   │   └── [id]/
│   │       ├── page.tsx        # Event detail page
│   │       └── edit/
│   │           └── page.tsx    # Edit event page
│   ├── dashboard/
│   │   ├── page.tsx            # Dashboard overview
│   │   ├── my-events/
│   │   ├── invitations/
│   │   ├── reviews/
│   │   └── settings/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── admin/
│   │   ├── events/
│   │   └── users/
│   └── payment/
│       ├── success/
│       └── cancel/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── UpcomingEventsSlider.tsx
│   │   ├── EventCategories.tsx
│   │   └── CallToAction.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventForm.tsx
│   │   └── EventFilters.tsx
│   ├── dashboard/
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Skeleton.tsx
│       ├── Badge.tsx
│       ├── Textarea.tsx
│       ├── StarRating.tsx
│       └── EmptyState.tsx
├── lib/
│   └── api.ts                  # Axios instance with JWT interceptors
├── store/
│   └── authStore.ts            # Zustand auth state
├── hooks/
│   └── useVisibleCount.ts      # Responsive breakpoint hook
└── public/
    └── ...
```

---

## Pages Overview

### Homepage (`/`)

| Section | Description |
|---|---|
| **Navbar** | Links to Home, Events, Login/Signup, Dashboard |
| **Hero** | Admin-featured event with title, date, description, and Join button |
| **Upcoming Events Slider** | Responsive carousel of 9 upcoming public events |
| **Event Categories** | Filter tiles: Public Free, Public Paid, Private Free, Private Paid |
| **Call To Action** | Prompts to create or join events |
| **Footer** | About, Contact, Privacy Policy links |

### Events Page (`/events`)

- Search by title or organizer
- Filter by event type and fee
- Responsive event card grid

### Event Detail Page (`/events/[id]`)

- Full event info: title, date/time, venue or link, description, organizer, fee
- Dynamic join button based on event type and authentication state:

| Event Type | Button |
|---|---|
| Free + Public | Join Free |
| Paid + Public | Pay & Join |
| Free + Private | Request to Join |
| Paid + Private | Pay & Request |

- Owner controls: edit, delete, manage participants, send invitations
- Admin controls: delete any event
- Reviews and star ratings (for past attendees only)

### Dashboard (`/dashboard`)

Requires authentication. Sidebar sections:

| Section | Features |
|---|---|
| **My Events** | Create, update, delete events; view and approve/reject/ban participants |
| **Invitations** | Accept, decline, or pay & accept invitations |
| **My Reviews** | View, edit, delete reviews |
| **Settings** | Update profile and notification preferences |

### Auth Pages

- `/auth/register` — Email + password registration
- `/auth/login` — JWT login, token stored in Zustand + localStorage

### Admin Panel (`/admin`)

> Login with `jahid@planora.dev` / `jahid@1234` to access.

- Monitor and delete any event
- Monitor and delete user accounts
- Accessible only to users with `ADMIN` role

---

## Authentication Flow

1. User registers or logs in via `/auth/login`
2. Server returns a JWT access token
3. Token is stored in Zustand store and persisted to `localStorage`
4. Axios interceptor attaches `Authorization: Bearer <token>` to every request
5. Protected routes redirect to `/auth/login` if no token is present

---

## Payment Flow

Payments are processed via **Stripe Checkout**:

1. User clicks a paid join or pay & accept button
2. Frontend calls the backend to create a Stripe Checkout Session
3. Backend returns `{ url: session.url }`
4. Frontend redirects with `window.location.href = url`
5. User completes payment on Stripe's hosted page
6. Stripe redirects back to `/payment/success` or `/payment/cancel`
7. Participation status is set to `PENDING` — awaiting host approval

> **Note:** `stripe.redirectToCheckout({ sessionId })` was removed in `@stripe/stripe-js` v2. This project uses the session URL redirect pattern exclusively.

---

## Participation Logic

```
Public  + Free  → Joined instantly (APPROVED)
Public  + Paid  → Payment → PENDING (awaiting host approval)
Private + Free  → Request sent → PENDING (awaiting host approval)
Private + Paid  → Payment → PENDING (awaiting host approval)
```

---

## Responsive Design

All pages are fully responsive across mobile, tablet, and desktop:

- Mobile (`< 640px`): single column, swipeable carousel, bottom nav arrows
- Tablet (`640px–1024px`): two-column grids, visible nav arrows
- Desktop (`> 1024px`): three-column grids, full sidebar layouts

---

## Key Components

### `UpcomingEventsSlider`
Responsive carousel with:
- Breakpoint-aware visible count (1 / 2 / 3)
- Touch/swipe support
- Dot indicators + prev/next arrows
- Mobile edge-to-edge padding with shadow clearance

### `PaymentCards`
Dual-panel component:
- **Checkout tab** — Stripe Card Elements form with cardholder name, number, expiry, CVC
- **History tab** — Paginated payment history with receipt links

### `EventCard`
Reusable card showing title, date, organizer, venue, and fee badge (Free / $X).

### `Pricing`
Three-tier pricing section (Free / Pro / Enterprise) with monthly/yearly toggle and Stripe checkout redirect.

---

## Commit History

This project maintains a minimum of 20 meaningful commits:

```
feat: initialise Next.js project with Tailwind and folder structure
feat: implement JWT auth with Zustand store and axios interceptor
feat: build Navbar with mobile hamburger menu
feat: create HeroSection with featured event from API
feat: build UpcomingEventsSlider with responsive carousel
feat: add EventCategories filter section
feat: add CallToAction section and Footer
feat: build EventCard and EventsPage with search and filters
feat: build EventDetailPage with dynamic join button
feat: implement Stripe checkout redirect for paid events
feat: build Dashboard layout with Sidebar navigation
feat: add MyEvents page with create/edit/delete
feat: build EventForm with all required fields
feat: add participant management with approve/reject/ban
feat: build InvitationsPage with pay & accept flow
feat: add Reviews and StarRating components
feat: build MyReviews page with edit and delete
feat: add Settings page for profile and notifications
feat: build Admin panel for event and user moderation
fix: replace deprecated redirectToCheckout with session URL redirect
fix: add mobile padding and edge-to-edge carousel on small devices
fix: align stripe peer dependencies (@stripe/react-stripe-js)
```

---

## Video Walkthrough

The submission video (5–10 minutes) covers:

1. **User Registration** — sign up with email and password
2. **Login** — JWT authentication and dashboard redirect
3. **Create Event** — fill all fields, set fee and visibility
4. **Public Free Event Join** — instant approval flow
5. **Paid Event Payment** — Stripe checkout and redirect
6. **Private Event Join Request** — pending approval flow
7. **Host Approval Process** — approve / reject / ban from dashboard
8. **Dashboard Features** — my events, invitations, reviews, settings
9. **Admin Moderation** — delete events and users from admin panel
10. **Event Reviews** — rate and review a past event

---

## License

MIT
