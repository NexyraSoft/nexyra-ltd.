# CONCERNS.md — NexyraSoft Technical Concerns
> Generated: 2026-04-28 | Focus: concerns | Scanner: gsd-map-codebase

---

## Severity Legend
- 🔴 **Critical** — Security/data risk or severe UX regression
- 🟠 **High** — Significant performance or reliability issue
- 🟡 **Medium** — Technical debt or maintainability issue
- 🔵 **Low** — Polish, minor inconsistency, future consideration

---

## Security

### 🔴 Gemini API Key Exposed in Client Bundle
- **File:** `vite.config.ts` (L11), `.env`
- **Issue:** `GEMINI_API_KEY` is injected at build time via Vite `define` and inlined into the JS bundle. Any user who opens DevTools can read it.
- **Impact:** Key theft, abuse of Gemini quota, potential billing impact.
- **Fix:** Move all Gemini calls server-side only. The `/api/chatbot` proxy already exists — remove the client-side Gemini SDK usage entirely.

### 🔴 No Client-Side Route Guard on `/admin`
- **File:** `src/App.tsx` (L70), `src/pages/admin/AdminDashboard.tsx`
- **Issue:** The `/admin` route renders `AdminDashboard` without a React-level auth check. `AdminDashboard` performs an API call on mount and redirects to `/admin/login` if it fails — but the component renders first, briefly exposing the admin UI shell.
- **Fix:** Implement a `<ProtectedRoute>` wrapper component that checks `authService.getToken()` and redirects before rendering children.

### 🟠 Public Signup Endpoint Disabled via Code, Not Route
- **File:** `server/src/controllers/authController.ts` (L28-30)
- **Issue:** `POST /api/auth/signup` exists as a route but returns `403` from the controller. The route is still accessible and discoverable.
- **Fix:** Remove the signup route entirely from `authRoutes.ts` rather than handling it in the controller.

### 🟠 JWT Stored in `localStorage`
- **File:** `src/lib/auth.ts` (L31-33), key: `nexyrasoft_token`
- **Issue:** `localStorage` is accessible to any JS on the page. XSS attack can steal the token.
- **Server already sets HttpOnly cookie** (`nexyrasoft_session`) — the client should use the cookie-based flow exclusively and not store JWT in localStorage.
- **Fix:** Remove `saveToken` / `getToken` / `clearToken` localStorage helpers. Rely on the HttpOnly cookie the server already sets.

### 🟡 CORS Origin Set to `true` (Any Origin)
- **File:** `server/src/app.ts` (L19-23)
- **Issue:** `origin: true` mirrors the request origin — effectively allows all origins.
- **Fix:** Restrict to `CLIENT_URL` from env: `origin: env.clientUrl`.

### 🟡 Validation Regex Duplicated (Frontend ↔ Backend)
- **Files:** `src/lib/formValidation.ts`, `server/src/controllers/authController.ts`, `server/src/controllers/contactController.ts`
- **Issue:** `isValidName`, `isValidPhone`, `isEmail` regexes are defined independently in each controller. A change to validation rules must be applied in 3+ places.
- **Fix:** Create a shared `server/src/utils/validators.ts` and import from there.

---

## Performance

### 🔴 O(n²) Frame Loop in Background3D
- **File:** `src/components/ui/Background3D.tsx` (L88-117, `Lines` component)
- **Issue:** Every animation frame, all 100×100 point pairs are checked for proximity (4,950 iterations/frame at 60fps = ~300,000 ops/sec). This runs continuously while `Background3D` is mounted.
- **Impact:** Degrades main thread performance, especially on mobile. Known cause of startup lag.
- **Fix:** Use a spatial hash or reduce node count significantly. Or pre-compute static connections and only update positions, not topology.

### 🟠 Two Simultaneous WebGL Contexts at Hero Page Load
- **Files:** `src/components/ui/Preloader.tsx`, `src/components/ui/Background3D.tsx`, `src/components/sections/Hero.tsx`
- **Issue:** During the 2.5–3s preloader window, both the Preloader canvas AND the Hero scene canvas (deferred to 2500ms) may initialize simultaneously, competing for GPU resources.
- **Mitigation in place:** Background3D deferred to 2800ms (after preloader exit). Hero deferred to 2500ms. But overlap still possible.
- **Fix:** Mount Hero canvas only after `isVisible` state confirmed preloader has exited.

### 🟠 Hero.tsx File Complexity (957 lines, 33.5KB)
- **File:** `src/components/sections/Hero.tsx`
- **Issue:** Single file contains 8+ sub-components (`ExpertiseTicker`, `ServicesOrbit`, `SoftwareIconCore`, `OrbitingRing`, `HudBase`, `ConnectionLines`, `ParticleCloud`, `ScienceScene`, `Hero`). Difficult to test, maintain, or optimize individually.
- **Fix:** Extract into `src/components/hero/` subdirectory with individual files per component.

### 🟡 MeshTransmissionMaterial with High Sample Count
- **File:** `src/components/sections/Hero.tsx` (L452-469)
- **Issue:** `MeshTransmissionMaterial` with `samples={16}` is expensive — especially on mobile. Uses full refraction simulation.
- **Fix:** Reduce `samples` to 4-8, or swap to a cheaper glass-like material on mobile breakpoints.

