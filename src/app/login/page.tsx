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
    <div className="min-h-screen flex">
      {/* Left brand panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#1D1D1F] via-[#2A2A2C] to-[#1D1D1F] relative overflow-hidden flex-col justify-between p-12">
        {/* Subtle accent glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#0071E3] rounded-full opacity-[0.06] blur-[100px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[300px] h-[300px] bg-[#0071E3] rounded-full opacity-[0.04] blur-[80px]" />

        <div>
          <Link href="/" className="text-[22px] font-bold text-white">
            Anchor
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-[38px] font-bold text-white leading-[1.2] tracking-[-0.02em] mb-5">
            Five minutes.<br />
            Three questions.<br />
            <span className="text-[#0077ED]">Every damn day.</span>
          </h1>
          <p className="text-[16px] text-[#9CA3AF] leading-relaxed max-w-[360px]">
            The voice-first daily standup for solopreneurs who ship. No typing, no dashboards, no excuses.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[11px] font-semibold text-white/70"
                style={{ marginLeft: i > 1 ? "-8px" : 0 }}
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <span className="text-[13px] text-[#9CA3AF] ml-1">Join 200+ builders</span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[#86868B]">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#34C759]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free for 7 days
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#34C759]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#34C759]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Cancel anytime
            </span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-[#F5F5F7] px-6">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <Link
            href="/"
            className="lg:hidden block text-center text-[22px] font-bold text-[#0071E3] mb-2"
          >
            Anchor
          </Link>

          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
            {sent ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-[rgba(52,199,89,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#34C759]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-[#1D1D1F] mb-2">
                  Check your email
                </h2>
                <p className="text-sm text-[#86868B]">
                  We sent a sign-in link to{" "}
                  <strong className="text-[#1D1D1F]">{email}</strong>
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-sm text-[#0071E3] hover:text-[#0077ED] transition-colors"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-[#1D1D1F] mb-1">
                    Welcome back
                  </h2>
                  <p className="text-sm text-[#86868B]">
                    Sign in to continue your streak
                  </p>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 border border-[#E5E5E5] hover:border-[#D0D0D0] bg-white hover:bg-[#FAFAFA] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1D1D1F] transition-all hover:-translate-y-[0.5px] active:translate-y-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5E5E5]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-[#9CA3AF]">or</span>
                  </div>
                </div>

                <form onSubmit={handleMagicLink}>
                  <label
                    htmlFor="email"
                    className="block text-[13px] font-medium text-[#4B5563] mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all"
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

          <p className="text-center text-[12px] text-[#9CA3AF] mt-5">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
