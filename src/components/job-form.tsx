"use client";

import { useState } from "react";

export default function JobForm({ onSaved }: { onSaved: () => void }) {
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/jobs/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_name: productName, brand_name: brandName })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.message || "Không lưu được job");
      setLoading(false);
      return;
    }

    setLoading(false);
    setProductName("");
    setBrandName("");
    onSaved();
  }

  return (
    <div className="space-y-3 rounded-xl border bg-white p-4">
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Tên sản phẩm"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        className="w-full rounded border px-3 py-2"
        placeholder="Thương hiệu"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
      />
      <button
        onClick={submit}
        disabled={loading || !productName || !brandName}
        className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-40"
      >
        {loading ? "Đang gửi..." : "Lưu job"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
