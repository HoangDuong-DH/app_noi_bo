"use client";

import { useCallback, useEffect, useState } from "react";
import JobDetail from "@/components/job-detail";
import JobForm from "@/components/job-form";
import QueueTable from "@/components/queue-table";
import type { BootstrapResponse, NormalizedJob } from "@/types";

const ACTIVE_STATUSES = new Set(["queued", "pending", "processing", "running", "locked"]);

function isIncomingNewer(current: NormalizedJob | undefined, incoming: NormalizedJob): boolean {
  if (!current) return true;

  const currentVersion = current.version ?? -1;
  const incomingVersion = incoming.version ?? -1;
  if (incomingVersion !== currentVersion) {
    return incomingVersion > currentVersion;
  }

  const currentUpdated = Date.parse(current.updated_at || "");
  const incomingUpdated = Date.parse(incoming.updated_at || "");

  if (Number.isNaN(currentUpdated) || Number.isNaN(incomingUpdated)) {
    return true;
  }

  return incomingUpdated >= currentUpdated;
}

function mergeBootstrapWithLocal(prevJobs: NormalizedJob[], bootstrapJobs: NormalizedJob[]): NormalizedJob[] {
  const prevById = new Map(prevJobs.map((job) => [job.job_id, job]));

  return bootstrapJobs.map((bootstrapJob) => {
    const localJob = prevById.get(bootstrapJob.job_id);

    if (!isIncomingNewer(localJob, bootstrapJob)) {
      return localJob;
    }

    return bootstrapJob;
  });
}

export default function SaPage() {
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [selected, setSelected] = useState<NormalizedJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/bootstrap", { cache: "no-store" });

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message || "Không tải được queue");
      return;
    }

    const data: BootstrapResponse = await res.json();
    setError(null);

    setJobs((prevJobs) => {
      const merged = mergeBootstrapWithLocal(prevJobs, data.jobs);

      setSelected((prevSelected) => {
        if (!prevSelected) return null;
        return merged.find((x) => x.job_id === prevSelected.job_id) || null;
      });

      return merged;
    });
  }, []);

  const pollSelectedJob = useCallback(async () => {
    if (!selected?.job_id) return;

    const status = selected.status?.trim().toLowerCase() || "";
    if (!ACTIVE_STATUSES.has(status)) return;

    const res = await fetch(`/api/jobs/status/${encodeURIComponent(selected.job_id)}`, { cache: "no-store" });
    if (!res.ok) return;

    const data: { job?: NormalizedJob } = await res.json().catch(() => ({}));
    if (!data.job?.job_id) return;

    setJobs((prev) =>
      prev.map((job) => {
        if (job.job_id !== data.job?.job_id) return job;
        if (!isIncomingNewer(job, data.job)) return job;
        return { ...job, ...data.job };
      })
    );

    setSelected((prev) => {
      if (prev?.job_id !== data.job?.job_id) return prev;
      if (!isIncomingNewer(prev, data.job)) return prev;
      return { ...prev, ...data.job };
    });
  }, [selected]);

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), 15000);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!selected?.job_id) return;
    const timer = setInterval(() => void pollSelectedJob(), 5000);
    return () => clearInterval(timer);
  }, [pollSelectedJob, selected?.job_id]);

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <JobForm onSaved={() => void load()} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <QueueTable jobs={jobs} onSelect={setSelected} />
      </div>
      <JobDetail job={selected} onChanged={() => void load()} />
    </div>
  );
}
