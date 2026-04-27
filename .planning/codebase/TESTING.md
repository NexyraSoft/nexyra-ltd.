# TESTING.md — NexyraSoft Testing Practices
> Generated: 2026-04-28 | Focus: quality | Scanner: gsd-map-codebase

---

## Current State

> ⚠️ **No automated test suite exists.** This project has zero test files across both frontend and backend.

---

## What Exists

| Item | Location | Notes |
|------|----------|-------|
| Manual API test | `test-api.js` (root) | One-off script — not automated |
| Manual login test | `test-login.js` (root) | One-off script — not automated |
| TypeScript check | `npm run lint` → `tsc --noEmit` | Type-level validation only, not runtime |

---

## Test Frameworks

| Layer | Framework | Status |
|-------|-----------|--------|
| Frontend unit/component | None | ❌ Not configured |
| Frontend E2E | None | ❌ Not configured |
| Backend unit | None | ❌ Not configured |
| Backend integration | None | ❌ Not configured |
| CI/CD pipeline | None | ❌ No `.github/workflows` or similar |

---

## Manual Test Scripts

### `test-api.js`
- Minimal script to hit the API directly
- Not integrated into `package.json` scripts

### `test-login.js`
- Manual login flow verification
- Not integrated into `package.json` scripts

---

## Recommendations (for future implementation)

### Frontend
- **Vitest** — natural fit for Vite projects (same config ecosystem)
- **React Testing Library** — component behavior testing
- **Playwright** or **Cypress** — E2E testing for user flows (forms, chatbot, modals)

### Backend
- **Vitest** or **Jest** — unit/integration tests for controllers and services
- **Supertest** — HTTP integration tests against Express app
- **mongodb-memory-server** — in-memory MongoDB for isolated DB tests

### Priority test areas (highest risk currently untested)
1. Contact form validation (front and back end parity)
2. Auth flow — login, JWT issuance, middleware guard
3. Lead creation (Get Started, Service Request)
4. Chatbot intent classification (`classifyIntent` in `chatbotController.ts`)
5. Email service error handling (save-but-email-failed partial success)
6. Admin role-based access (admin vs editor scope)
