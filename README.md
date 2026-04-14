# app_noi_bo MVP scaffold

## Quick start

1. Copy env:
   - `cp .env.example .env`
2. Push schema:
   - `npm run prisma:push`
3. Seed first admin user:
   - `npm run prisma:seed`
4. Run app:
   - `npm run dev`

## Seed credentials

Default values come from `.env` (or `.env.example`):

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_NAME`
- `SEED_ADMIN_PASSWORD`

You should change them before running `npm run prisma:seed` in any shared environment.


## n8n timeout

- `N8N_TIMEOUT_MS` (default `15000`) controls per-request timeout when Next.js calls n8n.


## Production-like local verification

For MVP validation, do this sequence instead of only `npm run dev`:

1. `npm run build`
2. `npm start`
3. Login with seeded user
4. Verify: bootstrap, save, retry, duplicate, and status polling for selected job


## Git conflict note

- `.env.example` uses `merge=union` (see `.gitattributes`) so common env-variable additions from both branches are merged with fewer conflicts.
- For source code files (`src/**`), keep normal merge behavior to avoid silent logic breakage.
