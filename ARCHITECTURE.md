# Joblin Architecture

## Overview

Joblin is a job search tracking application. It consists of a REST API, a SvelteKit SPA, a Go-based vacancy scraper, and a dedicated database migration runner — all organized as a monorepo.

---

## Monorepo Structure

```
joblin/
├── apps/
│   ├── api/              # NestJS REST API
│   ├── web/              # SvelteKit SPA
│   ├── extension/        # Browser extension (side panel)
│   ├── scraper/          # Go scraper service
│   └── migrations/       # dbmate migration runner
├── infra/
│   ├── charts/
│   │   └── joblin/       # Helm umbrella chart
│   │       ├── Chart.yaml
│   │       ├── values.yaml
│   │       ├── values.prod.yaml
│   │       └── templates/
│   │           ├── api/
│   │           ├── web/
│   │           ├── scraper/
│   │           ├── migrations/
│   │           └── postgres/
│   └── argocd/
│       └── application.yaml
├── compose.yml           # local development only
└── Makefile              # developer UX — run, build, install targets
```

Each app manages its own dependencies independently (`package.json` per TS app, `go.mod` for the scraper). No workspace tooling — the `Makefile` at the repo root is the single entry point for common dev tasks.

---

## Services

### api — NestJS REST API

| Concern | Choice |
|---|---|
| Framework | NestJS 11, TypeScript |
| Database driver | `pg` (node-postgres) |
| Database access | pgtyped (raw SQL → typed TS functions) |
| Auth | JWT (15min) + refresh token (7d, SHA-256 hashed) |
| Validation | class-validator + Joi (env) |
| Docs | Swagger/OpenAPI |
| Rate limiting | NestJS Throttler |

Owns all reads and writes for the user-facing domain (users, applications, vacancies). The scraper writes directly to the database — the API does not proxy scraper writes.

#### Query structure

Generated pgtyped code is never imported directly — each module exposes a repository that wraps the generated queries:

```
src/modules/vacancies/
  queries/
    vacancies.sql              ← SQL source
    vacancies.queries.ts       ← pgtyped generated (internal)
  vacancies.repository.ts      ← wraps generated queries, injected with pg Pool
  vacancies.service.ts         ← imports repository only
  vacancies.controller.ts
  vacancies.module.ts
```

### web — SvelteKit SPA

| Concern | Choice |
|---|---|
| Framework | SvelteKit 2, Svelte 5 (runes) |
| State | TanStack Query (server), `$state` rune (client) |
| HTTP | Axios with Bearer token + silent refresh interceptor |
| Forms | superforms + Zod |
| Styling | Tailwind CSS v4 |
| Auth token | localStorage, injected as `Authorization: Bearer` header |

Client-only SPA (`ssr: false`). Auth state is a singleton `authContext` using Svelte 5 runes, persisted to localStorage.

### extension — Browser side panel

| Concern | Choice |
|---|---|
| Extension framework | WXT |
| UI | Svelte 5 |
| Styling | Tailwind CSS v4 |
| HTTP | Axios |
| Auth | shared session via httpOnly refresh token cookie (`chrome.cookies` API) |
| Token storage | `chrome.storage.local` (access token only) |

Chrome side panel that lets users triage scraped vacancies without switching tabs. Shares session with the web app via the httpOnly refresh token cookie — no separate login form.

#### Auth flow

```
Extension starts
      │
      ├── chrome.cookies.get(refresh_token) → exists
      │         │
      │         └── POST /auth/refresh → store access token in chrome.storage.local
      │
      └── no cookie → open web app login page in new tab
                       background service worker polls for cookie
                       cookie appears → close tab → POST /auth/refresh → ready
```

Manifest permissions required:
```json
{
  "permissions": ["cookies"],
  "host_permissions": ["https://api.yourdomain.com/*"]
}
```

#### Structure

