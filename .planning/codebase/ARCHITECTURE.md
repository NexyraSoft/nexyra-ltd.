# ARCHITECTURE.md — NexyraSoft Application Architecture
> Generated: 2026-04-28 | Focus: tech+arch | Scanner: gsd-scan

---

## System Overview

NexyraSoft is a **full-stack monorepo** with a Vite+React SPA frontend and a separate Express+MongoDB backend. Both run as separate processes but live in the same repository.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (SPA)                         │
│  Vite + React 19 + TypeScript                           │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │
│  │ Public   │  │ Admin    │  │ Persistent UI Layer    │ │
│  │ Website  │  │Dashboard │  │ Preloader, Background3D│ │
│  │ (Routes) │  │ /admin   │  │ Chatbot, Navbar/Footer │ │
│  └────┬─────┘  └────┬─────┘  └───────────────────────┘ │
│       │              │                                   │
│       └──────┬───────┘                                  │
│              │ fetch (REST JSON)                         │
│              ▼                                           │
├─────────────────────────────────────────────────────────┤
│              Express API Server (:5000)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Routes → Controllers → Services → Models        │   │
│  │  Middleware: auth (JWT), errorHandler, cors      │   │
│  └───────────────────┬──────────────────────────────┘   │
│                      │                                   │
│          ┌───────────┴────────────┐                     │
│          ▼                        ▼                     │
│    MongoDB (Mongoose)        Google Gemini AI           │
│    + Nodemailer SMTP                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Application Shell (`src/App.tsx`)
- `BrowserRouter` wraps the entire app
- **Global persistent components** mounted unconditionally at root level:
  - `<Preloader />` — full-screen overlay, self-removes after 3s
  - `<Background3D />` — fixed full-viewport WebGL canvas, delayed 2.8s mount
  - `<Navbar />` — top navigation
  - `<Footer />` — bottom footer
  - `<Chatbot />` — floating bottom-right AI chatbot widget
  - `<GetStartedModal />` — portal-style modal (state lifted to App)
- `<ScrollToTop />` — resets scroll on route change

### Routing (React Router v7)
| Route | Component |
|-------|-----------|
| `/` | `Home` (Hero + Services + Tools + About + Process + Contact) |
| `/services/:slug` | `ServiceDetail` |
| `/careers` | `Careers` |
| `/terms` | `Terms` |
| `/privacy` | `Privacy` |
| `/admin/login` | `AdminLogin` |
| `/admin` | `AdminDashboard` |

### State Management
- **No global state library** (no Redux, Zustand, etc.)
- State is colocated in components or lifted to nearest common parent
- Modal state (`isGetStartedModalOpen`) lifted to `App.tsx`, passed via props
- Admin dashboard manages its own CRUD state internally

### 3D Rendering Strategy
- **Two separate WebGL contexts**: Hero scene (`ScienceScene`) and Background (`Background3D`)
- Both use **deferred mounting** (setTimeout) to avoid racing with the Preloader:
  - `Background3D` mounts at **2800ms**
  - `ScienceScene` (in Hero) mounts at **2500ms**
  - `Preloader` unmounts at **3000ms** (exits at 2000ms, 1s animation)
- Background3D renders 100 neural network nodes with O(n²) connection logic per frame — known performance concern
- Hero scene is complex: glass sphere (`MeshTransmissionMaterial`), orbiting service icons (R3F Html), particle cloud, HUD rings, connection lines

---

## Backend Architecture

### Entry → App → Routes → Controllers → Models

```
server/src/index.ts          ← startup (connectDatabase → app.listen)
server/src/app.ts            ← Express app, middleware, route mounting
server/src/config/
  db.ts                      ← Mongoose connect
  env.ts                     ← env var validation/export
server/src/middleware/
  auth.ts                    ← JWT verification middleware
  errorHandler.ts            ← global error handler
server/src/routes/           ← route files (thin, delegate to controllers)
server/src/controllers/      ← business logic per domain
server/src/models/           ← Mongoose schemas
server/src/services/
  emailService.ts            ← Nodemailer transporter + email templates
server/src/types/            ← shared server-side TypeScript types
server/src/scripts/          ← one-off scripts (e.g. seed data)
server/src/utils/            ← utility helpers
```

### Domain Model

| Model | Purpose |
|-------|---------|
| `User` | Admin system users (hashed password, JWT auth) |
| `Client` | CRM — client records |
| `Lead` | Sales leads from Get Started / Chatbot capture |
| `Project` | Project tracking |
| `Task` | Task management per project |
| `JobVacancy` | Open job postings |
| `ContactMessage` | Public contact form submissions |

### API Structure
- All routes prefixed `/api/`
- Auth-protected routes use `auth.ts` middleware (JWT Bearer token check)
- Error propagation: controllers throw → `errorHandler` middleware serializes to JSON

---

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Single-repo monorepo (frontend + backend) | Simplicity for a small team; shared TypeScript tooling |
| No SSR / Next.js | Pure SPA — SEO not a primary concern for admin; marketing site uses client-side render |
| Deferred WebGL mount | Prevents WebGL init from blocking preloader animation |
| Lifted modal state to App | `GetStartedModal` triggered from multiple places (Navbar, Hero) |
| No global state manager | App complexity doesn't yet justify Redux/Zustand overhead |
| JWT in Bearer header + credentials:include | Dual auth strategy — supports both cookie and token-based flows |
| Tailwind v4 via Vite plugin | Avoids PostCSS config complexity; v4 uses CSS-first configuration |

---

## Known Architectural Concerns

1. **O(n²) frame loop in Background3D** — `Lines` component iterates all 100×100 point pairs per frame, known to lag on startup
2. **Two WebGL contexts on homepage** — Preloader + Background3D can coexist briefly, taxing GPU memory
3. **Admin route unprotected client-side** — `/admin` route has no client-side auth guard; relies solely on API 401 responses
4. **Gemini key exposed at build time** — `process.env.GEMINI_API_KEY` is inlined into the client bundle; should use server-side proxy only
5. **Drei CDN asset** — `light-halo.png` loaded from GitHub CDN in `SoftwareIconCore` — no local fallback
