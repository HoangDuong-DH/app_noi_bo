"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Email và mật khẩu là bắt buộc.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false
    });

    setLoading(false);
    if (res?.error) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }

    router.push("/sa");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3 rounded-xl border bg-white p-5">
        <h1 className="text-xl font-semibold">Đăng nhập</h1>
        <input
          type="email"
          required
          placeholder="Email"
          className="w-full rounded border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Mật khẩu"
          className="w-full rounded border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-40"
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </div>
  );
}
