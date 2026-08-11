# FRONTEND PHASE 1 — FOUNDATION

## Project Context

You are working inside the existing repository:

`multi-tenant-saas-platform`

This repository has already been cloned locally.

This project is a flagship portfolio project intended to demonstrate professional full-stack engineering ability to international SaaS companies, startups, engineering teams, and software agencies.

The long-term project will become a production-focused multi-tenant B2B SaaS operations platform.

The long-term stack will include frontend, backend, PostgreSQL, authentication, RBAC, testing, Docker, CI/CD, security, deployment, and production engineering practices.

However:

# THIS TASK IS FRONTEND ONLY.

Do not implement backend functionality during this phase.

---

# CRITICAL EXECUTION RULES

Before making changes, inspect the existing repository.

Do not create another repository.

Do not initialize Git.

Do not create a nested Git repository.

Do not delete or overwrite:

- `.git`
- `README.md`
- `LICENSE`
- `.gitignore`

Do not commit.

Do not push.

Do not create Pull Requests.

Do not create GitHub Issues.

Do not create additional Markdown documentation files.

Do not create architecture documents.

Do not create planning documents.

Do not create backend files.

Do not create API routes pretending to be a backend.

Do not implement a database.

Do not install PostgreSQL.

Do not install Prisma.

Do not install Drizzle.

Do not install NestJS.

Do not install Redis.

Do not install Docker.

Do not implement authentication logic.

Do not implement fake JWT logic.

Do not implement payment functionality.

Do not implement Stripe.

Do not implement AI functionality.

Only create files that are genuinely required to implement and test the frontend application.

---

# IMPORTANT

Do not try to complete the entire SaaS product in this task.

This is only Frontend Phase 1.

Prioritize:

1. code quality
2. clean architecture
3. maintainability
4. accessibility
5. responsive design
6. TypeScript correctness
7. realistic product UI
8. testing
9. build quality

Do not prioritize quantity of screens.

---

# FRONTEND TECHNOLOGY

Use:

- Next.js using App Router
- React
- TypeScript
- Tailwind CSS
- ESLint

Use current stable package versions compatible with each other.

TypeScript must remain strict.

Prefer Server Components by default.

Use Client Components only when browser-side interactivity requires them.

Do not add large libraries without a real reason.

For icons, a small professional icon library such as `lucide-react` is acceptable.

For forms, if required, use:

- React Hook Form
- Zod

Do not introduce Redux or another global state management library during this phase.

---

# PROJECT STRUCTURE

The long-term repository will contain both frontend and backend.

Therefore, do not place the Next.js application directly into the repository root as if this will permanently remain a frontend-only repository.

Prepare the repository for a future monorepo structure.

Use:

multi-tenant-saas-platform/
│
├── apps/
│   └── web/
│
├── README.md
├── LICENSE
└── .gitignore

Only `apps/web` should contain application code during this phase.

Do NOT create `apps/api`.

Do NOT create placeholder backend folders.

Do NOT create empty directories that are not currently needed.

If workspace configuration is technically required for the chosen package manager, create only the minimum required configuration.

Do not introduce Turborepo unless it is genuinely necessary.

Prefer simplicity.

---

# PRODUCT CONCEPT

The application is a multi-tenant B2B SaaS operations platform.

Organizations will eventually use the product to manage:

- team members
- clients
- projects
- tasks
- roles
- activity
- organization settings

Future backend architecture will enforce tenant isolation.

For now, this frontend phase should visually communicate this product model using typed mock data only.

Mock data must be clearly identifiable as frontend development data.

Do not make mock data look like real API integration.

---

# FRONTEND PHASE 1 SCOPE

Implement ONLY the following areas.

---

## 1. Authentication UI

Create:

`/login`

and

`/register`

These are UI-only screens.

No real authentication.

### Login

Include:

- product branding
- email field
- password field
- remember me option if appropriate
- forgot password link
- login button
- registration link

Use realistic validation.

Submission may simulate success locally.

Do not create API endpoints.

### Register

Include:

- full name
- work email
- password
- confirm password
- terms acknowledgement
- create account button
- login link

Use proper labels.

Use visible validation states.

Use accessible form controls.

---

## 2. Onboarding UI

Create:

`/onboarding`

The user should see a simple organization setup experience.

Fields:

- Organization name
- Organization slug
- Company size
- Industry

Include a clear call to action:

`Create workspace`

