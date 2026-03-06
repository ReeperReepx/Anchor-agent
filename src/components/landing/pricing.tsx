import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Pricing() {
  return (
    <section id="early-access" className="px-10 py-[60px] text-center border-t border-[#E8DDD3]">
      <div className="max-w-[600px] mx-auto">
        <h2 className="text-[36px] font-bold tracking-[-0.02em] text-[#2C2825] mb-3">
          Free while we build.
        </h2>
        <p className="text-[15px] text-[#8a7e74] mb-3 leading-relaxed">
          Anchor is in early access. Sign up now and get full access for free — no credit card, no catch.
        </p>
        <p className="text-[13px] text-[#a89a8e] mb-10">
          Early users will be grandfathered into the best pricing when we launch paid plans.
        </p>

        <div className="bg-white rounded-[14px] border-2 border-[#C4654A] p-10 max-w-[400px] mx-auto text-left shadow-[0_4px_24px_rgba(196,101,74,0.1)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-[13px] text-[#C4654A] uppercase tracking-[1px] font-semibold">Early Access</div>
            <span className="text-[11px] bg-[rgba(196,101,74,0.1)] text-[#C4654A] px-2 py-0.5 rounded-full font-medium">Free</span>
          </div>
          <div className="text-[40px] font-bold text-[#2C2825] mb-1">
            $0
            <span className="text-base font-normal text-[#8a7e74]">/mo</span>
          </div>
          <ul className="mt-5 space-y-2">
            {[
              "Daily voice standups",
              "Accountability partner matching",
              "Full transcript history",
              "Weekly & monthly summaries",
              "Calendar sync",
            ].map((f) => (
              <li key={f} className="text-sm text-[#5a524a] flex items-center gap-2">
                <svg className="w-4 h-4 text-[#2D8A56] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/login" className="block mt-8">
            <Button className="w-full">Get Early Access</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
