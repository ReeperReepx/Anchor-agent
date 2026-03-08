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
    <div className="min-h-screen">
      {/* Dark hero section with nav */}
      <div className="bg-[#111113] relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#B85C42] rounded-full opacity-[0.04] blur-[120px] pointer-events-none" />

        <nav className="sticky top-0 z-50 bg-[#111113]/80 backdrop-blur-xl flex items-center justify-between px-5 sm:px-10 py-4 max-w-[1100px] mx-auto border-b border-white/[0.06]">
          <span className="text-[20px] sm:text-[22px] font-bold text-white">
            <span className="text-[#D4917F]">A</span>nchor
          </span>
          <div className="flex items-center gap-3 sm:gap-6 text-[13px] text-[#8A8A8E] font-medium">
            <a href="#how-it-works" className="hidden sm:inline hover:text-white transition-colors">
              How it works
            </a>
            <a href="#pricing" className="hidden sm:inline hover:text-white transition-colors">
              Pricing
            </a>
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/login">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </nav>

        <Hero />
      </div>

      {/* Light sections */}
      <div className="bg-[#F8F7F4]">
        <StatsBar />
        <HowItWorks />
        <OutcomeCards />
      </div>

      {/* Dark band for social proof */}
      <div className="bg-[#111113]">
        <Testimonials />
      </div>

      {/* Light sections */}
      <div className="bg-[#F8F7F4]">
        <Pricing />
        <FAQ />

        <footer className="px-5 sm:px-10 py-8 border-t border-[#E5E5E5] max-w-[1100px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
            <span className="font-semibold text-[#1D1D1F] text-sm">
              <span className="text-[#B85C42]">A</span>nchor
            </span>
            <div className="flex items-center gap-4">
              <Link href="/blog" className="hover:text-[#1D1D1F] transition-colors">Blog</Link>
              <span>Terms</span>
              <span>Privacy</span>
            </div>
            <span>&copy; 2026 Anchor</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
