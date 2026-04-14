"use client";

import { useState } from "react";
import type { NormalizedJob } from "@/types";

export default function JobDetail({
  job,
  onChanged
}: {
  job: NormalizedJob | null;
  onChanged: () => void;
}) {
  const [loadingAction, setLoadingAction] = useState<"retry" | "duplicate" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function callAction(action: "retry" | "duplicate") {
    if (!job?.job_id) return;
    setError(null);
    setLoadingAction(action);

    const res = await fetch(`/api/jobs/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: job.job_id })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message || `Không ${action} được job`);
      setLoadingAction(null);
      return;
    }

    setLoadingAction(null);
    onChanged();
  }

  if (!job) return <div className="rounded-xl border bg-white p-4">Chưa chọn job</div>;

  return (
    <div className="space-y-2 rounded-xl border bg-white p-4">
      <div className="text-lg font-semibold">{job.product_name || "(No name)"}</div>
      <div className="text-sm text-slate-500">{job.job_id}</div>
      <div>Status: {job.status || "-"}</div>
      <div>Run flag: {job.run_flag || "-"}</div>
      <div>Brief status: {job.brief_status || "-"}</div>
      <div>Brief score: {job.brief_score ?? "-"}</div>
      <div>Style anchor: {job.style_anchor || "-"}</div>
      <div>Output URL: {job.output_url || "-"}</div>
      <div>Error: {job.error_message || "-"}</div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => void callAction("retry")}
          disabled={loadingAction !== null}
          className="rounded bg-amber-600 px-3 py-2 text-white disabled:opacity-40"
        >
          {loadingAction === "retry" ? "Đang retry..." : "Retry job"}
        </button>
        <button
          onClick={() => void callAction("duplicate")}
          disabled={loadingAction !== null}
          className="rounded bg-indigo-600 px-3 py-2 text-white disabled:opacity-40"
        >
          {loadingAction === "duplicate" ? "Đang duplicate..." : "Duplicate"}
        </button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