This remains UI-only.

No organization should actually be persisted to a backend.

---

# 3. Main Application Shell

Create the authenticated product shell.

The shell should contain:

### Sidebar

Items:

- Dashboard
- Clients
- Projects
- Tasks
- Team
- Activity

Bottom area:

- Settings

Sidebar must include an organization/workspace selector.

Use two typed mock organizations, for example:

- Northstar Studio
- Meridian Labs

The organization switcher should work visually on the frontend.

Switching organizations may change the mock context displayed in the UI.

Do not use backend persistence.

---

## Top Navigation

Include:

- current page title
- search entry point
- notifications button
- user account/avatar menu

Keep interaction realistic but limited to frontend behavior.

---

# 4. Dashboard

Create:

`/dashboard`

The dashboard is the primary deliverable of Phase 1.

It should feel like a real B2B SaaS product rather than a tutorial dashboard.

Include:

## KPI Cards

- Active Projects
- Open Tasks
- Completed This Week
- Overdue Tasks

Values must come from typed mock data.

---

## Recent Projects

Display several projects.

Each project may contain:

- name
- client
- status
- progress
- due date

---

## My Tasks

Display assigned tasks.

Each task may contain:

- title
- project
- priority
- status
- due date

---

## Recent Activity

Examples:

- project created
- task completed
- team member invited
- task status changed

---

## Team Overview

Show several organization members.

Include:

- name
- role
- avatar fallback
- availability/status if appropriate

---

# ROUTES THAT MAY EXIST AS PLACEHOLDERS

Sidebar navigation must not lead to broken pages.

Therefore lightweight placeholder pages may be created for:

`/clients`

`/projects`

`/tasks`

`/team`

`/activity`

`/settings`

These pages should use the same application layout.

However:

DO NOT fully implement these modules during Phase 1.

Each placeholder should simply contain:

- page heading
- short product-relevant description
- polished empty/upcoming state

Do not build full CRUD interfaces yet.

Those belong to later frontend phases.

---

# DESIGN DIRECTION

The product should look like serious modern B2B SaaS software.

Think:

- Linear
- Stripe Dashboard
- Vercel
- modern SaaS administration tools

Do NOT copy their interfaces directly.

Use them only as a quality reference.

The result must have its own coherent visual system.

---

# VISUAL RULES

Prefer:

- clean layout
- neutral palette
- restrained accent color
- clear typography hierarchy
- generous but disciplined spacing
- subtle borders
- subtle shadows where appropriate
- clear interactive states
- professional tables/cards
- readable information density

Avoid:

- excessive gradients
- glowing effects
- neon
- glassmorphism everywhere
- giant rounded cards
- excessive animations
- decorative animations without purpose
- generic AI startup aesthetics
- template-like visual clutter
- emojis as interface icons

Do not make everything rounded.

Do not make every container a card.

Create visual hierarchy using spacing, typography, borders, and layout.

---

# RESPONSIVENESS

The interface must work on:

- desktop
- laptop
- tablet
- mobile

Desktop should use a persistent sidebar.

Mobile should use an appropriate collapsible navigation pattern.

No horizontal overflow should occur under normal usage.

Tables/content must degrade gracefully on smaller screens.

---

# ACCESSIBILITY

Use semantic HTML.

Forms require visible labels.

Interactive controls must be keyboard accessible.

Use appropriate:

- focus states
- button semantics
- navigation semantics
- headings
- accessible names

Maintain reasonable color contrast.

Do not use placeholder text as a replacement for form labels.

---

# TYPESCRIPT

TypeScript must remain strict.

Avoid:

`any`

unless there is an extremely strong technical justification.

Create proper types for domain objects such as:

- Organization
- User
- Project
- Task
- Activity

Mock data must use those types.

Do not duplicate incompatible versions of the same domain types throughout the application.

---

# COMPONENT ARCHITECTURE

Avoid giant page components.

Extract reusable components only when there is genuine reuse or meaningful responsibility.

Examples that may justify components:

- AppSidebar
- WorkspaceSwitcher
- TopBar
- MetricCard
- ProjectList
- TaskList
- ActivityFeed
- UserAvatar
- EmptyState

Do not create unnecessary abstraction layers.

Avoid a component containing hundreds of lines if the responsibilities can clearly be separated.

At the same time, do not create dozens of tiny components with no architectural value.

---

# MOCK DATA

