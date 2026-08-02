# Browser extension: keyword-driven vacancy walker (`apps/extension`)

## Context

Joblin currently requires manually browsing job boards and tracking applications after the fact via the API/frontend. The goal of this feature is to remove the browsing friction: the user types keywords once into a Chrome extension side panel, and the extension walks them through matching, not-yet-applied vacancies one at a time — navigating the *current* tab to each job posting — with simple Previous/Skip/Applied controls in the persistent sidebar. "Applied" records the application via the existing API once the user has actually submitted on the job site; "Skip" just advances.

Decisions already made with the user:
- Data source: reuse the existing joblin API/DB (not independent scraping).
- Stack: **WXT + React + TypeScript**, Chrome MV3 only, `chrome.sidePanel` for the sidebar (persists across tab navigation, unlike a popup).
- Applied = manual confirmation after real submission on the site, recorded via `POST /applications`.
- Queue = server-side filtered by keyword + `status = 'active'`, paginated.
- Auth: relax the refresh cookie's `sameSite` from `'strict'` to `'none'` (keep `secure: true`) and extend CORS to also allow the extension's origin, rather than building a separate token-in-body auth flow.
- Skip / "not interested" distinction: **out of scope for v1** — Skip is a pure client-side cursor advance, no new table, no dismissal endpoint.

`ARCHITECTURE.md` sketches a *different*, cookie-session-sharing design for `apps/extension` — per `CLAUDE.md` that doc is acknowledged stale/aspirational. This plan supersedes it; update `ARCHITECTURE.md`'s extension section once this ships (not part of this task).

## 1. Backend changes (`apps/api`)

**1.1 Expose `status` / `lastSeenAt` on vacancies** (currently in the DB but unused in TS):
- `apps/api/src/vacancy/interfaces/`: add a `VacancyStatus` enum (`active`/`expired`, mirrors `application-status.enum.ts`) and add `status`, `lastSeenAt` to the `Vacancy` interface.
- `apps/api/src/vacancy/queries/vacancies.sql`: add `status AS "status"`, `last_seen_at AS "lastSeenAt"` to `FindVacancies`' select list.
- `apps/api/src/vacancy/dtos/vacancy.response.dto.ts`: add matching `@Expose()` fields.
- Regenerate with `make api-generate`.

**1.2 New `GET /vacancies/queue` endpoint** — returns active, keyword-matching vacancies the current user hasn't applied to yet:
- New DTO `apps/api/src/vacancy/dtos/vacancy-queue.request.dto.ts`: `VacancyQueueRequestDto extends PaginationRequestDto` with a **required** `keyword: string` (unlike the optional `keyword` on the existing list endpoint).
- New pgtyped queries in `queries/vacancies.sql` — `FindVacancyQueue` / `CountVacancyQueue`, both `WHERE status = 'active' AND (title ILIKE ... OR company_name ILIKE ...) AND NOT EXISTS (SELECT 1 FROM applications a WHERE a.vacancy_id = v.id AND a.user_id = :userId)`, ordered `created_at DESC`, `LIMIT/OFFSET`.
- `vacancy.repository.ts`: add `findQueue(keyword, userId, { limit, offset })` mirroring `findMany`'s count+run pattern.
- `vacancy.service.ts`: add `findQueue(dto, userId)` computing offset via the existing `calculateOffset` helper.
- `vacancy.controller.ts`: add `GET /vacancies/queue`, **protected** with `@UseGuards(JwtAuthGuard)` + `@ApiBearerAuth('jwt')` (unlike the public `GET /vacancies`), using `@CurrentUser() currentUser: User` (from `@auth/decorators/current-user.decorator`) to get the user id.
- Regenerate with `make api-generate`.
- Extend `apps/api/src/vacancy/__tests__/vacancy.service.spec.ts` and `vacancy.controller.spec.ts` with cases for `findQueue` (mirroring existing `findMany` specs), asserting the user-id exclusion is wired through and the route requires auth.

**1.3 CORS — allow two origins**
- `apps/api/src/main.ts:38-40`: change `origin: 'http://localhost:5173'` to an array sourced from config, e.g. `origin: [config.webOrigin, config.extensionOrigin].filter(Boolean)`, keeping `credentials: true`.
- `apps/api/src/config/app.config.ts` + `env.validation.ts`: add `webOrigin`/`WEB_ORIGIN` and `extensionOrigin`/`EXTENSION_ORIGIN` (Joi-validated, matching the existing explicit-env-var convention).
- `apps/api/.env.example`: add both, e.g. `WEB_ORIGIN=http://localhost:5173`, `EXTENSION_ORIGIN=chrome-extension://<dev-id>`.
- Note: an unpacked extension's `chrome-extension://` origin is only stable across reloads if a fixed `key` is pinned in `wxt.config.ts` — needed for `EXTENSION_ORIGIN` to keep working in local dev (see §3).

**1.4 Relax refresh cookie `sameSite`**
- `apps/api/src/auth/auth.controller.ts:146-150` — the single `response.cookie('refreshToken', ...)` call (shared by login/register/refresh): change `sameSite: 'strict'` → `sameSite: 'none'`, keep `secure: true` (required by spec when `SameSite=None`). Chrome treats `localhost` as a secure context so this still works in dev; production must be served over HTTPS for the cookie to be set at all.
- Check `apps/api/src/auth/__tests__/auth.controller.spec.ts` for any assertion on `sameSite` and update it.