```
apps/extension/
  src/
    entrypoints/
      sidepanel/
        App.svelte        ← main UI
        index.html
      background.ts       ← service worker, handles auth cookie polling
    components/
      VacancyCard.svelte
      FilterBar.svelte
    lib/
      api.ts              ← axios client, same Bearer + refresh pattern
      auth.ts             ← wraps chrome.cookies + chrome.storage.local
```

#### UX flow

```
Open side panel
      │
      ▼
Filter bar (grade, technologies, company type, board)
      │
      ▼
GET /vacancies?filters...   (one vacancy at a time)
      │
      ▼
VacancyCard
      │
  ┌───┴───┐
Skip    Save
  │       │
  │       └── POST /applications
  └── next vacancy
```

---

### scraper — Go scraper service

| Concern | Choice |
|---|---|
| Language | Go |
| HTTP scraping | `net/http` + `goquery` |
| Browser scraping | `chromedp` |
| Database access | sqlc (raw SQL → typed Go) + pgx/v5 |
| Scheduling | internal cron scheduler |
| Search profiles | `profiles.yaml` config (v1) |

Autonomous background service. Runs on a schedule, writes scraped vacancies directly to the shared PostgreSQL database. No queue for v1 — scheduler triggers scrape jobs directly.

#### Board strategy

Each job board implements a common `Board` interface:

```
type Board interface {
    Scrape(ctx context.Context, profile Profile) ([]RawVacancy, error)
}
```

Transport is an implementation detail of each strategy:

| Board | Transport | Auth |
|---|---|---|
| Djinni | `net/http` + goquery | none |
| LinkedIn | chromedp | cookie session, lazy re-auth |
| Work.ua | `net/http` + goquery | none |

**chromedp management:** one shared Chrome allocator (one process), each LinkedIn scrape run borrows a tab context — not a new browser instance.

#### Scraper pipeline

```
profiles.yaml
     │
     ▼
scheduler → board.Scrape()       (HTTP or chromedp)
                │
                ▼
           enricher               (grade, technologies, company type)
                │
                ▼
           queries.Upsert()       (pgx + sqlc)
                │
                ▼
           vacancies table
```

#### Enricher

Extracts structured fields from raw scraped data:

- **Grade** — regex over title: `"Senior Go Engineer"` → `["senior"]`. Stored as `text[]` since postings can list multiple levels.
- **Technologies** — keyword matching against title + description.
- **Company type** — board-provided field where available (Djinni), otherwise inferred.

Grade normalization:

| Raw | Normalized |
|---|---|
| Junior, Jr, Entry | `junior` |
| Middle, Mid | `middle` |
| Senior, Sr | `senior` |
| Lead, Tech Lead | `lead` |
| Staff, Principal | `staff` |

### migrations — dbmate runner

Plain SQL migration files. No Node.js, no build step.

```
apps/migrations/
  db/
    migrations/
      20251215_create_users.sql
      20251217_create_refresh_tokens.sql
      20251219_create_vacancies.sql
      20251221_create_applications.sql
  Dockerfile
```

```dockerfile
FROM ghcr.io/amacneil/dbmate
COPY db/migrations ./db/migrations
CMD ["up"]
```

---

## Database

**PostgreSQL 16**, shared across `api` and `scraper`.

### Schema

```sql
users
  id uuid PK
  email text UNIQUE
  password_hash text
  created_at, updated_at timestamptz

refresh_tokens
  id uuid PK
  user_id uuid FK → users
  token_hash text
  is_revoked boolean
  expires_at timestamptz
  created_at, updated_at timestamptz

vacancies
  id uuid PK
  board text                        -- djinni | linkedin | workua
  url text UNIQUE
  title text
  company_name text
  company_type text                 -- product | outsource | startup | agency
  grade text[]                      -- GIN indexed
  technologies text[]               -- GIN indexed
  salary_min int
  salary_max int
  salary_currency text
  remote_type text                  -- remote | office | hybrid
  location text
  description text
  status text DEFAULT 'active'      -- active | expired
  last_seen_at timestamptz
  scraped_at timestamptz
  created_at timestamptz

applications
  id uuid PK
  user_id uuid FK → users
  vacancy_id uuid FK → vacancies
  status text                       -- sent_cv | followed_up | test_task | interview | reject | offer | archived
  notes text
  created_at, updated_at timestamptz
  UNIQUE (user_id, vacancy_id)
```

