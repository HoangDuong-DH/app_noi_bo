function normalizeBaseUrl(rawBaseUrl: string): string {
  return rawBaseUrl.replace(/\/+$/, "");
}

function normalizePath(rawPath: string): string {
  if (!rawPath) return "/";
  return rawPath.startsWith("/") ? rawPath : `/${rawPath}`;
}

function resolveTimeoutMs(): number {
  const raw = process.env.N8N_TIMEOUT_MS;
  if (!raw) return 15000;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("N8N_TIMEOUT_MS must be a positive number");
  }

  return parsed;
}

export async function callN8n<T>(path: string, payload?: unknown): Promise<T> {
  const rawBaseUrl = process.env.N8N_BASE_URL;
  if (!rawBaseUrl) {
    throw new Error("N8N_BASE_URL is missing");
  }

  const token = process.env.N8N_INTERNAL_TOKEN;
  if (!token) {
    throw new Error("N8N_INTERNAL_TOKEN is missing");
  }

  const baseUrl = normalizeBaseUrl(rawBaseUrl);
  const normalizedPath = normalizePath(path);
  const timeoutMs = resolveTimeoutMs();

  const res = await fetch(`${baseUrl}${normalizedPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-token": token
    },
    body: JSON.stringify(payload ?? {}),
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `n8n error ${res.status}`);
  }

  return (await res.json()) as T;
}
