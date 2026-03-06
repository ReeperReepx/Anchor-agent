"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F1] px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center text-[22px] font-bold text-[#C4654A] mb-8"
        >
          Anchor
        </Link>

        {sent ? (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#2C2825]">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-[#8a7e74]">
              We sent a sign-in link to{" "}
              <strong className="text-[#2C2825]">{email}</strong>
            </p>
          </div>
        ) : (
          <>
            <Button
              variant="secondary"
              className="w-full mb-4"
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8DDD3]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#FAF6F1] px-2 text-[#a89a8e]">or</span>
              </div>
            </div>

            <form onSubmit={handleMagicLink}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#8a7e74] mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#E8DDD3] bg-white px-3 py-2.5 text-sm text-[#2C2825] placeholder-[#a89a8e] focus:outline-none focus:ring-2 focus:ring-[#C4654A] focus:border-[#C4654A]"
              />
              {error && (
                <p className="mt-2 text-sm text-[#EF4444]">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send magic link"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
