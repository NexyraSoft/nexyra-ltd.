# Nexyrasoft Premium Digital Solutions

## What This Is

Nexyrasoft is a comprehensive IT company offering custom software development, managed IT services (MSP), and proprietary SaaS products. The project is an ongoing enhancement of the existing React/Express application to build out dynamic capabilities, starting with a careers portal, role-based admin access, and UI improvements.

## Core Value

To drive leads and build trust by providing a fast, visually stunning, and feature-complete IT services and product portal.

## Requirements

### Validated

- ✓ Component-based React SPA frontend with routing (Vite, Tailwind CSS, 3D graphics)
- ✓ Express backend API connected to MongoDB via Mongoose
- ✓ Core marketing pages (Home, Services, Tools, About, Contact)
- ✓ Basic Admin Dashboard and Authentication framework

### Active

- [ ] **Dynamic Careers Portal**: Connect the public Careers section to the Admin dashboard to allow posting and managing job vacancies.
- [ ] **Role-Based Access Control**: Ability to create and manage users based on roles (e.g., admin, editor, HR) within the Admin Dashboard.
- [ ] **UI Enhancements**: Add a drag-to-scroll option in the expertise slideshow section.

### Out of Scope

- Comprehensive Applicant Tracking System (ATS) — For v1, simple job postings are sufficient; full ATS capabilities are deferred.
- Complex SaaS product features — Focus is currently on marketing and internal admin tooling.

## Context

- **Environment**: Monolithic full-stack structure (React frontend + Express backend in the same repo).
- **Current State**: The UI is largely built out, but many data-driven sections (like Careers) are currently static or require admin integration.
- **Goals**: Move from static sections to dynamic, admin-controlled content, while ensuring the admin portal is secure through role-based access.

## Constraints

- **Tech Stack**: Must use the existing stack (TypeScript, React 19, Tailwind CSS, Express, MongoDB).
- **Security**: Role-based access must securely restrict backend endpoints and frontend admin views.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Implement RBAC | Needed to securely delegate admin tasks (like posting jobs) without giving full superuser access | — Pending |
| Extend MongoDB Schema | Mongoose is already configured; adding Job and User Role models is the most efficient path | — Pending |

---
*Last updated: 2026-04-26 after initialization*
