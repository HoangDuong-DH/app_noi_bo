# Verification Guide (MVP)

## A) Boundary grep checks

Run from repo root:

```bash
# 1) Next.js must not call Google Sheets SDKs directly
rg -n "googleapis|google-spreadsheet|@google-cloud" src

# 2) n8n base URL/token should only be consumed in src/lib/n8n.ts
rg -n "N8N_BASE_URL|N8N_INTERNAL_TOKEN|N8N_TIMEOUT_MS" src

# 3) Prisma should stay auth/user focused (no Job model)
rg -n "model Job" prisma/schema.prisma
```

Expected:
- command (1): no hits
- command (2): env reads should be in `src/lib/n8n.ts`
- command (3): no hits

## B) Local startup checklist

1. Copy env
   - `cp .env.example .env`
2. Install deps
   - `npm install`
3. Push prisma schema
   - `npm run prisma:push`
4. Seed admin user
   - `npm run prisma:seed`
5. Build app
   - `npm run build`
6. Start app
   - `npm start`

## C) Route verification checklist

After login:
- `/api/bootstrap` returns queue payload
- Save job works (`POST /api/jobs/save`)
- Retry works for failed jobs (`POST /api/jobs/retry`)
- Duplicate works (`POST /api/jobs/duplicate`)
- Selected-job status polling calls `/api/jobs/status/[jobId]`

Before login:
- unauthenticated calls to 5 core routes return `401`
- optional quick check:
  - `APP_BASE_URL=http://127.0.0.1:3000 node scripts/smoke.mjs`

## D) n8n app-facing webhook verification checklist

Ensure these gateway workflows exist and respond as expected:

- `sa-bootstrap`
  - input: requester identity
  - action: read queue/status data from Sheets
  - output: `{ jobs, availableIndustries, availableGodWords }`

- `sa-job-save`
  - input: job draft fields
  - action: write queue row in Sheets
  - output: queue-safe response (`job` or `accepted + job_id`)

- `sa-job-retry`
  - input: `job_id`, optional reason
  - action: update retry metadata/queue row
  - output: queue-safe response (`job` or `accepted + job_id`)

- `sa-job-duplicate`
  - input: `job_id`
  - action: copy row and enqueue duplicate
  - output: queue-safe response (`job` or `accepted + job_id`)

- `sa-job-status`
  - input: `job_id`
  - action: read latest row state from Sheets
  - output: `{ job }`