### Vacancy expiry

The scraper upserts vacancies on every run, updating `last_seen_at`. A background job marks vacancies as expired if they haven't been seen within `2 × scrape_interval`:

```sql
UPDATE vacancies
SET status = 'expired'
WHERE status = 'active'
AND last_seen_at < NOW() - INTERVAL '48 hours';
```

Expired vacancies are never hard-deleted — applications referencing them must remain visible with a "vacancy closed" indicator.

### Query tooling

| Service | Tool | Notes |
|---|---|---|
| api | pgtyped | SQL files per feature module, generates typed TS |
| scraper | sqlc | SQL files in `internal/storage/queries/`, generates typed Go |

Both point at `apps/migrations/db/migrations/` as the schema source. No ORM anywhere.

---

## Shared types

**No shared types package.** The stack is polyglot (TypeScript + Go) — types are duplicated at service boundaries. The HTTP interface is the contract between services.

---

## Infrastructure

### Runtime

- **Platform:** k3s on a single VPS
- **Ingress:** Traefik (k3s default)
- **Database:** in-cluster PostgreSQL StatefulSet with PVC (local-path provisioner)
- **Image registry:** ghcr.io

### Helm

Single umbrella chart at `infra/charts/joblin`. Migrations run as a Helm pre-install/pre-upgrade Job:

```yaml
annotations:
  "helm.sh/hook": pre-install,pre-upgrade
  "helm.sh/hook-delete-policy": before-hook-creation
```

API deployment depends on the migrations Job completing successfully.

### ArgoCD

Single Application pointing at `infra/charts/joblin`, automated sync with self-heal:

```yaml
syncPolicy:
  automated:
    prune: true
    selfHeal: true
```

### Secrets

**Sealed Secrets** (Bitnami) — secrets encrypted and committed to the repository. ArgoCD-native, no external secret store required.

### GitOps flow

```
git push
    │
    ▼
CI builds images → pushes to ghcr.io
    │
    ▼
ArgoCD detects change → syncs Helm chart to k3s
    │
    ▼
migrations Job runs → completes
    │
    ▼
api + scraper + web deployments start
```

---

## Local development

Docker Compose at the repo root for local development only:

```yaml
services:
  db:        postgres:16-alpine
  migrations: ./apps/migrations   (runs once, exits)
  api:        ./apps/api          (depends on migrations)
  scraper:    ./apps/scraper      (depends on migrations)
  web:        ./apps/web          (depends on api)
```

---

## Diagrams

### 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser                                │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     web  :5173                                  │
│                SvelteKit 2 + Svelte 5                           │
│         TanStack Query · Axios · superforms + Zod               │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP/REST + httpOnly cookies
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      api  :3001                                 │
│                      NestJS 11                                  │
│           pg (node-postgres) · pgtyped · JWT auth               │
└─────────────────────────┬───────────────────────────────────────┘
                          │ reads
                          ▼
                ┌─────────────────────┐   ┌────────────────────────┐
                │   PostgreSQL 16     │   │    scraper  (Go)       │
                │                     │◄──│  chromedp · goquery    │
                │  users              │   │  sqlc · pgx/v5         │
                │  vacancies          │   │                        │
                │  applications       │   │  Djinni  (HTTP)        │
                │  refresh_tokens     │   │  LinkedIn (chromedp)   │
                └─────────────────────┘   │  Work.ua (HTTP)        │
                            ▲             └────────────────────────┘
                            │ writes (upserts)
                            │
                ┌─────────────────────┐
                │  migrations         │
                │  dbmate             │
                │  (one-shot runner)  │
                └─────────────────────┘
```

---

### 2. Request Flow

```
User
 │
 │  interacts with
 ▼
web (SvelteKit)
 │
 │  POST /auth/login  ──────────────────────────────────────────┐
 │  GET  /vacancies                                             │
 │  POST /applications                                          │
 │  PATCH /applications/:id                                     │
 ▼                                                             ▼
