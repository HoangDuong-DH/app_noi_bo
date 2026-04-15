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

- `400 BAD_REQUEST`: missing required fields or invalid JSON body.

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

  "jobs": [
    {
      "job_id": "JOB-001",
      "status": "queued",
      "product_name": "Sample Product",
      "brand_name": "Sample Brand"
    }
  ],
  "availableIndustries": ["Beauty", "FMCG"],
  "availableGodWords": ["Premium", "Natural"]

  "jobs": ["NormalizedJob[]"],
  "availableIndustries": ["string"],
  "availableGodWords": ["string"]

}
```

---

## POST /api/jobs/save


> Phase 1 scope: **create-only**. This endpoint does not update existing jobs (no upsert in this phase).

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


Response body (`200`) supports 2 queue-safe variants:

1) Webhook returns full normalized job (when available):

```json
{
  "ok": true,
  "job": {
    "job_id": "JOB-002",
    "status": "queued",
    "product_name": "New Product",
    "brand_name": "New Brand"
  }
}
```

2) Webhook only acknowledges queue write (common in queue-driven mode):

Response body (`200`):


```json
{
  "ok": true,

  "accepted": true,
  "job_id": "JOB-002",
  "message": "queued"

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


Response body (`200`) supports 2 queue-safe variants (same as `/api/jobs/save`):

```json
{
  "ok": true,
  "job": {
    "job_id": "JOB-001",
    "status": "queued"
  }
}
```

Response body (`200`):


```json
{
  "ok": true,

  "accepted": true,
  "job_id": "JOB-001",
  "message": "retry queued"

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


Response body (`200`) supports 2 queue-safe variants (same as `/api/jobs/save`):

```json
{
  "ok": true,
  "job": {
    "job_id": "JOB-003",
    "status": "queued"
  }
}
```

Response body (`200`):


```json
{
  "ok": true,

  "accepted": true,
  "job_id": "JOB-003",
  "message": "duplicate queued"

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

  "job": {
    "job_id": "JOB-001",
    "status": "processing",
    "updated_at": "2026-04-14T03:40:00.000Z"
  }

  "job": "NormalizedJob"

}
```