### 🟡 Drei CDN Asset (No Local Fallback)
- **File:** `src/components/sections/Hero.tsx` (L494)
- **Issue:** `new THREE.TextureLoader().load('https://raw.githubusercontent.com/pmndrs/drei-assets/...')` — fetches from GitHub CDN at runtime.
- **Impact:** 404 on CDN failure silently breaks the shadow halo. Also creates a new `TextureLoader` instance per render (memory leak if component re-renders).
- **Fix:** Download asset to `src/assets/`, import it statically. Move `TextureLoader` to `useMemo`.

---

## Technical Debt

### 🟠 No Test Suite
- **Scope:** Entire codebase
- **Issue:** Zero automated tests — no unit, integration, or E2E tests.
- **Risk:** Any refactor or new feature can silently break form validation, auth flow, or chatbot.
- **Priority areas:** Auth middleware, form validation parity, chatbot intent classification, email error handling.

### 🟠 Chatbot is Keyword-Matching, Not AI
- **File:** `server/src/controllers/chatbotController.ts`
- **Issue:** Despite `@google/genai` being installed, the chatbot uses a pure keyword `classifyIntent()` function — no Gemini API calls are made server-side. The AI SDK on the client is either unused or proxied through this controller.
- **Impact:** Chatbot quality is limited to hard-coded keyword lists. No contextual understanding.
- **Fix:** Wire `chatbotController` to `@google/genai` for actual AI responses.

### 🟡 AdminDashboard Fetches All Data in Parallel Regardless of Tab
- **File:** `src/pages/admin/AdminDashboard.tsx` (L98-107)
- **Issue:** `Promise.all([summary, contacts, clients, projects, leads, tasks, vacancies, users])` — all 8 requests fire on mount even if the user only needs one tab's data.
- **Fix:** Lazy-load data per tab as the user navigates.

### 🟡 No Pagination on Admin Lists
- **Files:** `server/src/controllers/*Controller.ts`, `src/components/admin/*CRUD.tsx`
- **Issue:** All CRUD endpoints return all records (`find().sort(...)` with no `limit`/`skip`). At scale this will fail.
- **Fix:** Add `page`/`limit` query params server-side and paginate CRUD components.

### 🟡 Social Links are Placeholder `#`
- **File:** `src/components/sections/Contact.tsx` (L121-125)
- **Issue:** Facebook, LinkedIn, Instagram links point to `"#"` — dead links in production.
- **Fix:** Add real social URLs to `src/constants/siteData.ts` and reference from there.

### 🔵 No ESLint / Prettier Config
- **Scope:** Entire repo
- **Issue:** No `.eslintrc`, no `.prettierrc`. Mixed CRLF/LF line endings in some files. No automated formatting gate.
- **Fix:** Add `eslint` + `@typescript-eslint` + `eslint-plugin-react` + `prettier` with Vite-compatible config.

### 🔵 `test-api.js` / `test-login.js` at Root
- **Files:** `test-api.js`, `test-login.js`
- **Issue:** Loose test scripts at project root — not in `/scripts`, not npm-executable, no assertions.
- **Fix:** Move to `server/src/scripts/` or replace with proper test suite.

### 🔵 `metadata.json` at Root (Unclear Purpose)
- **File:** `metadata.json`
- **Issue:** File exists at root but purpose is unclear without documentation.

---

## Summary Table

| # | Concern | Severity | File(s) |
|---|---------|----------|---------|
| 1 | Gemini key in client bundle | 🔴 Critical | `vite.config.ts` |
| 2 | No client-side auth guard on `/admin` | 🔴 Critical | `App.tsx`, `AdminDashboard.tsx` |
| 3 | O(n²) frame loop in Background3D | 🔴 Critical | `Background3D.tsx` |
| 4 | Public signup route not removed | 🟠 High | `authRoutes.ts`, `authController.ts` |
| 5 | JWT in localStorage (XSS risk) | 🟠 High | `src/lib/auth.ts` |
| 6 | Two WebGL contexts overlap | 🟠 High | `Preloader.tsx`, `Background3D.tsx`, `Hero.tsx` |
| 7 | Hero.tsx monolithic (957 lines) | 🟠 High | `Hero.tsx` |
| 8 | No test suite | 🟠 High | Entire codebase |
| 9 | Chatbot not using AI | 🟠 High | `chatbotController.ts` |
| 10 | CORS accepts all origins | 🟡 Medium | `server/src/app.ts` |
| 11 | Validation regex duplicated | 🟡 Medium | Multiple controllers |
| 12 | No pagination on admin lists | 🟡 Medium | All CRUD endpoints |
| 13 | All dashboard data fetched on mount | 🟡 Medium | `AdminDashboard.tsx` |
| 14 | High MeshTransmissionMaterial samples | 🟡 Medium | `Hero.tsx` |
| 15 | Drei CDN asset — no local fallback | 🟡 Medium | `Hero.tsx` |
| 16 | Social links are `#` placeholders | 🔵 Low | `Contact.tsx` |
| 17 | No ESLint/Prettier | 🔵 Low | Entire repo |
| 18 | Mixed CRLF/LF line endings | 🔵 Low | Multiple `.tsx` files |
