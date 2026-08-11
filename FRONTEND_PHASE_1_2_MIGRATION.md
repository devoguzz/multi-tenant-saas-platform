# FRONTEND PHASE 1.2 — FRAMEWORK & TOOLING MIGRATION

## Context

Frontend Phase 1 and Phase 1.1 are complete.

The existing application currently includes:

- Authentication UI
- Registration UI
- Onboarding UI
- Responsive application shell
- Dashboard
- Workspace switching
- Frontend search
- Notifications menu
- Account menu
- Typed mock data
- Unit/component tests
- Playwright E2E tests

The goal of this phase is NOT to add product features.

The goal is to safely modernize the frontend framework and tooling while preserving all existing behavior.

---

# CRITICAL RULE

DO NOT MODIFY FILES IMMEDIATELY.

First:

1. Inspect the repository.
2. Inspect installed versions.
3. Inspect Node.js version.
4. Inspect package.json.
5. Inspect ESLint configuration.
6. Inspect Tailwind configuration.
7. Inspect Jest configuration.
8. Inspect Playwright configuration.
9. Inspect Next.js configuration.
10. Produce a migration plan.

Then STOP.

Wait for the exact message:

APPROVED - PROCEED

Do not auto-proceed.

---

# MIGRATION GOAL

Evaluate and migrate the project from its current Next.js / React stack to the current stable supported versions appropriate for a new production-focused project.

Do not use:

- canary releases
- beta releases
- experimental releases

Use stable supported releases only.

---

# PRESERVE EXISTING BEHAVIOR

The migration must not break:

- `/login`
- `/register`
- `/onboarding`
- `/dashboard`
- `/clients`
- `/projects`
- `/tasks`
- `/team`
- `/activity`
- `/settings`

It must preserve:

- form validation
- frontend demo login flow
- frontend demo registration flow
- workspace switching
- organization-specific dashboard data
- search
- notifications
- account menu
- mobile navigation
- responsive layout

---

# TESTING

Existing tests must remain meaningful.

After implementation, verify:

- lint
- TypeScript typecheck
- unit/component tests
- Playwright E2E
- production build

Do not delete or weaken tests just to complete the migration.

Do not suppress errors or warnings.

Target:

- 0 lint errors
- 0 lint warnings
- strict TypeScript passing
- all unit tests passing
- E2E passing
- production build passing

---

# HYDRATION

Inspect the existing login hydration workaround.

Determine whether disabling the submit button before hydration is:

- a legitimate user-facing correctness fix
or
- only a Playwright-specific workaround

Do not preserve test hacks solely to make Playwright green.

Prefer a solution that is correct for real users.

---

# DEPENDENCY REVIEW

Audit all current dependencies.

For each dependency determine:

- why it exists
- whether it is still required
- whether it is compatible with the migrated framework

Do not add unnecessary dependencies.

Do not add:

- Redux
- Zustand
- UI frameworks
- backend libraries
- database libraries
- Docker
- Redis
- Stripe
- AI libraries

---

# SCOPE

This phase is migration-only.

DO NOT implement:

- Clients CRUD
- Projects CRUD
- Tasks CRUD
- Team management
- backend
- authentication backend
- PostgreSQL
- API routes
- payments
- AI functionality

Do not redesign the UI.

Do not significantly change the product.

---

# GIT

Do not commit.

Do not push.

The developer will review and create the commit manually.

---

# PLAN OUTPUT

Before changing anything, return:

## Current Versions

List:

- Node
- Next.js
- React
- TypeScript
- Tailwind
- ESLint
- Jest
- Playwright

## Migration Target

State the exact stable versions you recommend.

## Compatibility Assessment

Explain possible breaking changes.

## Files Expected to Change

List expected files.

## Dependencies Expected to Change

List upgrades/removals/additions.

## Migration Steps

Give an ordered migration plan.

## Testing Plan

Explain verification.

## Risks

Explain likely migration risks.

## Definition of Done

Define exact completion criteria.

Then STOP.

Wait for:

APPROVED - PROCEED