Axios client                                             api (NestJS)
 ├── attaches Bearer token                                │
 └── on 401 → silent refresh → retry                     ├── JwtGuard
                                                          ├── Controller
                                                          ├── Service
                                                          ├── Repository
                                                          │    └── pgtyped query
                                                          ▼
                                                     PostgreSQL
                                                          │
                                                          └── JSON response
                                                               back to web
```

---

### 3. Scraper Pipeline

```
profiles.yaml
  │
  │  on interval (per profile)
  ▼
Scheduler
  │
  ├──────────────────────────────────────┐
  │                                      │
  ▼                                      ▼
Djinni / Work.ua                      LinkedIn
net/http + goquery                    chromedp
  │                                      │
  │  []RawVacancy                        │  []RawVacancy
  └──────────────┬───────────────────────┘
                 │
                 ▼
            Enricher
             ├── grade       regex over title → text[]
             ├── technologies keyword match → text[]
             └── company_type board field or inferred
                 │
                 │  []Vacancy
                 ▼
         Repository.Upsert()
             │
             │  ON CONFLICT (url, board)
             │  DO UPDATE SET last_seen_at = now()
             ▼
         PostgreSQL
         vacancies table


  separately, on schedule:
  ┌─────────────────────────────────────────┐
  │  UPDATE vacancies SET status = 'expired'│
  │  WHERE last_seen_at < NOW() - 48h       │
  └─────────────────────────────────────────┘
```

---

### 4. NestJS Module Structure

```
HTTP Request
     │
     ▼
Controller          (validates input, maps HTTP ↔ domain)
     │
     ▼
Service             (business logic, orchestrates repositories)
     │
     ▼
Repository          (data access abstraction)
     │
     └── pgtyped generated query    (SQL execution, never used directly)
              │
              ▼
         pg Pool → PostgreSQL


Example: POST /applications

ApplicationsController.create(dto)
     │
     ▼
ApplicationsService.create(userId, dto)
     ├── VacanciesRepository.upsert(dto.url)   ← creates vacancy if new
     └── ApplicationsRepository.create(...)    ← creates application
              │
              ▼
         PostgreSQL
```

---

### 5. Deployment (k3s + ArgoCD)

```
GitHub (monorepo)
     │
     ├── push to main
     │        │
     │        ▼
     │   CI (GitHub Actions)
     │        ├── build api image    → ghcr.io/vmamchur/joblin-api
     │        ├── build web image    → ghcr.io/vmamchur/joblin-web
     │        └── build scraper image→ ghcr.io/vmamchur/joblin-scraper
     │
     └── infra/charts/joblin/ (Helm chart changes)
              │
              ▼
         ArgoCD (watches repo)
              │  automated sync + self-heal
              ▼
    ┌─────────────────────────────────────────────────┐
    │                    k3s (VPS)                    │
    │                                                 │
    │   Traefik ingress                               │
    │    ├── api.domain  → api Service                │
    │    └── domain      → web Service                │
    │                                                 │
    │   Helm pre-upgrade Job                          │
    │    └── migrations (dbmate up) → exits 0        │
    │              ↓ completed                        │
    │   Deployments                                   │
    │    ├── api                                      │
    │    ├── web                                      │
    │    └── scraper                                  │
    │                                                 │
    │   StatefulSet                                   │
    │    └── PostgreSQL 16 + PVC (local-path)         │
    │                                                 │
    │   Sealed Secrets → k8s Secrets                  │
    └─────────────────────────────────────────────────┘
```

---

## Search profiles (scraper v1)

Defined in `apps/scraper/internal/config/profiles.yaml`:

```yaml
profiles:
  - id: djinni-frontend
    board: djinni
    query: "frontend"
    active: true
    interval_minutes: 360

  - id: linkedin-backend
    board: linkedin
    query: "backend developer"
    active: true
    interval_minutes: 720
```

Profiles move to a database table when a management UI is needed.
