export async function callN8n<T>(path: string, payload?: unknown): Promise<T> {
  const baseUrl = process.env.N8N_BASE_URL;
  if (!baseUrl) {
    throw new Error("N8N_BASE_URL is missing");
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-token": process.env.N8N_INTERNAL_TOKEN || ""
    },
    body: JSON.stringify(payload ?? {}),
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `n8n error ${res.status}`);
  }

  return (await res.json()) as T;
}