## 2. New `apps/extension` app (WXT + React + TypeScript)

**2.1 Scaffolding**
- `npx wxt@latest init` in `apps/extension`, `react-ts` template. Own `package.json` (name `joblin-extension`, matching `joblin-web`'s convention).
- `Makefile`: add `extension-dev` / `extension-build` targets (`cd apps/extension && npm run dev|build`), and add `cd apps/extension && npm i` to `setup`. **Do not** add it to `compose.yml`/`make dev` — like `apps/scraper`, it isn't a long-running server process; it's built and loaded into the developer's own Chrome, not containerized.

**2.2 Layout**
```
apps/extension/src/
  entrypoints/
    background.ts            # chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }) on install
    sidepanel/{index.html, main.tsx, App.tsx}   # App: LoginView vs QueueView based on auth state
  features/
    auth/{api.ts, storage.ts, useAuth.ts, LoginView.tsx}
    queue/{api.ts, useQueue.ts, QueueView.tsx, VacancyPanel.tsx, EmptyState.tsx}
    navigation/tabs.ts        # chrome.tabs.query/update wrapper
  shared/api/client.ts        # axios instance
  shared/types.ts
```

**2.3 Auth module**
- Token storage via WXT's `storage.defineItem('local:accessToken')` (typed, supports `.watch()`), not raw `chrome.storage` calls.
- `shared/api/client.ts`: axios instance, `baseURL` from a Vite env var, `withCredentials: true`. Request interceptor attaches `Authorization: Bearer <token>`; response interceptor mirrors `apps/frontend/src/lib/shared/api/client.ts`'s 401→refresh→retry-with-queue pattern, swapping `authContext` for the storage wrapper.
- `LoginView.tsx`: plain email/password form calling `POST /auth/login`, stores the returned access token, no cross-session cookie-sharing with the SPA (this extension has its own login).

**2.4 Queue module — core state (`useQueue.ts`)**
- State: `keyword`, `items: Vacancy[]` (flattened buffer, never evicted), `cursor: number`, `page`, `isExhausted`.
- `next()` (used by Skip and Applied): `cursor++`; if past the buffer end, fetch the next page transparently; `isExhausted = true` only once a fetched page is genuinely empty.
- `previous()`: `cursor = max(0, cursor - 1)` — no server call, since visited items stay in the buffer; this *is* the history stack, no separate structure needed. Previous disabled at `cursor === 0`.
- `skip()`: `next()`, no API call.
- `applied()`: `POST /applications` with the current item's `positionTitle`/`companyName`/`url` (ignore 409 — already-tracked is a safe no-op), then `next()`.
- A `useEffect` on cursor/items change triggers `navigateActiveTab(currentItem.url)`.
- `navigation/tabs.ts`: `chrome.tabs.query({active:true, currentWindow:true})` → `chrome.tabs.update(id, {url})`, callable directly from the side panel context.

## 3. Manifest (`wxt.config.ts`)
```
permissions: ['sidePanel', 'tabs', 'storage']
host_permissions: ['http://localhost:3001/*']   // + prod API origin later
side_panel: { default_path: 'sidepanel/index.html' }
// key: '<pinned public key>'   — keeps chrome-extension:// origin stable across reloads, required for EXTENSION_ORIGIN in §1.3
```
`tabs` (not just `activeTab`) is needed because Skip/Applied trigger navigation from a button click inside the side panel, not a fresh page-level user gesture on the target tab.

## 4. Verification

**Backend**
1. `make api-generate` — SQL compiles.
2. `make api-test` (or `npm run test -- vacancy` / `-- auth` in `apps/api`) — new queue specs pass, updated cookie-option assertions pass.
3. `make network && make dev`, then manually: log in, seed an application for one vacancy via `POST /applications`, call `GET /vacancies/queue?keyword=...` and confirm that vacancy is excluded and only `status: 'active'` rows appear.
4. From `chrome-extension://<pinned-dev-id>` devtools console, `fetch('http://localhost:3001/vacancies/queue?keyword=x', {credentials:'include'})` — confirm no CORS error and `Set-Cookie` on `/auth/refresh` shows `SameSite=None; Secure`.

**Extension**
1. `npm run build` in `apps/extension` → load `.output/chrome-mv3/` as unpacked in `chrome://extensions`.
2. Open side panel, confirm it survives manual navigation to other sites (the "unlike a popup" property).
3. Log in, enter a keyword matching seeded vacancies, confirm the active tab navigates to the first result and the panel shows title/company + controls.
4. Skip repeatedly — confirm tab advances, no `POST /applications` fires.
5. Applied — confirm `POST /applications` fires, row appears in `applications`, cursor advances.
6. Previous — confirm tab navigates back with no network call, disabled on the first item.
7. Exhaust the seeded set — confirm transparent next-page fetches, empty state only on a genuinely empty page.
8. Terminate the extension's service worker mid-session (`chrome://extensions` → service worker → terminate) and confirm the side panel keeps working — validates no critical state lives only in the background worker.

## Critical files
- `apps/api/src/vacancy/queries/vacancies.sql`, `vacancy.controller.ts`, `vacancy.repository.ts`, `vacancy.service.ts`
- `apps/api/src/auth/auth.controller.ts` (cookie), `apps/api/src/main.ts` (CORS)
- `apps/extension/wxt.config.ts`
- `apps/extension/src/features/queue/useQueue.ts`
- `apps/extension/src/shared/api/client.ts`
