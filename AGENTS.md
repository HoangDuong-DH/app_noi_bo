# AGENTS.md

## Repository identity

This is an existing repository. Do not scaffold from scratch.
Keep the current repository as the base.
Keep current route names and current environment variable names unless explicitly instructed otherwise.

## Current main route

- `/sa` is the main workspace route.
- Do not rename it to `/dashboard`.

## Architecture truth

- n8n is the workflow owner.
- Google Sheets is the operational database / queue / log store through n8n.
- Next.js must not call Google Sheets directly.
- Frontend must not call n8n directly.
- Next.js Route Handlers are the only app-facing server layer.
- `src/lib/n8n.ts` is the only allowed gateway from Next.js to n8n.
- App-facing `sa-*` webhooks only read/write queue/status/log data for the app.
- Workflow A remains the consumer of queued jobs and continues:
  A → B → J → C1/C2/C3 → D → N

## Queue truth

- Queue is shared across the team.
- Do not scope queue visibility by actor or userId.
- Actor identity is for audit, not for filtering visibility.

## Data ownership

- Prisma is only for authentication/user data.
- Do not add a Job model in Prisma.
- Do not add direct Google Sheets access to Next.js.
- Do not add Google Sheets SDKs to Next.js.

## Route philosophy

- Route handlers must stay thin.
- Allowed route logic:
  1. auth
  2. validation
  3. call n8n
  4. forward response
- Do not move workflow/business logic into route handlers.

## Allowed improvements

- strengthen domain types in `src/types.ts`
- add `scripts/smoke.mjs`
- add `docs/verification.md`
- improve README
- improve stale-state handling
- improve thin-route validation
- reinforce `src/lib/n8n.ts` as chokepoint

## Forbidden changes

- do not rebuild folder structure from scratch
- do not rename `/sa`
- do not rename current env variables
- do not replace n8n with Apps Script
- do not add phase-2 features
- do not over-engineer
- do not move workflow ownership away from n8n

## Working style

- Audit first, patch second.
- Explain before changing.
- Keep diffs small.
- Prefer additive improvements over broad rewrites.
- If runtime/build was not executed, say that explicitly.
