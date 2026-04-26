# Technical Concerns

**Last Updated:** 2026-04-26

## Technical Debt
- **Testing**: No automated tests found in the repository.
- **Monorepo Structure**: Frontend and backend dependencies are mixed in a single `package.json`.

## Security
- **Authentication**: JWT is used, but need to ensure tokens are stored securely on the frontend (e.g., HttpOnly cookies vs localStorage).
