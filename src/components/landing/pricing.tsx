"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import type { PlanKey } from "@/lib/stripe";
import { ScrollReveal } from "./scroll-reveal";

const PROMO_END = new Date("2026-04-01T00:00:00Z");

const DISCOUNTED: Record<PlanKey, { monthly: number; annual: number }> = {
  builder: { monthly: 5, annual: 50 },
  founder: { monthly: 10, annual: 100 },
};

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Pricing() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(PROMO_END));
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft(PROMO_END)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const promoActive = !timeLeft.expired;

  function getPrice(key: PlanKey) {
    const original = PLANS[key].price;
    if (interval === "annual") {
      const annualPrice = original * 10;
      const discounted = promoActive ? DISCOUNTED[key].annual : annualPrice;
      return {
        display: Math.round(discounted / 12),
        strikethrough: promoActive ? `$${Math.round(annualPrice / 12)}` : null,
        sub: promoActive
          ? `$${discounted}/yr`
          : `$${annualPrice}/yr (save 2 months)`,
      };
    }
    return {
      display: promoActive ? DISCOUNTED[key].monthly : original,
      strikethrough: promoActive ? `$${original}` : null,
      sub: null,
    };
  }

  return (
    <section id="pricing" className="px-5 sm:px-10 py-16 sm:py-24 bg-[#000000]">
      <div className="max-w-[1200px] mx-auto">
        {/* Promo countdown */}
        {promoActive && (
          <ScrollReveal>
            <div className="mb-10 rounded-2xl border border-[#333] bg-[#111] p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-black bg-[#FFD60A] px-3 py-1 rounded-full uppercase tracking-[0.5px]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      50% off
                    </span>
                    <span className="text-[13px] font-semibold text-[#FFD60A]">March Launch Special</span>
                  </div>
                  <p className="text-[14px] text-[#86868b]">
                    Lock in 50% off your subscription. Ends March 31st.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {[
                    { value: timeLeft.days, label: "days" },
                    { value: timeLeft.hours, label: "hrs" },
                    { value: timeLeft.minutes, label: "min" },
                    { value: timeLeft.seconds, label: "sec" },
                  ].map((unit, i) => (
                    <div key={unit.label} className="flex items-center gap-1.5">
                      <div className="flex flex-col items-center">
                        <span className="text-[20px] sm:text-[24px] font-bold text-white tabular-nums leading-none bg-[#1d1d1f] border border-[#333] rounded-lg px-2 py-1.5 min-w-[44px] text-center">
                          {pad(unit.value)}
                        </span>
                        <span className="text-[9px] font-medium text-[#86868b] mt-1 uppercase tracking-wider">
                          {unit.label}
                        </span>
                      </div>
                      {i < 3 && <span className="text-[18px] font-bold text-[#555] mb-3.5">:</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-[5vw] items-start">
          {/* Left — heading (2 cols) */}
          <div className="md:col-span-2">
            <ScrollReveal>
              <p className="text-[#2997FF] text-sm font-semibold mb-3 tracking-wide">
                Pricing
              </p>
              <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.035em] text-white leading-tight">
                Simple
                <br />
                pricing.
              </h2>
              <p className="text-[#86868b] text-base mt-3 leading-relaxed max-w-[300px]">
                Start with a 7-day free trial. Cancel anytime. No credit card charged until trial ends.
              </p>
              <p className="text-[#86868b] text-sm mt-4">
                Both plans include daily voice standups, transcripts, and accountability.
              </p>

              {/* Billing toggle */}
              <div className="mt-6 inline-flex items-center bg-[#1d1d1f] rounded-xl p-1 border border-[#333]">
                <button
                  onClick={() => setInterval("monthly")}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                    interval === "monthly"
                      ? "bg-[#333] text-white"
                      : "text-[#86868b] hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setInterval("annual")}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
                    interval === "annual"
                      ? "bg-[#333] text-white"
                      : "text-[#86868b] hover:text-white"
                  }`}
                >
                  Annual
                  <span className="text-[10px] font-bold text-[#30D158] bg-[rgba(48,209,88,0.15)] px-1.5 py-0.5 rounded-full">
                    Save 2mo
                  </span>
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right — cards (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(
              ([key, plan], i) => {
                const isPremium = key === "founder";
                const price = getPrice(key);
                return (
                  <ScrollReveal key={key} delay={i * 120}>
                    <div
                      className={`relative rounded-2xl p-6 sm:p-8 ${
                        isPremium
                          ? "bg-white ring-1 ring-[#0071E3]/40"
                          : "bg-white ring-1 ring-[#e5e5e5]"
                      }`}
                    >
                      {isPremium && (
                        <div className="absolute -top-2.5 right-6 bg-[#0071E3] text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full">
                          Popular
                        </div>
                      )}
                      {promoActive && (
                        <div className="absolute -top-2.5 left-6 bg-[#FF3B30] text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full">
                          50% off
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                        <div className="shrink-0">
                          <h3 className="text-base font-semibold text-[#1d1d1f]">
                            {plan.name}
                          </h3>
                          <div className="mt-1">
                            <span className="text-[36px] font-bold text-[#1d1d1f] tracking-tight">
                              ${price.display}
                            </span>
                            <span className="text-[#86868b] text-sm">/mo</span>
                            {price.strikethrough && (
                              <span className="ml-2 text-[16px] text-[#9CA3AF] line-through">
                                {price.strikethrough}
                              </span>
                            )}
                          </div>
                          {price.sub && (
                            <p className="text-[11px] text-[#30D158] font-medium mt-0.5">{price.sub}</p>
                          )}
                          <p className="text-[11px] text-[#86868b] mt-1">7 days free</p>
                        </div>

                        <div className="flex-1">
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {plan.features.map((f) => (
                              <li
                                key={f}
                                className="text-[13px] text-[#86868b] flex items-center gap-2"
                              >
                                <svg className="w-3.5 h-3.5 text-[#30D158] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="shrink-0 w-full sm:w-auto">
                          <Link href="/login">
                            <Button
                              className={`rounded-full px-6 py-2.5 text-[13px] font-semibold w-full sm:w-auto min-h-[44px] ${
                                isPremium
                                  ? "bg-[#0071E3] hover:bg-[#0077ED] text-white border-none"
                                  : "bg-[#1d1d1f] hover:bg-[#333] text-white border-none"
                              }`}
                              size="sm"
                            >
                              Start now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
