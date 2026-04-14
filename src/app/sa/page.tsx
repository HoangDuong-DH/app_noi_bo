"use client";

import { useCallback, useEffect, useState } from "react";
import JobDetail from "@/components/job-detail";
import JobForm from "@/components/job-form";
import QueueTable from "@/components/queue-table";
import type { BootstrapResponse, NormalizedJob } from "@/types";

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
    setJobs(data.jobs);
    setSelected((prev) => {
      if (!prev) return null;
      return data.jobs.find((x) => x.job_id === prev.job_id) || null;
    });
  }, []);

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), 15000);
    return () => clearInterval(timer);
  }, [load]);

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
