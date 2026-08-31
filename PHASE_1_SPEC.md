# mtandaolabsEDU — PHASE 1: FOUNDATION

You are building **mtandaolabsEDU**, a scalable multi-tenant SaaS school management platform for Kenyan private schools.

This is **PHASE 1 ONLY**.

Your job in this phase is to build the production-quality technical foundation. **Do NOT build students, parents, teachers, fees, CBC, attendance, payments, subscriptions, reports, or other school-management features yet.**

## 1. First inspect the project

Before writing code:

* Inspect the existing repository.
* Identify the current framework, packages and configuration.
* Reuse good existing work where possible.
* Do not unnecessarily rewrite working code.
* If the repository is empty, initialize the project from scratch.

## 2. Technology direction

Use a modern, scalable TypeScript architecture.

Preferred foundation:

* Next.js + React + TypeScript for the web application
* PostgreSQL for persistent relational data
* Prisma ORM
* Redis for caching, rate limiting and future background jobs
* Zod for validation
* GitHub for source control
* GitHub Actions for CI/CD
* Playwright for end-to-end testing
* Vitest/Jest for unit testing
* ESLint + Prettier
* pnpm

Keep the architecture modular so individual services can later be separated when mtandaolabsEDU grows.

Do not introduce unnecessary technologies.

## 3. Project architecture

Create a clean structure suitable for a large SaaS application.

Separate:

* Web/application layer
* API/business logic
* Database layer
* Shared types
* Validation
* Configuration
* Utilities
* Testing
* Infrastructure
* Documentation

Design the code so future modules can be added cleanly:

* Authentication
* Schools
* Students
* Parents
* Teachers
* Academics
* CBC
* Attendance
* Fees
* Payments
* Notifications
* Subscriptions
* Documents
* Super Admin

Do not implement those modules yet.

## 4. Database foundation

Set up PostgreSQL with Prisma.

Create the database connection and migration system.

For this phase only create the minimum infrastructure required to prove the database works.

Do NOT create the complete school-management schema yet.

Include:

* Development database configuration
* Staging database configuration
* Production database configuration
* Prisma migrations
* Seed mechanism
* Safe database connection handling
* Connection pooling considerations

Never hard-code credentials.

## 5. Environment configuration

Create a secure environment configuration system.

Support separate environments:

```text
development
staging
production
```

Create an example environment file containing variable names only.

Never commit:

* Passwords
* API keys
* Database credentials
* JWT secrets
* OAuth secrets
* Email credentials
* Payment credentials
* WhatsApp credentials

Validate required environment variables at application startup.

Fail safely with useful errors when required configuration is missing.

## 6. Redis foundation

Connect Redis and create a clean abstraction around it.

Redis will later be used for:

* Rate limiting
* Caching
* Sessions where appropriate
* Background jobs
* Temporary data

For this phase, only establish the infrastructure and verify connectivity.

Do not build the full job system yet.

## 7. API foundation

Create a clean API architecture.

Include:

* Versioned API structure
* Request validation
* Standard response format
* Error handling
* HTTP status handling
* Request IDs
* Structured logging
* Basic API documentation

Create a health endpoint such as:

```text
/api/health
```

It should verify that the application is running.

Create separate checks where appropriate for:

```text
application
database
redis
```

Do not create school-management endpoints yet.

## 8. Error handling

Create centralized error handling.

Errors must:

* Be predictable
* Have consistent response formats
* Avoid leaking secrets
* Avoid exposing stack traces in production
* Be logged internally
* Return appropriate HTTP status codes

Create a safe production error page.

## 9. Logging

Implement structured application logging.

Logs should make it possible to identify:

* Timestamp
* Environment
* Request ID
* Event
* Severity
* Error information
* Relevant service

Never log:

* Passwords
* OTPs
* API secrets
* Access tokens
* Payment secrets
* Sensitive student information

## 10. Security foundation

Implement baseline security from the beginning.

Include:

* Secure HTTP headers
* CSRF protection where applicable
* Input validation
* Output handling
* Secure cookies where used
* Secure session architecture
* Protection against common injection attacks
* Protection against unauthorized API access
* Environment secret protection

Do not invent an insecure authentication system.

Authentication itself will be built in Phase 2.

## 11. Rate limiting foundation

Create a reusable Redis-based rate-limiting abstraction.

It should later support limits based on:

* IP
* User
* Tenant/school
* API endpoint

For now, demonstrate it on a test/example endpoint.

Do not implement the complete production rate-limit policy yet.

## 12. Frontend foundation

Create the initial mtandaolabsEDU design foundation.

Design direction:

* Flatpanel-inspired
* Clean
* Modern
* Professional
* No glassmorphism
* No excessive gradients
* No translucent cards
* Subtle shadows only
* Clean borders
* Moderate border radius
* Excellent spacing
* Responsive
* Mobile-first

Initial brand direction:

```text
Primary blue: #2563EB
Deep navy/slate: #0F172A
Background: #F8FAFC
Surface: #FFFFFF
Primary text: #0F172A
Secondary text: #64748B
```

These should be implemented as design tokens/CSS variables so they can later be extended into the school-specific branding system.

