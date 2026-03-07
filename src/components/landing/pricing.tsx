import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import type { PlanKey } from "@/lib/stripe";

export function Pricing() {
  return (
    <section id="pricing" className="px-5 sm:px-10 py-12 sm:py-[60px] text-center border-t border-[#E5E5E5]">
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.02em] text-[#1D1D1F] mb-3">
          Simple, transparent pricing.
        </h2>
        <p className="text-[15px] text-[#6B7280] mb-3 leading-relaxed">
          Start with a 7-day free trial. Cancel anytime. No credit card charged until your trial ends.
        </p>
        <p className="text-[13px] text-[#9CA3AF] mb-10">
          Both plans include daily voice standups, transcripts, and accountability.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[700px] mx-auto text-left">
          {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(
            ([key, plan]) => {
              const isPremium = key === "founder";
              return (
                <div
                  key={key}
                  className={`relative bg-white rounded-[16px] border p-6 sm:p-8 ${
                    isPremium
                      ? "border-[#B85C42] shadow-[0_4px_32px_rgba(184,92,66,0.12)]"
                      : "border-[#E5E5E5] shadow-[0_4px_32px_rgba(0,0,0,0.06)]"
                  }`}
                >
                  {isPremium && (
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B85C42] to-[#D4917F] rounded-t-[16px]" />
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-[#1D1D1F]">
                      {plan.name}
                    </h3>
                    {isPremium && (
                      <span className="text-[10px] bg-[rgba(184,92,66,0.1)] text-[#B85C42] px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.5px]">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="mb-5">
                    <span className="text-[40px] font-bold text-[#1D1D1F]">
                      ${plan.price}
                    </span>
                    <span className="text-[#6B7280] text-sm">/month</span>
                  </div>
                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="text-sm text-[#4B5563] flex items-start gap-2"
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
