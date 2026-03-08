"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import type { PlanKey } from "@/lib/stripe";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(plan: PlanKey) {
    setLoading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
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

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] tracking-[-0.02em] mb-3">
          Choose your plan
        </h1>
        <p className="text-[#6B7280] text-sm sm:text-base max-w-md mx-auto">
          Every plan starts with a 7-day free trial. Cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Free Trial */}
        <div className="relative rounded-xl border border-[#2D8A56] p-6 sm:p-8 bg-white shadow-[0_4px_32px_rgba(45,138,86,0.08)]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2D8A56] to-[#5BB88A] rounded-t-[16px]" />
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-[#1D1D1F]">Free Trial</h2>
            <span className="text-[10px] bg-[rgba(45,138,86,0.1)] text-[#2D8A56] px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.5px]">
              7 days
            </span>
          </div>
          <div className="mb-5">
            <span className="text-[40px] font-bold text-[#1D1D1F]">$0</span>
            <span className="text-[#6B7280] text-sm">/7 days</span>
          </div>
          <ul className="space-y-2.5 mb-8">
            {[
              "Full Builder plan access",
              "Daily voice standups",
              "AI-generated summaries",
              "No credit card charged",
              "Cancel anytime",
            ].map((f) => (
              <li key={f} className="text-sm text-[#4B5563] flex items-start gap-2">
                <svg className="w-4 h-4 text-[#2D8A56] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p className="text-center text-[11px] text-[#9CA3AF] mt-3">
            Then $20/mo after trial ends
          </p>
        </div>

        {/* Builder */}
        <div className="relative rounded-xl border border-[#E5E5E5] p-6 sm:p-8 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-[#1D1D1F]">{builder.name}</h2>
          </div>
          <div className="mb-5">
            <span className="text-[40px] font-bold text-[#1D1D1F]">${builder.price}</span>
            <span className="text-[#6B7280] text-sm">/month</span>
          </div>
          <ul className="space-y-2.5 mb-8">
            {builder.features.map((f) => (
              <li key={f} className="text-sm text-[#4B5563] flex items-start gap-2">
                <svg className="w-4 h-4 text-[#2D8A56] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p className="text-center text-[11px] text-[#9CA3AF] mt-3">
            7-day free trial included
          </p>
        </div>

        {/* Founder */}
        <div className="relative rounded-xl border border-[#B85C42] p-6 sm:p-8 bg-white shadow-[0_4px_32px_rgba(184,92,66,0.12)]">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B85C42] to-[#D4917F] rounded-t-[16px]" />
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-[#1D1D1F]">{founder.name}</h2>
            <span className="text-[10px] bg-[rgba(184,92,66,0.1)] text-[#B85C42] px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.5px]">
              Popular
            </span>
          </div>
          <div className="mb-5">
            <span className="text-[40px] font-bold text-[#1D1D1F]">${founder.price}</span>
            <span className="text-[#6B7280] text-sm">/month</span>
          </div>
          <ul className="space-y-2.5 mb-8">
            {founder.features.map((f) => (
              <li key={f} className="text-sm text-[#4B5563] flex items-start gap-2">
                <svg className="w-4 h-4 text-[#2D8A56] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p className="text-center text-[11px] text-[#9CA3AF] mt-3">
            7-day free trial included
          </p>
        </div>
      </div>
    </div>
  );
}
