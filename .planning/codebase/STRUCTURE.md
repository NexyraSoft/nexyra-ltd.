# STRUCTURE.md — NexyraSoft Codebase Structure
> Generated: 2026-04-28 | Focus: tech+arch | Scanner: gsd-scan

---

## Root Layout

```
nexyrasoft---premium-digital-solutions/
├── .env                        # Live environment variables (gitignored)
├── .env.example                # Environment variable template
├── .gitignore
├── .planning/                  # GSD planning directory
├── index.html                  # Vite HTML entry point
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config (path alias @→./src)
├── vite.config.ts              # Vite build config (React, Tailwind v4, env inject)
├── metadata.json               # Project metadata
├── README.md
├── BACKEND_SETUP.md            # Backend setup instructions
├── test-api.js                 # Manual API test script
├── test-login.js               # Manual login test script
├── dist/                       # Production build output
├── node_modules/
├── src/                        # Frontend source
└── server/                     # Backend source
```

---

## Frontend (`src/`)

```
src/
├── main.tsx                    # React app entry — renders <App /> into #root
├── App.tsx                     # Root component: Router, layout shell, global state
├── index.css                   # Global styles (Tailwind base + custom vars/utilities)
├── types.ts                    # Shared TypeScript interfaces (Service, ProcessStep, NavLink, JobRole)
├── vite-env.d.ts               # Vite env type declarations
│
├── assets/                     # Static assets (images, icons, fonts)
│
├── constants/
│   └── siteData.ts             # SERVICES array (slug, title, icon, description, process, features)
│                               # Referenced by Hero ServicesOrbit and ServiceDetail
│
├── lib/                        # Utility/service modules
│   ├── api.ts                  # Generic apiRequest<T>() fetch wrapper + API_BASE_URL
│   ├── auth.ts                 # Auth helpers (JWT, admin state)
│   ├── admin.ts                # Admin dashboard API calls (CRUD operations)
│   ├── forms.ts                # Form submission service (contact, get-started, chatbot, careers)
│   ├── formValidation.ts       # Regex patterns, sanitizers (name, phone, message)
│   ├── careers.ts              # Careers page API helpers
│   └── utils.ts                # General utility functions
│
├── pages/
│   └── admin/
│       ├── AdminDashboard.tsx  # Full admin CRUD dashboard (14.9KB — tabs: clients, leads, projects, tasks, users, vacancies)
│       └── AdminLogin.tsx      # Admin login form with JWT auth
│
└── components/
    ├── layout/
    │   ├── Navbar.tsx          # Top navigation bar with mobile hamburger (5KB)
    │   └── Footer.tsx          # Site footer with links, social, legal (7.6KB)
    │
    ├── sections/               # Page-level content sections
    │   ├── Hero.tsx            # 🔴 LARGEST FILE (33KB, 957 lines) — full 3D hero with R3F scene
    │   ├── Services.tsx        # Services overview grid (2KB)
    │   ├── ServiceDetail.tsx   # Dynamic service detail page by :slug (6.4KB)
    │   ├── Tools.tsx           # Tech tools/stack showcase (6.2KB)
    │   ├── About.tsx           # About section (3.8KB)
    │   ├── Process.tsx         # Development process steps (1.8KB)
    │   ├── Contact.tsx         # Contact form section (10.2KB)
    │   ├── Careers.tsx         # Job listings + application form (12.4KB)
    │   ├── Privacy.tsx         # Privacy policy page (3.4KB)
    │   └── Terms.tsx           # Terms of service page (3.4KB)
    │
    └── ui/                     # Reusable UI components
        ├── Background3D.tsx    # Fixed full-viewport neural network WebGL background
        ├── Preloader.tsx       # Full-screen 3D intro animation (mounts on load, unmounts at 3s)
        ├── Chatbot.tsx         # Floating AI chatbot widget (19.4KB, 491 lines) — Gemini-backed
        ├── GetStartedModal.tsx # "Get Started" lead capture modal (7.9KB)
        ├── GetServiceModal.tsx # Service-specific inquiry modal (9.5KB)
        ├── Logo.tsx            # SVG logo component (1.8KB)
        └── button.tsx          # shadcn/CVA base button component
```

