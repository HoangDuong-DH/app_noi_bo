export const JOB_ACTIVE_STATUSES = ["queued", "pending", "processing", "running", "locked"] as const;
export type JobActiveStatus = (typeof JOB_ACTIVE_STATUSES)[number];

export const JOB_RETRYABLE_STATUSES = ["failed", "error", "timeout", "cancelled"] as const;
export type JobRetryableStatus = (typeof JOB_RETRYABLE_STATUSES)[number];

export const JOB_TERMINAL_STATUSES = ["done", "completed", "success", "failed", "error", "cancelled"] as const;
export type JobTerminalStatus = (typeof JOB_TERMINAL_STATUSES)[number];

export type JobStatus = JobActiveStatus | JobRetryableStatus | JobTerminalStatus | (string & {});

export type NormalizedJob = {
  job_id: string;
  status?: JobStatus;
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
  status_final?: JobStatus;
  output_url?: string;
  error_message?: string;
  updated_at?: string;
  version?: number;
};

export type BootstrapResponse = {
  jobs: NormalizedJob[];
  availableIndustries: string[];
  availableGodWords: string[];
};

export type JobActionResponse =
  | {
      ok: boolean;
      job: NormalizedJob;
    }
  | {
      ok: boolean;
      accepted: true;
      job_id: string;
      message?: string;
    };
