# INTEGRATIONS.md — NexyraSoft External Integrations
> Generated: 2026-04-28 | Focus: tech+arch | Scanner: gsd-scan

---

## Google Gemini AI

| Property | Value |
|----------|-------|
| Package | `@google/genai` `^1.50.1` |
| Key source | `GEMINI_API_KEY` env var (build-time inject via Vite `define`) |
| Usage | Chatbot (`Chatbot.tsx`) + backend AI proxy (`chatbotController.ts`, `chatbotRoutes.ts`) |
| Pattern | Frontend calls `/api/chatbot`; server proxies to Gemini and returns structured `ChatbotResponse` (reply, cta, suggestions, action) |

---

## MongoDB (via Mongoose)

| Property | Value |
|----------|-------|
| Package | `mongoose` `^8.13.2` |
| Config | `MONGODB_URI` env var; local: `mongodb://127.0.0.1:27017/nexyrasoft` |
| Connection | `server/src/config/db.ts` → `connectDatabase()` called at startup |
| Models | User, Client, Lead, Project, Task, JobVacancy, ContactMessage |

---

## Email (SMTP via Nodemailer)

| Property | Value |
|----------|-------|
| Package | `nodemailer` `^6.10.1` |
| Service | Gmail SMTP (configurable via `SMTP_*` env vars) |
| Implementation | `server/src/services/emailService.ts` |
| Triggers | Contact form submissions, "Get Started" leads, job applications |
| Notification | Company receives email to `COMPANY_NOTIFICATION_EMAIL` |

---

## Drei Assets CDN (Three.js)

| Property | Value |
|----------|-------|
| URL | `https://raw.githubusercontent.com/pmndrs/drei-assets/master/light-halo.png` |
| Usage | Hero 3D scene shadow plane texture (`SoftwareIconCore`) |
| Risk | External CDN dependency — no local fallback; network failure degrades visual only |

---

## Internal API (Self-hosted REST)

| Property | Value |
|----------|-------|
| Base URL | `VITE_API_URL` (default `http://localhost:5000/api`) |
| Client | `src/lib/api.ts` → generic `apiRequest<T>()` wrapper using native `fetch` |
| Auth | Bearer JWT token in `Authorization` header; also `credentials: "include"` |
| Endpoints | `/api/auth`, `/api/chatbot`, `/api/contact`, `/api/dashboard`, `/api/careers`, `/api/clients`, `/api/projects`, `/api/leads`, `/api/tasks`, `/api/users`, `/api/vacancies` |

---

## Form Submission Services (`src/lib/forms.ts`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `submitContact()` | `POST /api/contact` | Public contact form |
| `submitGetStarted()` | `POST /api/contact/get-started` | "Get Started" modal lead |
| `submitJobApplication()` | `POST /api/careers/apply` | Careers job application |
| `submitChatbotMessage()` | `POST /api/chatbot` | AI chatbot query |

---

## Auth Integration (`src/lib/auth.ts`)

- JWT stored client-side (localStorage or cookie — server issues via `jsonwebtoken`)
- `bcryptjs` used server-side for password hashing
- Protected routes on server use `server/src/middleware/auth.ts` (JWT verify middleware)
- Admin dashboard requires valid JWT — `AdminDashboard.tsx` checks auth state via `src/lib/auth.ts`
