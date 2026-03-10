"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import type { PlanKey } from "@/lib/stripe";

const PROMO_END = new Date("2026-04-01T00:00:00Z");

// 75% off actual prices shown as "75% off"
const DISCOUNTED = {
  builder: { monthly: 5, annual: 50 },
  founder: { monthly: 10, annual: 100 },
} as const;

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");
  const [slotsLeft, setSlotsLeft] = useState<number>(10);

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
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, interval }),
    });
    const data = await res.json();
    if (data.url && typeof data.url === "string") {
      try {
        const parsed = new URL(data.url);
        if (parsed.hostname.endsWith("stripe.com")) {
          window.location.href = data.url;
          return;
        }
      } catch { /* invalid URL */ }
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
        total: promoActive ? discountedAnnual : annualPrice,
        originalTotal: annualFull,
        perMonth: true,
        billedLabel: promoActive
          ? `$${discountedAnnual}/yr (save $${annualFull - discountedAnnual})`
          : `$${annualPrice}/yr (save $${annualFull - annualPrice})`,
        strikethrough: promoActive ? `$${annualPrice}/yr` : null,
      };
    }
    return {
      display: promoActive ? DISCOUNTED[plan].monthly : original,
      total: promoActive ? DISCOUNTED[plan].monthly : original,
      originalTotal: original,
      perMonth: false,
      billedLabel: null,
      strikethrough: promoActive ? `$${original}/mo` : null,
    };
  }

  const builderPrice = getPrice("builder");
  const founderPrice = getPrice("founder");

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Promo Banner */}
      {promoActive && (
        <div className="relative mb-8 rounded-2xl border border-accent/20 bg-gradient-to-r from-[rgba(181,115,8,0.06)] via-[rgba(181,115,8,0.03)] to-[rgba(181,115,8,0.06)] p-5 sm:p-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent via-accent-hover to-accent" />
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white bg-accent px-3 py-1 rounded-full uppercase tracking-[0.5px]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  75% off
                </span>
                <span className="text-[13px] font-semibold text-accent">Launch discount</span>
              </div>
              <p className="text-[14px] text-[#86868B]">
                Lock in 75% off your subscription. Only <strong className="text-[#1D1D1F]">{slotsLeft} spots</strong> left at this price.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#E5E5E5] rounded-xl px-4 py-3 shadow-sm">
              <svg className="w-5 h-5 text-[#FF3B30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[22px] font-bold text-[#1D1D1F] tabular-nums">{slotsLeft}</span>
              <span className="text-[13px] font-medium text-[#86868B]">spots left</span>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-[28px] sm:text-[36px] font-bold text-[#1D1D1F] tracking-[-0.02em] mb-3">
          Choose your plan
        </h1>
        <p className="text-[#86868B] text-[16px] sm:text-[18px] max-w-md mx-auto mb-6">
          Every plan starts with a 7-day free trial. Cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center bg-[#F5F5F7] rounded-xl p-1 border border-[#E5E5E5]">
          <button
            onClick={() => setInterval("monthly")}
            className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-all ${
              interval === "monthly"
                ? "bg-white text-[#1D1D1F] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("annual")}
            className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-all flex items-center gap-1.5 ${
              interval === "annual"
                ? "bg-white text-[#1D1D1F] shadow-sm"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            }`}
          >
            Annual
            <span className="text-[11px] font-bold text-[#34C759] bg-[rgba(52,199,89,0.1)] px-1.5 py-0.5 rounded-full">
              Save 16%
            </span>
          </button>
        </div>
      </div>

      {/* Feedback deal */}
      <div className="mb-8 rounded-2xl border border-[#5B5FC7]/20 bg-gradient-to-r from-[rgba(91,95,199,0.06)] via-white to-[rgba(91,95,199,0.06)] p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#5B5FC7] to-[#8385D3]" />
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white bg-[#5B5FC7] px-3 py-1 rounded-full uppercase tracking-[0.5px]">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                3 months free
              </span>
            </div>
            <h3 className="text-[16px] font-semibold text-[#1D1D1F] mb-1">
              Get 3 months free in exchange for your feedback
            </h3>
            <p className="text-[14px] text-[#86868B]">
              Hop on a 30-min call with us. Share what&apos;s working, what isn&apos;t, and help shape Anchor.
              You&apos;ll get a code for 3 months free at the end of the call.
            </p>
          </div>
          <a
            href="https://calendly.com/virenpatel25/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button variant="secondary" className="whitespace-nowrap border-[#5B5FC7]/30 text-[#5B5FC7] hover:bg-[rgba(91,95,199,0.08)]">
              Book a call
            </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Free Trial */}
        <div className="relative rounded-xl border border-[#34C759] p-6 sm:p-8 bg-white shadow-[0_4px_32px_rgba(52,199,89,0.08)]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#34C759] to-[#30D158] rounded-t-[16px]" />
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[22px] font-semibold text-[#1D1D1F]">Free Trial</h2>
            <span className="text-[12px] bg-[rgba(52,199,89,0.1)] text-[#34C759] px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.5px]">
              7 days
            </span>
          </div>
          <div className="mb-5">
            <span className="text-[48px] font-bold text-[#1D1D1F]">$0</span>
            <span className="text-[#86868B] text-[16px]">/7 days</span>
          </div>
          <ul className="space-y-2.5 mb-8">
            {[
              "Full Builder plan access",
              "Daily voice standups",
              "AI-generated summaries",
              "No credit card charged",
              "Cancel anytime",
            ].map((f) => (
              <li key={f} className="text-[16px] text-[#4B5563] flex items-start gap-2">
                <svg className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            variant="primary"
            onClick={() => handleCheckout("builder")}
            loading={loading === "builder"}
            disabled={loading !== null}
          >
            {loading === "builder" ? "Redirecting..." : "Start free trial"}
          </Button>
          <p className="text-center text-[13px] text-[#9CA3AF] mt-3">
            Then ${builderPrice.display}/mo after trial
          </p>
        </div>

        {/* Builder */}
        <div className="relative rounded-xl border border-[#E5E5E5] p-6 sm:p-8 bg-white">
          {promoActive && (
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#FF3B30] px-2.5 py-1 rounded-full uppercase tracking-[0.5px] shadow-sm">
                75% off
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[22px] font-semibold text-[#1D1D1F]">{builder.name}</h2>
          </div>
          <div className="mb-5">
            <span className="text-[48px] font-bold text-[#1D1D1F]">${builderPrice.display}</span>
            <span className="text-[#86868B] text-[16px]">/month</span>
            {builderPrice.strikethrough && (
              <span className="block text-[18px] text-[#9CA3AF] line-through mt-0.5">
                {builderPrice.strikethrough}
              </span>
            )}
            {builderPrice.billedLabel && (
              <span className="block text-[13px] text-[#34C759] font-medium mt-1">
                {builderPrice.billedLabel}
              </span>
            )}
          </div>
          <ul className="space-y-2.5 mb-8">
            {builder.features.map((f) => (
              <li key={f} className="text-[16px] text-[#4B5563] flex items-start gap-2">
                <svg className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => handleCheckout("builder")}
            loading={loading === "builder"}
            disabled={loading !== null}
          >
            {loading === "builder" ? "Redirecting..." : "Start with Builder"}
          </Button>
          <p className="text-center text-[13px] text-[#9CA3AF] mt-3">
            7-day free trial included
          </p>
        </div>

        {/* Founder */}
        <div className="relative rounded-xl border border-accent p-6 sm:p-8 bg-white shadow-[0_4px_32px_rgba(181,115,8,0.12)]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-accent-hover rounded-t-[16px]" />
          {promoActive && (
            <div className="absolute -top-3 right-4">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#FF3B30] px-2.5 py-1 rounded-full uppercase tracking-[0.5px] shadow-sm">
                75% off
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[22px] font-semibold text-[#1D1D1F]">{founder.name}</h2>
            <span className="text-[12px] bg-[rgba(181,115,8,0.1)] text-accent px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.5px]">
              Popular
            </span>
          </div>
          <div className="mb-5">
            <span className="text-[48px] font-bold text-[#1D1D1F]">${founderPrice.display}</span>
            <span className="text-[#86868B] text-[16px]">/month</span>
            {founderPrice.strikethrough && (
              <span className="block text-[18px] text-[#9CA3AF] line-through mt-0.5">
                {founderPrice.strikethrough}
              </span>
            )}
            {founderPrice.billedLabel && (
              <span className="block text-[13px] text-[#34C759] font-medium mt-1">
                {founderPrice.billedLabel}
              </span>
            )}
          </div>
          <ul className="space-y-2.5 mb-8">
            {founder.features.map((f) => (
              <li key={f} className="text-[16px] text-[#4B5563] flex items-start gap-2">
                <svg className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            variant="primary"
            onClick={() => handleCheckout("founder")}
            loading={loading === "founder"}
            disabled={loading !== null}
          >
            {loading === "founder" ? "Redirecting..." : "Start with Founder"}
          </Button>
          <p className="text-center text-[13px] text-[#9CA3AF] mt-3">
            7-day free trial included
          </p>
        </div>
      </div>
    </div>
  );
}
