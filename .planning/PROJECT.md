# Nexyrasoft Premium Digital Solutions

## What This Is

A comprehensive IT company website that offers custom development services, managed IT, and SaaS products. It serves as both a marketing site to drive leads (booking calls) and an operational platform with an admin dashboard for content and user management.

## Core Value

Providing a seamless, professional digital presence that builds trust through case studies and effectively captures leads while allowing easy internal management.

## Requirements

### Validated

- ✓ Frontend SPA with React/Vite — existing
- ✓ Public marketing pages (Home, About, Services, Contact, Careers, etc.) — existing
- ✓ Backend Express API with MongoDB connection — existing
- ✓ Admin Login and Dashboard skeleton — existing
- ✓ 3D Background and modern UI elements — existing

### Active

- [ ] Connect career section to admin page to manage and post job vacancies dynamically
- [ ] Add drag option/support in the expertise slideshow section for better UX
- [ ] Implement role-based user creation and management in the admin dashboard
- [ ] Make the chatbox fully functional

### Out of Scope

- [Advanced SaaS Billing] — Not requested for this phase, focus is on content management and engagement
- [Complex Ticketing System] — Defer to future phase; focus is on lead generation first

## Context

- The project is an existing monolithic full-stack app (React frontend + Express backend).
- The primary goal for visitors is to schedule a consultation/book a call and view the portfolio/case studies.
- The user wants to polish the existing application and make key sections dynamic (Careers) and interactive (Slideshow, Chatbox).

## Constraints

- **Tech Stack**: Must use the existing stack (React 19, Vite, Tailwind CSS, Express, MongoDB, Node.js).
- **Architecture**: Must integrate with the existing Admin Dashboard patterns.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Manage Vacancies via Admin | Hardcoding jobs is unscalable; needs a CMS-like approach | — Pending |
| Role-based Admin Users | Different team members need different access levels | — Pending |

---
*Last updated: 2026-04-26 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
