# EventBook

EventBook is a simple event booking app. Visitors can browse and search events, users can book or cancel seats, and admins can manage events.

## Links

- **App:** https://sujan-eventbook.vercel.app/
- **API:** https://eventbook-gmgr.onrender.com

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin123 |
| User | user@example.com | User123 |

The demo includes 24 upcoming events, a nearly full event, a sold-out event, and a past event. The user account already has bookings to test the booking pages.

**Note:** The API uses a free hosting tier and may take up to a minute to respond after being idle.

## Features

- Browse, search, and view upcoming events without logging in
- Register, log in, book a seat, and cancel your own booking
- Admin dashboard with booking stats and recent bookings
- Admin event creation, editing, deletion, and attendee lists
- Server-side search and pagination
- Clear validation and error messages

## Tech stack

| Technology | Why I used it |
|---|---|
| Next.js, TypeScript, Tailwind CSS | Build a responsive, typed frontend. |
| TanStack Query | Manage API data, loading, and errors. |
| Zod | Validate user input. |
| Node.js, Express 5, TypeScript | Build the REST API and booking rules. |
| Supabase PostgreSQL, Drizzle ORM | Store data and work with typed database queries. |
| bcryptjs and JWT | Hash passwords and protect user routes. |
| Vitest and Supertest | Test backend routes and rules. |
| Vercel, Render, Supabase | Host the frontend, API, and database. |

The frontend communicates with the REST API. Only the backend connects to Supabase.

## Run locally

You need Node.js 22+ and a Supabase project.

### Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set these values:

- `DATABASE_URL`: Supabase transaction pooler URL (port 6543)
- `MIGRATION_DATABASE_URL`: Supabase session pooler URL (port 5432)
- `JWT_SECRET`: a random secret with at least 32 characters
- `JWT_EXPIRES_IN`: for example, `7d`
- `CORS_ORIGIN`: `http://localhost:3000`
- `PORT`: optional; defaults to `4000`

Then run:

```bash
npm run db:migrate
npm run seed
npm run dev
```

The API runs at `http://localhost:4000`. **The seed command deletes existing events and bookings before adding demo data, so do not run it on data you want to keep.**

### Frontend

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env.local` and set:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

It runs at `http://localhost:3000`.

### Tests

From the backend folder, run:

```bash
npm test
```

Tests use prefixed test records and clean them up afterwards. They currently use the same database as the app, so a separate test database would be safer.

## Data model

The app uses three tables:

- **users:** `id`, `name`, `email`, `password_hash`, `role`, `created_at` stores user accounts and roles.
- **events:** `id`, `title`, `description`, `venue`, `starts_at`, `total_seats`, `created_at` stores event details and seat limits.
- **bookings:** `id`, `user_id`, `event_id`, `created_at` connects users to the events they book.

A unique index prevents duplicate bookings. Seats left are calculated from total seats minus existing bookings, and a database transaction prevents overbooking.

## Main API routes

All routes use the `/api` prefix. Protected routes require a bearer token.

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | Check API status |
| POST | `/auth/register` | Public | Register a user |
| POST | `/auth/login` | Public | Log in |
| GET | `/auth/me` | User | Get the current user |
| GET | `/events?search=&page=&limit=` | Public | Search and paginate upcoming events |
| GET | `/events/:id` | Public | Get event details |
| POST | `/events` | Admin | Create an event |
| PUT | `/events/:id` | Admin | Update an event |
| DELETE | `/events/:id` | Admin | Delete an event |
| GET | `/events/:id/attendees` | Admin | View attendees |
| GET | `/events/stats` | Admin | View dashboard stats |
| POST | `/bookings` | User | Book a seat |
| GET | `/bookings/me` | User | View own bookings |
| DELETE | `/bookings/:id` | User | Cancel own booking |

## Important decisions

- Booking runs in a database transaction with a row lock, so two people cannot take the last seat at the same time. A test checks that one booking succeeds and the other is rejected.
- The backend enforces booking and permission rules, hiding a button in the UI is not the only protection.
- Past events cannot be booked or cancelled.
- Admins cannot reduce seats below the number already booked.
- Events with bookings cannot be deleted, to avoid removing existing bookings unexpectedly.
- New registrations always create normal user accounts. Admin access is created by the seed script.
- Login is rate-limited after five failed attempts from one IP within 15 minutes.

## AI tools

I used Claude to help plan the project, draft parts of the frontend and backend, and troubleshoot errors. I ran the app, tested the API with Postman, checked the frontend in the browser, and reviewed the generated code. I remain responsible for the final implementation and can explain how it works.

## Known limitations

- The free API host may sleep when idle, and the free Supabase project may pause after a period without activity.
- The login rate limiter is stored in memory and resets when the API restarts.
- JWTs are stored in localStorage, an httpOnly cookie and refresh-token flow would improve security.  
- Backend tests are included, but automated frontend tests and Docker Compose are not yet set up.

