"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseEnv } from "@/lib/config";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    params.get("error") === "unauthorized" ? "Not authorized as admin." : "",
  );
  const [loading, setLoading] = useState(false);
  const supabaseReady = hasSupabaseEnv();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!supabaseReady) {
      router.push("/admin/dashboard");
      return;
    }

    try {
      const supabase = createClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) throw signError;
      router.push(params.get("next") || "/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md rounded-[2rem] bg-milk p-8 shadow-lg">
      <h1 className="font-plush text-3xl font-extrabold">Admin login</h1>
      <p className="mt-2 text-sm text-cocoa-soft">
        Sign in to manage puppies, enquiries, and content.
      </p>
      {!supabaseReady && (
        <p className="mt-4 rounded-xl bg-honey-soft/70 p-3 text-sm">
          Supabase env not configured — click Sign in to open demo admin with local data.
        </p>
      )}
      <label className="mt-6 block text-sm font-semibold" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required={supabaseReady}
        className="mt-1 w-full rounded-xl border border-cocoa/15 px-3 py-2"
      />
      <label className="mt-4 block text-sm font-semibold" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required={supabaseReady}
        className="mt-1 w-full rounded-xl border border-cocoa/15 px-3 py-2"
      />
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <Button type="submit" className="mt-6 w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