---

## Backend (`server/`)

```
server/
└── src/
    ├── index.ts                # Startup: connectDatabase() → app.listen(PORT)
    ├── app.ts                  # Express app: CORS, JSON body, route mounts, errorHandler
    │
    ├── config/
    │   ├── db.ts               # Mongoose connection (connectDatabase)
    │   └── env.ts              # Env var validation and typed export
    │
    ├── middleware/
    │   ├── auth.ts             # JWT verification middleware (protects admin routes)
    │   └── errorHandler.ts     # Global Express error handler → JSON response
    │
    ├── routes/                 # Thin route files — delegate to controllers
    │   ├── authRoutes.ts       # POST /api/auth/login, /logout, /me
    │   ├── chatbotRoutes.ts    # POST /api/chatbot
    │   ├── contactRoutes.ts    # POST /api/contact, /api/contact/get-started
    │   ├── dashboardRoutes.ts  # GET /api/dashboard (stats)
    │   ├── careersRoutes.ts    # POST /api/careers/apply
    │   ├── clientRoutes.ts     # CRUD /api/clients
    │   ├── projectRoutes.ts    # CRUD /api/projects
    │   ├── leadRoutes.ts       # CRUD /api/leads
    │   ├── taskRoutes.ts       # CRUD /api/tasks
    │   ├── userRoutes.ts       # CRUD /api/users
    │   └── vacancyRoutes.ts    # CRUD /api/vacancies
    │
    ├── controllers/            # Business logic per domain
    │   ├── authController.ts   # Login, JWT issue, password verify (5.5KB)
    │   ├── chatbotController.ts# Gemini AI proxy, structured response (6.2KB)
    │   ├── contactController.ts# Contact + get-started + email notifications (7KB)
    │   ├── clientController.ts # Client CRUD ops (2KB)
    │   ├── dashboardController.ts # Dashboard stats aggregation
    │   ├── leadController.ts   # Lead CRUD (1.4KB)
    │   ├── projectController.ts# Project CRUD (2.3KB)
    │   ├── taskController.ts   # Task CRUD (2.1KB)
    │   └── vacancyController.ts# Job vacancy CRUD (2.8KB)
    │
    ├── models/                 # Mongoose schemas + TypeScript interfaces
    │   ├── User.ts             # Admin user (email, passwordHash, role)
    │   ├── Client.ts           # Client record
    │   ├── Lead.ts             # Sales lead (name, email, phone, message, source)
    │   ├── Project.ts          # Project (title, client, status, dates)
    │   ├── Task.ts             # Task (title, project, assignee, status)
    │   ├── JobVacancy.ts       # Job posting (title, description, requirements, status)
    │   └── ContactMessage.ts   # Contact form submission
    │
    ├── services/
    │   └── emailService.ts     # Nodemailer transporter + send helpers (7KB)
    │
    ├── types/                  # Server-side TypeScript type definitions
    ├── scripts/                # One-off admin scripts (e.g., seed, migration)
    └── utils/                  # Server utilities
```

---

## Component Size Reference

| File | Size | Lines | Notes |
|------|------|-------|-------|
| `Hero.tsx` | 33.5KB | 957 | Largest file — full 3D hero scene with R3F |
| `Chatbot.tsx` | 19.4KB | 491 | AI chatbot, capture forms, quick replies |
| `AdminDashboard.tsx` | 14.9KB | — | Multi-tab CRUD UI |
| `VacanciesCRUD.tsx` | 11.7KB | — | |
| `Careers.tsx` | 12.4KB | — | |
| `Contact.tsx` | 10.2KB | — | |
| `GetServiceModal.tsx` | 9.5KB | — | |

---

## Path Aliases

| Alias | Resolves To |
|-------|-------------|
| `@` | `./src` |

Usage example: `import { apiRequest } from "@/lib/api"`
