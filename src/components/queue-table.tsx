import type { NormalizedJob } from "@/types";

export default function QueueTable({
  jobs,
  onSelect
}: {
  jobs: NormalizedJob[];
  onSelect: (job: NormalizedJob) => void;
}) {
  return (
    <div className="rounded-xl border bg-white">
      {jobs.map((job) => (
        <button
          key={job.job_id}
          onClick={() => onSelect(job)}
          className="block w-full border-b px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
        >
          <div className="font-medium">{job.product_name || job.job_id}</div>
          <div className="text-sm text-slate-500">
            {job.brand_name || "-"} · {job.status || "-"} · {job.industry || "-"}
          </div>
        </button>
      ))}
    </div>
  );
}