Do not build the complete dashboard yet.

Create only:

* Application shell foundation
* Typography
* Spacing
* Buttons
* Inputs
* Basic panels/cards
* Alerts
* Loading states
* Empty states
* Error states

## 13. Responsive foundation

The application must work on:

* Mobile
* Tablet
* Desktop

Do not create a desktop-only layout.

## 14. Testing

Set up:

### Unit tests

For:

* Validation
* Utilities
* Configuration
* Core abstractions

### Integration tests

For:

* Database connection
* Redis connection
* API foundation
* Health checks

### E2E tests

Create a basic Playwright test proving:

```text
Application loads
→ health endpoint works
→ basic UI renders
```

Do not test school features because they don't exist yet.

## 15. GitHub

Initialize/configure the Git repository properly.

Create:

* README.md
* .gitignore
* .env.example
* CONTRIBUTING.md
* basic architecture documentation

Use sensible branch structure, for example:

```text
main
develop
feature/*
fix/*
```

Protect production code through pull requests and CI checks.

Do not commit secrets.

## 16. GitHub Actions CI

Create GitHub Actions workflows.

Every pull request should run:

```text
Install dependencies
↓
Lint
↓
Type check
↓
Unit tests
↓
Integration tests
↓
Build
```

The CI pipeline must fail if any required step fails.

Use dependency caching where appropriate.

## 17. Staging CI/CD foundation

Prepare the repository for:

```text
Development
↓
GitHub
↓
CI
↓
Staging
↓
Smoke tests
↓
Production
```

For this phase, create the deployment structure and configuration needed for staging.

Do not perform a dangerous production deployment automatically.

Production deployment should later support controlled approval.

## 18. Versioning

Establish a release/versioning convention:

```text
v0.1.0
v0.2.0
v1.0.0
```

Every production release must eventually be traceable to:

* Git commit
* GitHub workflow
* Release version

## 19. Documentation

Create documentation explaining:

* Project architecture
* Local development
* Environment variables
* Database setup
* Prisma migrations
* Redis setup
* Testing
* Git workflow
* CI/CD
* Deployment structure
* Coding conventions

Keep documentation concise but useful.

## 20. Docker

Do not introduce Docker unless it is genuinely required by the architecture.

The application should be able to run directly in the intended development/deployment environment.

## 21. Performance

Establish the foundation for future scale.

Follow:

* Efficient database connection handling
* Async operations
* Proper error handling
* No unnecessary database queries
* No blocking operations in request handlers
* Pagination-ready API design
* Cache-ready architecture
* Background-job-ready architecture

Do not prematurely optimize.

## 22. Multi-tenancy preparation

The application will eventually be multi-tenant.

Do not build the complete tenant system in Phase 1, but make sure the architecture can support:

```text
School A
School B
School C
...
```

without mixing their data.

Do not create school data yet.

## 23. File storage preparation

The live file storage will initially live on our own VPS.

Later it will store:

* Student profile images
* PDFs
* Reports
* Receipts
* Invoices
* Documents
* School logos

For Phase 1, create only the storage abstraction/interface.

Do not build student document functionality yet.

The abstraction must allow future migration from VPS storage to another storage server without rewriting the application.

## 24. Backup preparation

The primary database/files will live on our VPS.

Backups will eventually use Backblaze B2.

For Phase 1:

* Document the backup architecture.
* Create configuration placeholders.
* Do not implement the complete backup system yet.

## 25. Important architecture rule

Do NOT build everything at once.

This phase is successful only when the foundation is clean and stable.

Do not add:

* Student management
* Parent management
* Teacher management
* School registration
* CBC
* Marks
* Attendance
* Fees
* M-Pesa
* PayHero
* Subscriptions
* WhatsApp
* SMS
* Email OTP
* Report cards
* Invoices
* Receipts
* School branding configuration
* Custom domains
* Super Admin business features

Those belong to later phases.

## 26. Definition of Done

Phase 1 is complete only when:

1. The application runs locally.
2. PostgreSQL connects successfully.
3. Prisma migrations work.
4. Redis connects successfully.
5. Environment validation works.
6. Health checks work.
7. Structured logging works.
8. Centralized error handling works.
9. Basic security headers/configuration are present.
10. Rate-limit abstraction works.
11. Frontend design foundation exists.
12. Responsive foundation works.
13. Unit tests run successfully.
14. Integration tests run successfully.
15. Playwright E2E test passes.
16. Production build succeeds.
17. GitHub repository is clean.
18. Secrets are excluded from Git.
19. GitHub Actions CI passes.
20. Staging deployment structure is documented/prepared.
21. Architecture documentation exists.
22. No Phase 2+ business features have been implemented.

## 27. Final report

When finished, report:

* What you built
* Final project structure
* Technologies actually used
* Database setup
* Redis setup
* Environment variables
* Tests created
* GitHub Actions workflows
* CI status
* Staging status
* Known issues
* Decisions made
* Anything that must be completed before Phase 2

Do not silently skip requirements.

If a requirement conflicts with the existing repository, explain the conflict and choose the safest scalable implementation.

**Start with inspection. Then implement Phase 1 incrementally.**
