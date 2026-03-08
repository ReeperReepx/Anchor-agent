import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import type { PlanKey } from "@/lib/stripe";

export function Pricing() {
  return (
    <section id="pricing" className="px-5 sm:px-10 py-16 sm:py-24 text-center">
      <div className="max-w-[800px] mx-auto">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#B85C42] mb-3">
          Pricing
        </p>
        <h2 className="text-[28px] sm:text-[40px] font-bold tracking-[-0.025em] text-[#1D1D1F] mb-4 leading-tight">
          Simple, transparent pricing.
        </h2>
        <p className="text-sm sm:text-base text-[#6B7280] mb-4 leading-relaxed max-w-[520px] mx-auto">
          Start with a 7-day free trial. Cancel anytime. No credit card charged until your trial ends.
        </p>
        <p className="text-xs text-[#9CA3AF] mb-12">
          Both plans include daily voice standups, transcripts, and accountability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[700px] mx-auto text-left">
          {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(
            ([key, plan]) => {
              const isPremium = key === "founder";
              return (
                <div
                  key={key}
                  className={`relative bg-white rounded-xl border p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] ${
                    isPremium
                      ? "border-[#B85C42] shadow-[0_4px_32px_rgba(184,92,66,0.1)] ring-1 ring-[#B85C42]/20"
                      : "border-[#E5E5E5]"
                  }`}
                >
                  {isPremium && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B85C42] text-white text-[10px] font-semibold uppercase tracking-[0.5px] px-3 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1">
                    {plan.name}
                  </h3>
                  <div className="mb-5">
                    <span className="text-[44px] font-bold text-[#1D1D1F] tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="text-[#9CA3AF] text-sm">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="text-sm text-[#4B5563] flex items-start gap-2.5"
                      >
                        <svg
                          className="w-4 h-4 text-[#2D8A56] shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/login">
                    <Button
                      className="w-full"
                      variant={isPremium ? "primary" : "secondary"}
                      size="lg"
                    >
                      Start free trial
                    </Button>
                  </Link>
                  <p className="text-center text-[11px] text-[#9CA3AF] mt-3">
                    7-day free trial, then ${plan.price}/mo
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
