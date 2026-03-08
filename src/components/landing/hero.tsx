import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroTranscript } from "./hero-transcript";

export function Hero() {
  return (
    <section className="px-5 sm:px-10 pt-8 sm:pt-16 pb-10 sm:pb-20 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[10vw] items-center">
        {/* Left — copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#f5f5f7] rounded-full px-3.5 py-1.5 mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
            <span className="text-[12px] text-[#86868b] font-medium">Trusted by 200+ solo founders</span>
          </div>
          <h1 className="text-[36px] sm:text-[52px] md:text-[60px] font-bold tracking-[-0.04em] leading-[1.06] text-[#1d1d1f]">
            Daily planning
            <br />
            and standups{" "}
            <br className="hidden sm:block" />
            <span className="text-[#86868b]">for solo founders.</span>
          </h1>
          <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-[#86868b] max-w-[380px] leading-relaxed">
            The perfect app for solopreneurs who want to get ahead of their day.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-[#FF9500] hover:bg-[#FFa526] text-white px-8 py-4 text-base rounded-full shadow-none border-none w-full sm:w-auto min-h-[48px]"
              >
                Start free trial
              </Button>
            </Link>
            <a
              href="#how-it-works"
              className="text-[#FF9500] text-[15px] font-semibold hover:underline underline-offset-4 min-h-[48px] flex items-center"
            >
              See how it works &darr;
            </a>
          </div>
        </div>

        {/* Right — floating transcript bubbles */}
        <div className="relative">
          <HeroTranscript />
        </div>
      </div>
    </section>
  );
}
