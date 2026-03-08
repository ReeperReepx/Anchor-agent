import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import type { PlanKey } from "@/lib/stripe";
import { ScrollReveal } from "./scroll-reveal";

export function Pricing() {
  return (
    <section id="pricing" className="px-5 sm:px-10 py-16 sm:py-24 bg-[#000000]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-[5vw] items-start">
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
          </ScrollReveal>
        </div>

        {/* Right — cards (3 cols) */}
        <div className="md:col-span-3 space-y-4">
          {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(
            ([key, plan], i) => {
              const isPremium = key === "founder";
              return (
                <ScrollReveal key={key} delay={i * 120}>
                  <div
                    className={`relative rounded-2xl p-6 sm:p-8 ${
                      isPremium
                        ? "bg-white ring-1 ring-[#FF9500]/40"
                        : "bg-white ring-1 ring-[#e5e5e5]"
                    }`}
                  >
                    {isPremium && (
                      <div className="absolute -top-2.5 right-6 bg-[#FF9500] text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full">
                        Popular
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                      <div className="shrink-0">
                        <h3 className="text-base font-semibold text-[#1d1d1f]">
                          {plan.name}
                        </h3>
                        <div className="mt-1">
                          <span className="text-[36px] font-bold text-[#1d1d1f] tracking-tight">
                            ${plan.price}
                          </span>
                          <span className="text-[#86868b] text-sm">/mo</span>
                        </div>
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
                                ? "bg-[#FF9500] hover:bg-[#FFa526] text-white border-none"
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
    </section>
  );
}
