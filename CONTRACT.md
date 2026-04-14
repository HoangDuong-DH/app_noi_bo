# API Contract (MVP Phase 1)

## Shared type

```ts
type NormalizedJob = {
  job_id: string;
  status?: string;
  priority?: number;
  run_flag?: string;
  product_name?: string;
  brand_name?: string;
  industry?: string;
  god_word?: string;
  brief_status?: string;
  brief_score?: number;
  style_anchor?: string;
  confirmedText?: string;
  status_final?: string;
  output_url?: string;
  error_message?: string;
  updated_at?: string;
  version?: number;
};
```

> Rule: n8n must return this normalized shape. Frontend does not infer fields from raw Sheets rows.

## Error envelope (all routes)

```json
{ "message": "string", "code": "string" }
```

Common errors:
- `401 UNAUTHORIZED`: missing/invalid session.
- `400 BAD_REQUEST`: missing required fields.
- `502 UPSTREAM_ERROR`: n8n/network failure.

---

## GET /api/bootstrap

- Request body: none.
- Required fields: none.
- Optional fields: none.

Response body (`200`):

```json
{
  "jobs": ["NormalizedJob[]"],
  "availableIndustries": ["string"],
  "availableGodWords": ["string"]
}
```

---

## POST /api/jobs/save

Request body:

```json
{
  "product_name": "string",
  "brand_name": "string",
  "industry": "string (optional)",
  "god_word": "string (optional)"
}
```

- Required fields: `product_name`, `brand_name`.
- Optional fields: `industry`, `god_word`.

Response body (`200`):

```json
{
  "ok": true,
  "job": "NormalizedJob"
}
```

---

## POST /api/jobs/retry

Request body:

```json
{
  "job_id": "string",
  "reason": "string (optional)"
}
```

- Required fields: `job_id`.
- Optional fields: `reason`.

Response body (`200`):

```json
{
  "ok": true,
  "job": "NormalizedJob"
}
```

---

## POST /api/jobs/duplicate

Request body:

```json
{
  "job_id": "string"
}
```

- Required fields: `job_id`.
- Optional fields: none.

Response body (`200`):

```json
{
  "ok": true,
  "job": "NormalizedJob"
}
```

---

## GET /api/jobs/status/[jobId]

- Request body: none.
- Path params: `jobId` (required).
- Optional fields: none.

Response body (`200`):

```json
{
  "job": "NormalizedJob"
}
```
