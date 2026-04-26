# Conventions

**Last Updated:** 2026-04-26

## Coding Standards
- **Language**: TypeScript across both frontend and backend.
- **Module System**: ESM (`"type": "module"` in package.json).
- **Styling**: Tailwind CSS classes.

## Naming
- Components: PascalCase (e.g. `Preloader.tsx`).
- Utilities/Hooks: camelCase.
- Backend Routes/Controllers: camelCase (e.g. `authRoutes.ts`).

## Error Handling
- Backend uses a centralized error handler middleware (`errorHandler`).
