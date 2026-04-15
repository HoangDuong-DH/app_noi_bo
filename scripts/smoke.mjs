#!/usr/bin/env node

const BASE_URL = process.env.APP_BASE_URL || "http://127.0.0.1:3000";

const checks = [
  { name: "GET /api/bootstrap", method: "GET", path: "/api/bootstrap" },
  { name: "POST /api/jobs/save", method: "POST", path: "/api/jobs/save", body: { product_name: "x", brand_name: "y" } },
  { name: "POST /api/jobs/retry", method: "POST", path: "/api/jobs/retry", body: { job_id: "test-id" } },
  { name: "POST /api/jobs/duplicate", method: "POST", path: "/api/jobs/duplicate", body: { job_id: "test-id" } },
  { name: "GET /api/jobs/status/test-id", method: "GET", path: "/api/jobs/status/test-id" }
];

async function run() {
  console.log(`Smoke check (unauth) against ${BASE_URL}`);

  let failed = 0;
  for (const check of checks) {
    const res = await fetch(`${BASE_URL}${check.path}`, {
      method: check.method,
      headers: check.body ? { "Content-Type": "application/json" } : undefined,
      body: check.body ? JSON.stringify(check.body) : undefined
    });

    const ok = res.status === 401;
    if (!ok) failed += 1;

    console.log(`${ok ? "✅" : "❌"} ${check.name} -> ${res.status}`);
  }

  if (failed > 0) {
    console.error(`\n${failed} unauth route check(s) failed.`);
    process.exit(1);
  }

  console.log("\nAll unauth route checks passed.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
