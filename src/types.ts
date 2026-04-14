export type NormalizedJob = {
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
