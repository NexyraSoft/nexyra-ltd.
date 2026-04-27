# STACK.md — NexyraSoft Tech Stack
> Generated: 2026-04-28 | Focus: tech+arch | Scanner: gsd-scan

---

## Runtime & Language

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | ~5.8.2 |
| Runtime (client) | Browser (ESM) | — |
| Runtime (server) | Node.js (tsx) | — |
| Module system | ESM (`"type": "module"`) | — |

---

## Frontend

### Core Framework
- **React** `^19.0.0` + **React DOM** `^19.0.0`
- **React Router DOM** `^7.14.1` — client-side routing (BrowserRouter)

### Build Tooling
- **Vite** `^6.2.0` — dev server (port 3000, 0.0.0.0 host), bundler
- **@vitejs/plugin-react** `^5.0.4` — JSX transform
- **TypeScript** `~5.8.2` — type checking (`tsc --noEmit` for lint)

### Styling
- **Tailwind CSS** `^4.1.14` (via `@tailwindcss/vite` Vite plugin — v4 approach, no PostCSS config)
- **tailwind-merge** `^3.5.0` — conditional class merging
- **tw-animate-css** `^1.4.0` — animation utilities
- **class-variance-authority** `^0.7.1` — variant-based component styling
- **clsx** `^2.1.1` — conditional classnames

### Typography
- **@fontsource-variable/geist** `^5.2.8` — Geist variable font (self-hosted)

### Animation
- **motion** `^12.23.24` (Framer Motion v12) — page/component animations, `AnimatePresence`, `motion.*` components

### 3D / WebGL
- **Three.js** `^0.183.2` — base 3D engine
- **@react-three/fiber** `^9.6.0` — React renderer for Three.js (`Canvas`, `useFrame`)
- **@react-three/drei** `^10.7.7` — helpers: `Float`, `Points`, `PointMaterial`, `OrbitControls`, `MeshTransmissionMaterial`, `MeshDistortMaterial`, `MeshWobbleMaterial`, `Line`, `Html`, `Text`, `Environment`, `PerspectiveCamera`, `Ring`, `Sphere`

### UI Components
- **@base-ui/react** `^1.4.0` — headless UI primitives
- **shadcn** `^4.3.0` — component scaffolding (shadcn/ui)
- **lucide-react** `^0.546.0` — icon library

### AI / Chatbot
- **@google/genai** `^1.50.1` — Google Gemini SDK (used via `GEMINI_API_KEY` env var, injected at build time via `vite.config.ts` `define`)

---

## Backend

### Framework & Server
- **Express** `^4.21.2` — HTTP server
- **cors** `^2.8.5` — CORS middleware (origin: true, credentials: true)

### Database
- **Mongoose** `^8.13.2` — MongoDB ODM
- **MongoDB** — local (`mongodb://127.0.0.1:27017/nexyrasoft`) or Atlas via env

### Authentication
- **jsonwebtoken** `^9.0.2` — JWT issuance and verification
- **bcryptjs** `^3.0.2` — password hashing

### Email
- **nodemailer** `^6.10.1` — SMTP email via Gmail (configurable SMTP host)

### Config & Dev
- **dotenv** `^17.2.3` — environment variable loading
- **tsx** `^4.21.0` — TypeScript execution for server (`tsx watch` for dev)

---

## Dev Dependencies

| Package | Purpose |
|---------|---------|
| `@types/cors` `@types/express` `@types/jsonwebtoken` `@types/node` `@types/nodemailer` | TypeScript types |
| `autoprefixer` `^10.4.21` | CSS vendor prefixing |
| `typescript` `~5.8.2` | Compiler |

---

## Environment Variables

| Variable | Used By | Description |
|----------|---------|-------------|
| `PORT` | Server | Express listen port (default 5000) |
| `MONGODB_URI` | Server | MongoDB connection string |
| `JWT_SECRET` | Server | JWT signing secret |
| `CLIENT_URL` | Server | Allowed client origin |
| `VITE_API_URL` | Client | API base URL (injected via import.meta.env) |
| `GEMINI_API_KEY` | Client | Google Gemini AI key (build-time inject) |
| `SMTP_HOST/PORT/SECURE/USER/PASS/FROM_NAME` | Server | Email service config |
| `COMPANY_NOTIFICATION_EMAIL` | Server | Recipient for contact/lead notifications |

---

## Scripts

| Script | Command |
|--------|---------|
| `dev` | `vite --port=3000 --host=0.0.0.0` |
| `build` | `vite build` |
| `preview` | `vite preview` |
| `lint` | `tsc --noEmit` |
| `server:dev` | `tsx watch server/src/index.ts` |
| `server:start` | `tsx server/src/index.ts` |

---

## Notable Patterns

- **Path alias**: `@` → `./src` (configured in `vite.config.ts` and `tsconfig.json`)
- **HMR**: Disabled via `DISABLE_HMR=true` env var (AI Studio compatibility)
- **Gemini key**: Injected at build time via `vite.config.ts` `define` block — not prefixed with `VITE_` in `.env`
- **Tailwind v4**: Uses `@tailwindcss/vite` plugin directly — no `tailwind.config.js` or PostCSS config needed