Use deterministic typed mock data.

Do NOT generate random data on every render.

Do not require internet access.

Use realistic business names and values.

Mock data should allow the application to demonstrate:

- two organizations
- several projects
- several tasks
- several team members
- several activities

Frontend data access should be structured so a real API client can replace the mock implementation later without rewriting the entire UI.

Do not overengineer this abstraction.

---

# STATES

The application must demonstrate professional product states.

Where appropriate, provide reusable patterns for:

- loading
- empty
- error
- populated state

Do not show fake loading timers merely to look sophisticated.

---

# TESTING — REQUIRED FROM DAY ONE

Set up frontend testing.

Use appropriate modern tooling compatible with the current Next.js/React stack.

At minimum add tests for:

1. login form validation
2. registration form validation
3. application sidebar navigation
4. dashboard rendering core metrics
5. organization switcher behavior

Use component/unit tests where appropriate.

Also configure E2E testing with Playwright.

Add at least one E2E smoke test covering a critical frontend path such as:

login UI
→ dashboard
→ navigation

Since authentication is not implemented, the navigation may use a clearly documented frontend-only demo mechanism.

Do not pretend that this proves backend authentication.

---

# QUALITY GATES

Before reporting completion, run all applicable checks.

The project must pass:

- dependency installation
- lint
- TypeScript type checking
- unit/component tests
- production build

Run Playwright tests if the environment allows browser execution.

If Playwright cannot run because of an environment limitation, explain the exact limitation rather than claiming it passed.

Do not suppress errors just to make checks green.

Fix root causes.

---

# PERFORMANCE RULES

Do not prematurely optimize.

However:

- avoid unnecessary Client Components
- avoid unnecessary large dependencies
- avoid unnecessary re-renders
- use Next.js primitives appropriately
- avoid large images/assets
- maintain reasonable bundle discipline

Do not claim performance improvements without measurements.

---

# SECURITY RULES FOR THIS FRONTEND PHASE

Remember that frontend authorization is NOT a security boundary.

Do not create comments or documentation implying that hidden buttons provide authorization.

Do not store real secrets.

Do not hard-code credentials.

Do not create fake security mechanisms.

Future backend phases will implement real authentication, authorization, and tenant isolation.

---

# CODE QUALITY

Code must look like code that could reasonably be reviewed in a professional international engineering team.

Use:

- meaningful names
- consistent imports
- small focused functions
- clear components
- strict typing
- understandable logic

Avoid:

- unnecessary cleverness
- copy/paste duplication
- dead code
- commented-out code
- unused dependencies
- unused components
- generated placeholder junk

---

# DO NOT OVERSTATE THE PROJECT

Do not use terms such as:

- enterprise-grade
- production-ready
- highly scalable
- secure
- battle-tested

unless there is actual evidence supporting the claim.

The correct description during development is:

`production-focused`

or:

`production-style`

---

# README

Do not create a new README.

Do not significantly rewrite the existing root README during this task.

Frontend documentation updates will be handled separately after the implementation has been reviewed.

---

# GIT

Do not commit changes.

Do not push changes.

At the end, suggest logical commits that the developer could create manually.

Examples:

`chore(web): initialize Next.js frontend`

`feat(web): add authentication and onboarding interfaces`

`feat(dashboard): implement application shell and dashboard`

`test(web): add frontend test foundation`

But DO NOT execute the commits.

---

# COMPLETION REPORT

When implementation is complete, do not simply say "done".

Return a concise engineering report containing:

## Created

List important files/features created.

## Architecture

Briefly explain the frontend structure.

## Dependencies

List every new dependency and why it was necessary.

## Routes

List implemented routes.

## Tests

List tests added and their results.

## Verification

Report the exact result of:

- lint
- typecheck
- tests
- build
- E2E if executed

## Known Limitations

Clearly state what is intentionally mocked or incomplete.

## Files Not Created

Explicitly confirm that no:

- backend
- database
- API server
- Docker setup
- Redis
- payment integration

was created.

## Suggested Commits

Suggest 3–5 logical Conventional Commits based on the actual changes.

---

# FINAL INSTRUCTION

First inspect the existing repository.

Then produce a short implementation plan.

After the plan, implement Frontend Phase 1.

Do not expand the scope beyond this document.

If something is ambiguous, prefer the simpler implementation that preserves maintainability and future backend integration.

The quality of the engineering matters more than the quantity of generated code.