# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Joblin is a job-search tracking app: a NestJS REST API, a SvelteKit SPA, a Go scraper, and a
dbmate-based migration runner, all sharing one PostgreSQL database. It's a monorepo with no
workspace tooling — each app under `apps/` manages its own dependencies (`package.json` per
TS app, `go.mod` for the scraper), and the root `Makefile` is the single entry point for common
dev tasks. See `ARCHITECTURE.md` for the fuller design writeup, but note it describes a
target/future layout (`apps/web`, `apps/migrations`, `apps/extension`) that doesn't match the
current tree — the real app directories are `apps/frontend` and `apps/db`, and there is no
extension app yet.

Apps:
- `apps/api` — NestJS 11 REST API (TypeScript)
- `apps/frontend` — SvelteKit 2 / Svelte 5 SPA (TypeScript), named `joblin-web`
- `apps/scraper` — Go background scraper, writes vacancies directly to Postgres
- `apps/db` — dbmate migrations, plain SQL, run via a small Node wrapper script

## Common commands

Run from the repo root unless noted.

```
make setup       # npm install in api, frontend, db
make network     # create the external `joblin_network` docker network (needed once)
make dev         # docker compose up — runs db, migrations, api, frontend
make build       # docker compose build
make clean       # docker compose down -v

make db-up       # apply pending migrations (apps/db, against localhost)
make db-down     # roll back last migration
make db-new name=<name>   # scaffold a new migration
make db-status   # show migration status

make api-generate   # regenerate pgtyped query types (apps/api)
make api-test       # run API test suite (apps/api)
```

Inside `apps/api`:
```
npm run start:dev        # nest start --watch
npm run test             # jest, unit specs (**/*.spec.ts)
npm run test -- <pattern>   # run a subset, e.g. npm run test -- vacancy.service
npm run test:watch
npm run test:cov
npm run test:e2e         # jest -c ./test/jest-e2e.json
npm run lint             # eslint --fix
npm run format           # prettier --write
npm run generate:types   # pgtyped -c pgtyped.config.cjs (regenerate *.queries.ts from *.sql)
npm run generate:types:watch
```

Inside `apps/frontend`:
```
npm run dev         # vite dev
npm run build
npm run check        # svelte-kit sync && svelte-check
npm run lint         # prettier --check . && eslint .
npm run format
```

Inside `apps/db` (needs `POSTGRES_HOST=localhost` when run outside compose):
```
npm run new <name>   # scaffold a migration under migrations/
npm run up
npm run down
npm run status
```

Inside `apps/scraper` (Go, module `github.com/bugsworld38/joblin/scraper`):
```
go run ./cmd
go build ./...
go test ./...
```
sqlc generates `apps/scraper/db/sqlc/*.go` from SQL in that package — regenerate with `sqlc generate` after editing queries (see `apps/scraper/sqlc.yaml`).

## Architecture

### Database

Single PostgreSQL 16 instance shared by `api` and `scraper`. Schema lives entirely in
`apps/db/migrations/*.sql` (dbmate, plain SQL, no ORM). Both TypeScript and Go sides generate
typed query code from hand-written SQL against this schema — there is no ORM and no shared
types package between services; the HTTP interface and the DB schema are the contracts.

Core tables: `users`, `refresh_tokens`, `vacancies`, `applications`. Vacancies are expired
(`status = 'expired'`), never hard-deleted, once they haven't been seen by the scraper within a
staleness window — this keeps `applications` referencing them intact.

### apps/api (NestJS)

Feature-module-per-domain layout under `src/`: `auth`, `user`, `refresh-token`, `vacancy`,
`application`, `scraper`, plus cross-cutting `common`, `config`, `database`, `health`. Each
domain module wraps generated **pgtyped** query functions in a repository, never importing the
generated `*.queries.ts` code directly elsewhere:

```
src/vacancy/
  queries/vacancies.sql          ← hand-written SQL, source of truth
  queries/vacancies.queries.ts   ← pgtyped-generated, do not hand-edit
  vacancy.repository.ts          ← wraps generated queries, injected with pg Pool
  vacancy.service.ts             ← imports repository only
  vacancy.controller.ts
  vacancy.module.ts
  dtos/, interfaces/
```
After editing a `.sql` file, run `npm run generate:types` (or `make api-generate`) to regenerate
the matching `.queries.ts`.

Path aliases (`@auth`, `@vacancy`, `@scraper`, etc., mapped 1:1 to `src/<module>`) are defined in
both `tsconfig.json` and the Jest `moduleNameMapper` in `package.json` — keep them in sync if a
module is added or renamed.

Auth is JWT access token (short-lived) + refresh token (hashed, stored in `refresh_tokens`,
rotated via `/auth/refresh`). Env vars are validated with Joi (`src/config/env.validation.ts`);
DTOs are validated with class-validator.

Note: `src/scraper` here is a distinct, on-demand URL-parsing module (strategies for
djinni/dou/linkedin, used e.g. to preview/import a single job posting by URL) — it is separate
from the standalone Go scraper service in `apps/scraper`, which is the autonomous background
crawler that bulk-writes to `vacancies` on a schedule. Don't conflate the two.

### apps/frontend (SvelteKit)

Client-only SPA (no SSR) using Svelte 5 runes. Code is organized as feature modules under
`src/lib/features/<feature>/` (currently `auth`, `vacancy`) plus shared building blocks under
`src/lib/shared/` (components, api client, utils, types):

```
src/lib/features/vacancy/
  api.ts          ← raw HTTP calls (axios)
  queries.ts       ← TanStack Query hooks (createInfiniteQuery etc.) wrapping api.ts
  types.ts
  components/
  index.ts         ← public exports for the feature
```

`src/lib/shared/api/client.ts` is a single axios instance (`apiClient`) with request/response
interceptors: it attaches the bearer token from `authContext`, and on a 401 (except from
`/auth/refresh` itself) it transparently calls `/auth/refresh`, queues concurrent requests behind
the in-flight refresh, and retries them with the new token. `authContext`
(`lib/features/auth/store.svelte.ts`) is a singleton class using `$state`/`$derived` runes,
persisting only the access token to `localStorage`; the refresh token lives in an httpOnly cookie
handled server-side (`withCredentials: true`).

Routing uses SvelteKit route groups: `(auth)` for login/register (see
`lib/shared/components/routes/public-route.svelte` / `private-route.svelte` for auth gating).

### apps/scraper (Go)

Autonomous background service (`cmd/main.go` → `internal/scraper.Scraper.Run`). For each
configured keyword × board combination it calls `board.Board.Scrape(ctx, keyword)`, upserts
results via sqlc-generated queries (`db/sqlc`), then runs `ExpireStaleVacancies`. Boards
(`internal/board/`) implement a common interface; add a new source by adding a new `Board`
implementation, not by branching inside `scraper.go`. Uses `pgx/v5` for DB access and `goquery`
for HTML scraping.

## Conventions

- No ORM anywhere — all DB access is hand-written SQL compiled to typed functions (pgtyped for
  TS, sqlc for Go). Edit the `.sql` files and regenerate; don't hand-edit generated query files.
- TypeScript projects use Prettier with `@trivago/prettier-plugin-sort-imports` — import order is
  enforced (framework imports, third-party, path-aliased internal, then relative) and checked by
  `lint`/pre-commit hooks (husky + lint-staged in both `api` and `frontend`).
- API tests live alongside the module in `__tests__/` (e.g. `src/vacancy/__tests__/`), matching
  `*.spec.ts`.
