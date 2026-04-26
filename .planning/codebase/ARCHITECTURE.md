# Architecture

**Last Updated:** 2026-04-26

## System Overview
- **Type**: Monolithic full-stack application (frontend + backend in one repo)
- **Pattern**: Client-Server architecture.

## Frontend
- **Pattern**: Component-based React SPA.
- **Layers**: Pages -> Sections -> UI Components.
- **State**: React state (useState).
- **Entry point**: `src/main.tsx` -> `src/App.tsx`.

## Backend
- **Pattern**: Express MVC-like API.
- **Layers**: Routes -> Controllers -> Services -> Models.
- **Data Access**: Mongoose models.
- **Entry point**: `server/src/index.ts` -> `server/src/app.ts`.
