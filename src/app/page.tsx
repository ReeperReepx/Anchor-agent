import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/hero";
import { StatsBar, OutcomeCards } from "@/components/landing/outcomes";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/60">
        <div className="flex items-center justify-between px-5 sm:px-10 py-3 max-w-[1080px] mx-auto">
          <span className="text-[20px] font-bold text-[#1d1d1f] tracking-tight">
            Anchor
          </span>
          <div className="flex items-center gap-2 sm:gap-8 text-[13px] font-medium">
            <a href="#how-it-works" className="hidden sm:inline text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors py-2">
              How it works
            </a>
            <a href="#pricing" className="hidden sm:inline text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors py-2">
              Pricing
            </a>
            <Link href="/login" className="text-[#FF9500] hover:text-[#FFa526] transition-colors py-2 px-1">
              Log in
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                className="bg-[#FF9500] hover:bg-[#FFa526] text-white rounded-full px-5 text-[13px] border-none shadow-none"
              >
                Try free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — text left, transcript right */}
      <Hero />

      {/* Stats — horizontal bar */}
      <StatsBar />

      {/* How it works — summary left, steps right, black bg */}
      <HowItWorks />

      {/* Outcomes — text+list left, streak calendar right */}
      <OutcomeCards />

      {/* Why Anchor — sticky heading left, cards right */}
      <Testimonials />

      {/* Pricing — heading left, plan cards right, black bg */}
      <Pricing />

      {/* FAQ — heading left, accordion right */}
      <FAQ />

      {/* Footer */}
      <footer className="px-5 sm:px-10 py-6 border-t border-[#d2d2d7]/60 bg-[#f5f5f7]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86868b] max-w-[1080px] mx-auto">
          <span className="font-semibold text-[#1d1d1f] text-sm">Anchor</span>
          <div className="flex items-center gap-5">
            <Link href="/blog" className="hover:text-[#1d1d1f] transition-colors">Blog</Link>
            <span>Terms</span>
            <span>Privacy</span>
          </div>
          <span>&copy; 2026 Anchor</span>
        </div>
      </footer>
    </div>
  );
}
