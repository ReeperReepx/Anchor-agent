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
    <div className="min-h-screen bg-[#F8F7F4]">
      <nav className="sticky top-0 z-50 bg-[#F8F7F4]/85 backdrop-blur-md flex items-center justify-between px-10 py-5 max-w-[1100px] mx-auto border-b border-[#E5E5E5]">
        <span className="text-[22px] font-bold text-[#B85C42]">Anchor</span>
        <div className="flex items-center gap-5 text-sm text-[#6B7280]">
          <a href="#how-it-works" className="hover:text-[#1D1D1F] transition-colors">
            How it works
          </a>
          <a href="#early-access" className="hover:text-[#1D1D1F] transition-colors">
            Early Access
          </a>
          <Link href="/login" className="hover:text-[#1D1D1F] transition-colors">
            Login
          </Link>
          <Link href="/login">
            <Button size="sm">Get Early Access</Button>
          </Link>
        </div>
      </nav>

      <Hero />

      <div className="text-center py-6 px-10 text-[13px] text-[#9CA3AF] border-t border-[#E5E5E5]">
        Now in early access — join the first wave of builders
      </div>

      <StatsBar />
      <HowItWorks />
      <OutcomeCards />
      <Testimonials />
      <Pricing />
      <FAQ />

      <footer className="px-10 py-6 border-t border-[#E5E5E5] text-center text-xs text-[#9CA3AF]">
        2026 Anchor. All rights reserved. &nbsp;|&nbsp; <Link href="/blog" className="hover:text-[#1D1D1F] transition-colors">Blog</Link> &nbsp;|&nbsp; Terms &nbsp;|&nbsp;
        Privacy
      </footer>
    </div>
  );
}
