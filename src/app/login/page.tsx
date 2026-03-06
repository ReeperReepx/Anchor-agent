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
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center text-[22px] font-bold text-[#B85C42] mb-8"
        >
          Anchor
        </Link>

        {sent ? (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#1D1D1F]">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              We sent a sign-in link to{" "}
              <strong className="text-[#1D1D1F]">{email}</strong>
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
                <div className="w-full border-t border-[#E5E5E5]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#F8F7F4] px-2 text-[#9CA3AF]">or</span>
              </div>
            </div>

            <form onSubmit={handleMagicLink}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#6B7280] mb-1"
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
                className="w-full rounded-lg border border-[#E5E5E5] bg-white px-3 py-2.5 text-sm text-[#1D1D1F] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#B85C42] focus:border-[#B85C42]"
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
