# CONVENTIONS.md — NexyraSoft Coding Conventions
> Generated: 2026-04-28 | Focus: quality | Scanner: gsd-map-codebase

---

## Language & Compilation

- **TypeScript** strict-ish — `tsconfig.json` uses `ES2022` target, `bundler` module resolution, `isolatedModules: true`, `noEmit: true` (build is handled by Vite)
- `allowJs: true` — JS files are accepted (e.g. `test-api.js`, `test-login.js` at root)
- `skipLibCheck: true` — third-party type errors suppressed
- `experimentalDecorators: true` — enabled (for Mongoose schema patterns)
- No `strict: true` in tsconfig — type safety is enforced via code review patterns rather than compiler flags
- Lint command: `tsc --noEmit` (no ESLint configured)

---

## File & Naming Conventions

### Frontend (`src/`)
| Entity | Convention | Example |
|--------|-----------|---------|
| Components | PascalCase `.tsx` | `Hero.tsx`, `Background3D.tsx` |
| Pages | PascalCase `.tsx` | `AdminDashboard.tsx` |
| Lib/utilities | camelCase `.ts` | `formValidation.ts`, `api.ts` |
| Constants | camelCase `.ts` | `siteData.ts` |
| Types | camelCase `.ts` | `types.ts` |
| Named exports | Preferred for components | `export const Hero = ...` |
| Default exports | Used for pages only | `export default AdminDashboard` |

### Backend (`server/src/`)
| Entity | Convention | Example |
|--------|-----------|---------|
| Controllers | camelCase file, named exports | `authController.ts` → `export const login` |
| Routes | camelCase file | `authRoutes.ts` |
| Models | PascalCase file | `User.ts`, `ContactMessage.ts` |
| Middleware | camelCase file | `auth.ts`, `errorHandler.ts` |
| Services | camelCase file | `emailService.ts` |

---

## Component Patterns

### React Component Structure
```tsx
// Named export (preferred for non-page components)
export const MyComponent = ({ prop }: { prop: string }) => {
  const [state, setState] = useState(false);
  
  useEffect(() => { ... }, []);
  
  return (...);
};
```

### Props Types
- Inline interface in the same file (not extracted unless shared):
  ```tsx
  interface HeroProps { onGetStartedClick: () => void; }
  export const Hero = ({ onGetStartedClick }: HeroProps) => ...
  ```
- Shared types live in `src/types.ts` (Service, ProcessStep, NavLink, JobRole)

### State Management Pattern
- Local `useState` + `useEffect` — no global store
- State lifted to nearest common ancestor (`isGetStartedModalOpen` in `App.tsx`)
- Async state follows: `isLoading`, `error`, `data` trio pattern (see `AdminDashboard.tsx`)

### Error Handling in Components
```tsx
try {
  const response = await someService.call(payload);
  setStatus({ type: "success", message: response.message });
} catch (error) {
  setStatus({
    type: "error",
    message: error instanceof Error ? error.message : "Fallback message.",
  });
} finally {
  setIsSubmitting(false);
}
```
- Always use `error instanceof Error` check before accessing `.message`
- Provide meaningful fallback strings

---

## API / Service Layer Patterns

### Frontend API calls via `src/lib/api.ts`
```ts
// Generic typed fetch wrapper
export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { ... });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message ?? "Request failed.");
  return data as T;
}
```
- Always typed with generics: `apiRequest<{ message: string }>`
- HTTP errors throw `Error` — callers use `try/catch`

### Service objects (facade pattern)
```ts
export const formService = {
  submitContact: (payload: {...}) => apiRequest<{ message: string }>("/contact", { method: "POST", body: payload }),
};
```
- Methods grouped by domain (`formService`, `authService`, `adminService`)
- No axios — uses native `fetch`

---

## Form Validation Conventions

### Frontend
- HTML5 built-in validation via `pattern`, `minLength`, `maxLength`, `required`
- Centralized regex constants in `src/lib/formValidation.ts`:
  - `NAME_PATTERN`, `PHONE_PATTERN` for `pattern` prop
  - `NAME_TITLE`, `PHONE_TITLE`, `MESSAGE_TITLE` for `title` prop (tooltip)
- Input sanitizers: `sanitizeNameInput()`, `sanitizePhoneInput()` — strip bad chars inline in `onChange`

### Backend (server-side validation)
- Inline regex helpers per controller (not shared library):
  ```ts
  const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isValidName = (value: string) => /^[A-Za-z][A-Za-z .'-]{1,49}$/.test(value);
  const isValidPhone = (value: string) => /^(?:\+[1-9]\d{7,14}|\d{7,15})$/.test(value);
  const hasValidMessageLength = (value: string) => value.trim().length >= 10 && value.trim().length <= 1000;
  ```
- Pattern: destructure body → normalize with `?.trim() ?? ""` → validate → 400 early return → save → email → 201 response

> ⚠️ **Inconsistency:** Frontend and backend validation regexes are duplicated in multiple controllers (`authController.ts`, `contactController.ts`) — not shared.

---

## Backend Controller Conventions

### Response shape
```ts
// Success
res.status(201).json({ message: "...", [entity]: data });
// Error
res.status(400).json({ message: "Human-readable error." });
// Unauthorized
res.status(401).json({ message: "Authorization is required." });
```

### Auth middleware chain
```ts
router.post("/route", requireAuth, requireAdmin, controller);
// OR
router.get("/route", requireAuth, requireRole("admin", "editor"), controller);
```

### Mongoose patterns
- `InferSchemaType<typeof schema>` for Mongoose model types
- `timestamps: true` on all schemas — automatic `createdAt`, `updatedAt`
- Always `.select("-password")` when returning user documents
- `populate()` for references: `Project.findById(id).populate("client", "name company email")`

---

## Styling Conventions

### Tailwind CSS v4
- Utility-first classes directly on JSX elements
- No separate CSS modules or styled-components
- `tw-animate-css` for common animation utilities
- `clsx` + `tailwind-merge` for conditional class logic
- **Color palette**: `maroon-800`, `maroon-900`, `slate-*` — custom maroon scale defined in `index.css`
- **Glassmorphism pattern**: `bg-white/70 backdrop-blur-xl border border-white/20` (used extensively in admin)

### Custom CSS classes (in `index.css`)
- `.glass` — glassmorphism utility
- `.text-gradient` — maroon gradient text
- `.font-display` — display font class

---

## Animation Conventions

- **Framer Motion (motion v12)** — `motion.div`, `AnimatePresence`
- Common pattern: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}`
- Exit animations use `AnimatePresence` wrapper with `exit` prop
- R3F animations use `useFrame` hook with `state.clock.getElapsedTime()` + `THREE.MathUtils.lerp`

---

## Git / File Hygiene

- No `.eslintrc` or `.prettierrc` found — no automated code formatting enforced
- `tsc --noEmit` is the only linting gate
- `test-api.js` and `test-login.js` at root are manual test scripts, not automated
- `\r\n` line endings present in some TSX files (e.g. `Contact.tsx`, `App.tsx`) — mixed CRLF/LF
