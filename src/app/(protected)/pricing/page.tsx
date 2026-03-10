"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import type { PlanKey } from "@/lib/stripe";

const PROMO_END = new Date("2026-04-01T00:00:00Z");

// 75% off actual prices
const DISCOUNTED = {
  builder: { monthly: 5, annual: 50 },
  founder: { monthly: 10, annual: 100 },
} as const;

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const [slotsLeft, setSlotsLeft] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/promo-slots")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.remaining === "number") setSlotsLeft(data.remaining);
      })
      .catch(() => {/* keep default */});
  }, []);

  const promoActive = slotsLeft > 0 && new Date() < PROMO_END;

  async function handleCheckout(plan: PlanKey) {
    setLoading(plan);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });
      const text = await res.text();
      let data: { url?: string; error?: string };
      try {
        data = JSON.parse(text);
      } catch {
        setError(`Server returned ${res.status}: ${text.slice(0, 200)}`);
        setLoading(null);
        return;
      }
      if (!res.ok || data.error) {
        setError(`Checkout failed (${res.status}): ${data.error || text.slice(0, 200)}`);
        setLoading(null);
        return;
      }
      if (data.url && typeof data.url === "string") {
        try {
          const parsed = new URL(data.url);
          if (parsed.hostname.endsWith("stripe.com")) {
            window.location.href = data.url;
            return;
          }
        } catch { /* invalid URL */ }
      }
      setError("Failed to create checkout session — no valid URL returned.");
    } catch (e) {
      setError(`Network error: ${e instanceof Error ? e.message : "unknown"}`);
    }
    setLoading(null);
  }

  const builder = PLANS.builder;
  const founder = PLANS.founder;

  function getPrice(plan: "builder" | "founder") {
    const original = PLANS[plan].price;
    if (interval === "annual") {
      const annualFull = original * 12;
      const annualPrice = original * 10; // save 2 months
      const discountedAnnual = promoActive ? DISCOUNTED[plan].annual : annualPrice;
      return {
        display: promoActive ? Math.round(discountedAnnual / 12) : Math.round(annualPrice / 12),
        billedLabel: promoActive
          ? `$${discountedAnnual}/yr (save $${annualFull - discountedAnnual})`
          : `$${annualPrice}/yr (save $${annualFull - annualPrice})`,
        strikethrough: promoActive ? `$${Math.round(annualPrice / 12)}` : null,
      };
    }
    return {
      display: promoActive ? DISCOUNTED[plan].monthly : original,
      billedLabel: null,
      strikethrough: promoActive ? `$${original}/mo` : null,
    };
  }

  const builderPrice = getPrice("builder");
  const founderPrice = getPrice("founder");

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <div className="text-center mb-8">
        <h1 className="text-[26px] sm:text-[36px] font-bold text-[#1D1D1F] tracking-[-0.02em] mb-3">
          Choose your plan
        </h1>
        <p className="text-[#86868B] text-[15px] sm:text-[18px] max-w-md mx-auto mb-6">
          Every plan starts with a 7-day free trial. Cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-[#F5F5F7] rounded-xl p-1 border border-[#E5E5E5]">
          <button
            onClick={() => setInterval("monthly")}
            className={`px-4 sm:px-5 py-2 rounded-lg text-[13px] sm:text-[14px] font-semibold transition-all ${
              interval === "monthly"
                ? "bg-white text-[#1D1D1F] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("annual")}
            className={`px-4 sm:px-5 py-2 rounded-lg text-[13px] sm:text-[14px] font-semibold transition-all flex items-center gap-1.5 ${
              interval === "annual"
                ? "bg-white text-[#1D1D1F] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            }`}
          >
            Annual
            <span className="text-[10px] sm:text-[11px] font-bold text-[#34C759] bg-[rgba(52,199,89,0.1)] px-1.5 py-0.5 rounded-full">
              Save 16%
            </span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-xl border border-[#EF4444]/20 bg-[rgba(239,68,68,0.06)] p-4 text-center">
          <p className="text-[14px] text-[#EF4444] font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        {/* 3 months free for feedback */}
        <div className="relative rounded-xl border border-[#5B5FC7]/30 p-6 bg-white shadow-[0_4px_32px_rgba(91,95,199,0.08)] flex flex-col">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#5B5FC7] to-[#8385D3] rounded-t-[16px]" />
          <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1D1D1F] mb-4">3 Months Free</h2>
          <div className="mb-5 h-[72px] flex items-end">
            <div>
              <span className="text-[42px] sm:text-[48px] font-bold text-[#1D1D1F] leading-none">$0</span>
              <span className="text-[#86868B] text-[14px] sm:text-[16px]">/3 months</span>
            </div>
          </div>
          <ul className="space-y-2.5 flex-1">
            {[
              "Full Founder plan access",
              "30-min feedback call with us",
              "Help shape the product",
              "Get your code on the call",
              "No credit card needed",
            ].map((f) => (
              <li key={f} className="text-[14px] sm:text-[15px] text-[#4B5563] flex items-start gap-2">
                <svg className="w-4 h-4 text-[#5B5FC7] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <a
              href="https://calendly.com/virenpatel25/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="w-full bg-[#5B5FC7] hover:bg-[#4A4EB5] text-white border-none"
                variant="primary"
              >
                Book a call
              </Button>
            </a>
            <p className="text-center text-[12px] sm:text-[13px] text-[#9CA3AF] mt-3">
              In exchange for your feedback
            </p>
          </div>
        </div>

        {/* Builder */}
        <div className="relative rounded-xl border border-[#E5E5E5] p-6 bg-white flex flex-col">
          {promoActive && (
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#FF3B30] px-2.5 py-1 rounded-full uppercase tracking-[0.5px] shadow-sm">
                75% off
              </span>
            </div>
          )}
          <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1D1D1F] mb-4">{builder.name}</h2>
          <div className="mb-5 h-[72px] flex items-end">
            <div>
              <span className="text-[42px] sm:text-[48px] font-bold text-[#1D1D1F] leading-none">${builderPrice.display}</span>
              <span className="text-[#86868B] text-[14px] sm:text-[16px]">/mo</span>
              {builderPrice.strikethrough && (
                <span className="block text-[16px] sm:text-[18px] text-[#9CA3AF] line-through mt-0.5">
                  {builderPrice.strikethrough}
                </span>
              )}
              {builderPrice.billedLabel && (
                <span className="block text-[12px] sm:text-[13px] text-[#34C759] font-medium mt-1">
                  {builderPrice.billedLabel}
                </span>
              )}
            </div>
          </div>
          <ul className="space-y-2.5 flex-1">
            {builder.features.map((f) => (
              <li key={f} className="text-[14px] sm:text-[15px] text-[#4B5563] flex items-start gap-2">
                <svg className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => handleCheckout("builder")}
              loading={loading === "builder"}
              disabled={loading !== null}
            >
              {loading === "builder" ? "Redirecting..." : "Start with Builder"}
            </Button>
            <p className="text-center text-[12px] sm:text-[13px] text-[#9CA3AF] mt-3">
              7-day free trial included
            </p>
          </div>
        </div>

        {/* Founder */}
        <div className="relative rounded-xl border border-accent p-6 bg-white shadow-[0_4px_32px_rgba(181,115,8,0.12)] flex flex-col">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-accent-hover rounded-t-[16px]" />
          {promoActive && (
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#FF3B30] px-2.5 py-1 rounded-full uppercase tracking-[0.5px] shadow-sm">
                75% off
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#1D1D1F]">{founder.name}</h2>
            <span className="text-[11px] sm:text-[12px] bg-[rgba(181,115,8,0.1)] text-accent px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.5px]">
              Popular
            </span>
          </div>
          <div className="mb-5 h-[72px] flex items-end">
            <div>
              <span className="text-[42px] sm:text-[48px] font-bold text-[#1D1D1F] leading-none">${founderPrice.display}</span>
              <span className="text-[#86868B] text-[14px] sm:text-[16px]">/mo</span>
              {founderPrice.strikethrough && (
                <span className="block text-[16px] sm:text-[18px] text-[#9CA3AF] line-through mt-0.5">
                  {founderPrice.strikethrough}
                </span>
              )}
              {founderPrice.billedLabel && (
                <span className="block text-[12px] sm:text-[13px] text-[#34C759] font-medium mt-1">
                  {founderPrice.billedLabel}
                </span>
              )}
            </div>
          </div>
          <ul className="space-y-2.5 flex-1">
            {founder.features.map((f) => (
              <li key={f} className="text-[14px] sm:text-[15px] text-[#4B5563] flex items-start gap-2">
                <svg className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button
              className="w-full"
              variant="primary"
              onClick={() => handleCheckout("founder")}
              loading={loading === "founder"}
              disabled={loading !== null}
            >
              {loading === "founder" ? "Redirecting..." : "Start with Founder"}
            </Button>
            <p className="text-center text-[12px] sm:text-[13px] text-[#9CA3AF] mt-3">
              7-day free trial included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
