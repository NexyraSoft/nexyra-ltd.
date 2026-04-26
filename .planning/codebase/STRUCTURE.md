# Directory Structure

**Last Updated:** 2026-04-26

## Root Directory
- `src/` - Frontend React application
  - `components/`
    - `ui/` - Reusable interface components (shadcn-like)
    - `sections/` - Major page sections
    - `layout/` - Navbar, Footer, etc.
  - `pages/` - Full page components (e.g. admin)
  - `lib/` - Shared utilities
  - `constants/` - Application constants
  - `assets/` - Static files
- `server/` - Backend Express application
  - `src/`
    - `routes/` - Express route definitions
    - `controllers/` - Request handlers
    - `services/` - Business logic
    - `models/` - Mongoose database schemas
    - `middleware/` - Express middlewares (auth, errors)
    - `config/` - Environment and DB setup
    - `utils/` - Backend helpers
