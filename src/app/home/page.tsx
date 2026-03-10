"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Pricing } from "@/components/landing/pricing";

/* ─── Hero transcript bubbles (shared standup angle) ─── */

const BUBBLES = [
  {
    role: "ai" as const,
    text: "What did you ship yesterday?",
    className: "top-[2%] right-[0%] md:rotate-[2deg]",
  },
  {
    role: "user" as const,
    text: "Launched the waitlist page and set up analytics.",
    className: "top-[18%] right-[0%] md:right-[5%] md:-rotate-[1deg]",
  },
  {
    role: "ai" as const,
    text: "What's on deck for today?",
    className: "top-[36%] left-[0%] md:rotate-[1.5deg]",
  },
  {
    role: "user" as const,
    text: "Building the invite flow. Want 50 signups by Friday.",
    className: "top-[52%] right-[0%] md:right-[2%] md:-rotate-[2deg]",
  },
  {
    role: "ai" as const,
    text: "Your partner Maya shipped 3 features this week. Ready to keep up?",
    className: "top-[68%] left-[0%] md:left-[5%] md:rotate-[1deg]",
  },
  {
    role: "user" as const,
    text: "Oh, it's on.",
    className: "top-[80%] right-[0%] md:-rotate-[1.5deg]",
  },
];

const WAVE_BARS = [4, 7, 10, 13, 15, 17, 18, 19, 20, 19, 18, 17, 15, 13, 10, 7, 4];
const WAVE_OPACITIES = [30, 40, 50, 55, 65, 70, 75, 78, 80, 78, 75, 70, 65, 55, 50, 40, 30];

function HeroTranscript() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= BUBBLES.length) return;
    const timer = setTimeout(() => setVisible((v) => v + 1), 700);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div className="relative w-full h-[420px] sm:h-[460px]">
      {BUBBLES.slice(0, visible).map((bubble, i) => (
        <div
          key={i}
          className={`absolute max-w-[280px] sm:max-w-[300px] ${bubble.className} hero-bubble`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div
            className={`px-4 py-2.5 text-[13px] sm:text-[14px] leading-relaxed rounded-2xl shadow-lg backdrop-blur-sm ${
              bubble.role === "user"
                ? "bg-[#0071E3] text-white shadow-[#0071E3]/20"
                : "bg-white text-[#1d1d1f] shadow-black/8 border border-[#e5e5e5]/60"
            }`}
          >
            {bubble.role === "ai" && (
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded-full bg-[#0071E3] flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-[#86868b] uppercase tracking-wider">Anchor AI</span>
              </div>
            )}
            {bubble.text}
          </div>
        </div>
      ))}

      {visible < BUBBLES.length && visible > 0 && (
        <div className={`absolute ${BUBBLES[visible].className} hero-bubble`}>
          <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-[#e5e5e5]/60 flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#86868b] animate-bounce" style={{ animationDelay: "0s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#86868b] animate-bounce" style={{ animationDelay: "0.15s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#86868b] animate-bounce" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-lg border border-[#e5e5e5]/60 hero-bubble" style={{ animationDelay: "0.2s" }}>
        <div className="w-8 h-8 rounded-full bg-[#0071E3] flex items-center justify-center shrink-0 animate-pulse">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          </svg>
        </div>
        <div className="flex items-center gap-[3px]">
          {WAVE_BARS.map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-[#0071E3] shrink-0"
              style={{
                height: `${h}px`,
                opacity: WAVE_OPACITIES[i] / 100,
                animation: "wave 1.8s ease-in-out infinite",
                animationDelay: `${i * 0.07}s`,
              }}
            />
          ))}
        </div>
        <span className="text-[12px] text-[#86868b] font-medium tabular-nums shrink-0">4:32</span>
      </div>
    </div>
  );
}

/* ─── Ticker ─── */

const TICKER_ITEMS = [
  "Accountability Partner",
  "Weekly Partner Matching",
  "Shared Standups",
  "Voice-First",
  "AI Summaries",
  "No Calls Required",
  "Async by Design",
  "Streak Tracking",
  "Founder Community",
  "Zero Typing",
];

function StatsBar() {
  return (
    <section className="py-4 sm:py-5 border-y border-[#e5e5e5] overflow-hidden bg-[#fafafa]">
      <div
        className="flex gap-8 sm:gap-12 whitespace-nowrap"
        style={{ animation: "ticker 30s linear infinite", width: "max-content" }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-[13px] sm:text-[14px] text-[#86868b] font-medium">
            <svg className="w-3.5 h-3.5 text-[#0071E3] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─── How it works (shared angle) ─── */

function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 sm:px-10 py-16 sm:py-24 bg-[#000000]">
      <ScrollReveal>
        <div className="text-center mb-8 sm:mb-10 max-w-[1080px] mx-auto">
          <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.035em] text-[#f5f5f7]">
            How shared standups work
          </h2>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden max-w-[720px] mx-auto shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e5e5e5] bg-[#fafafa]">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            <span className="text-[12px] text-[#86868b] ml-3 font-medium">Anchor | Shared Standup</span>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#0071E3] text-white text-[13px] font-bold flex items-center justify-center shrink-0">1</div>
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">You do your standup</div>
                <div className="text-[13px] text-[#86868b] mt-0.5">5 minutes, voice-first. What you shipped, what&apos;s next, any blockers.</div>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#0071E3] text-white text-[13px] font-bold flex items-center justify-center shrink-0">2</div>
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">Your partner does theirs</div>
                <div className="text-[13px] text-[#86868b] mt-0.5">Separately, on their own time. No scheduling, no calls, no awkward silences.</div>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#0071E3] text-white text-[13px] font-bold flex items-center justify-center shrink-0">3</div>
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">You see each other&apos;s summaries</div>
                <div className="text-[13px] text-[#86868b] mt-0.5">Once you both finish, AI summaries are shared. You know someone else is watching.</div>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#34C759] text-white text-[13px] font-bold flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">Partners rotate weekly</div>
                <div className="text-[13px] text-[#86868b] mt-0.5">Fresh perspective every week. Matched by goals so it actually matters.</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-[#0071E3] hover:bg-[#0077ED] text-white px-8 py-3 rounded-full text-[14px] font-semibold transition-colors min-h-[48px]"
          >
            Find your accountability partner
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ─── Outcomes (partner angle) ─── */

function OutcomeCards() {
  return (
    <section className="px-5 sm:px-10 py-16 sm:py-24 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <ScrollReveal>
          <div>
            <p className="text-[#0071E3] text-sm font-semibold mb-3 tracking-wide">
              The difference
            </p>
            <h2 className="text-[32px] sm:text-[44px] font-bold tracking-[-0.035em] text-[#1d1d1f] leading-tight">
              Someone is watching.
              <br />
              <span className="text-[#86868b]">That changes everything.</span>
            </h2>
            <p className="text-[#86868b] text-base sm:text-lg mt-4 max-w-[420px] leading-relaxed">
              When another founder sees your standup, you stop letting things slide. You ship more, skip less, and actually follow through.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="bg-[#f5f5f7] rounded-2xl p-6 sm:p-8 max-w-[360px] mx-auto md:ml-auto md:mr-0">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[15px] font-semibold text-[#1d1d1f]">Partner standup</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                <span className="text-[12px] text-[#86868b]">Both completed</span>
              </div>
            </div>

            {/* Your summary */}
            <div className="bg-white rounded-xl p-4 border border-[#e5e5e5]/80 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#0071E3] flex items-center justify-center text-[10px] font-bold text-white">Y</div>
                <span className="text-[12px] font-semibold text-[#1d1d1f]">You</span>
              </div>
              <p className="text-[12px] text-[#6e6e73] leading-relaxed">Shipped payment flow, fixing edge cases today. No blockers.</p>
            </div>

            {/* Partner summary */}
            <div className="bg-white rounded-xl p-4 border border-[#e5e5e5]/80">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#5B5FC7] flex items-center justify-center text-[10px] font-bold text-white">M</div>
                <span className="text-[12px] font-semibold text-[#1d1d1f]">Maya</span>
                <span className="text-[10px] text-[#86868b] ml-auto">SaaS founder</span>
              </div>
              <p className="text-[12px] text-[#6e6e73] leading-relaxed">Launched beta to 20 users, collecting feedback. Blocked on email deliverability.</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#e5e5e5] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[11px] text-[#86868b]">Week 3 together</span>
              </div>
              <span className="text-[10px] text-[#86868b]">New partner Monday</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Why Anchor (shared angle) ─── */

const VALUE_PROPS = [
  {
    heading: "Accountability without the scheduling",
    body: "No syncing calendars, no video calls. You each standup when it suits you. Summaries are shared automatically.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    heading: "Matched by what you're building",
    body: "Partners are paired by goal type — SaaS, freelance, e-commerce, side projects. Someone who gets what you're doing.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    heading: "Fresh perspective every week",
    body: "Partners rotate weekly. See how other founders work, pick up habits, stay motivated by people who are actually in the trenches.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
  },
];

function WhyAnchor() {
  return (
    <section className="px-5 sm:px-10 py-16 sm:py-24 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-[5vw] items-start">
        <div className="md:col-span-2 md:sticky md:top-24">
          <ScrollReveal>
            <p className="text-[#0071E3] text-sm font-semibold mb-3 tracking-wide">
              Why Anchor
            </p>
            <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.035em] text-[#1d1d1f] leading-tight">
              The co-founder
              <br />
              energy you&apos;re missing.
            </h2>
            <p className="text-[#86868b] text-base mt-3 leading-relaxed max-w-[320px]">
              You don&apos;t need a co-founder. You need someone who notices when you don&apos;t show up.
            </p>
            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white px-7 py-3 rounded-full text-[14px] font-semibold transition-colors w-full sm:w-auto min-h-[48px]"
              >
                Get matched with a partner
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <div className="md:col-span-3 space-y-4">
          {VALUE_PROPS.map((prop, i) => (
            <ScrollReveal key={prop.heading} delay={i * 100}>
              <div className="flex gap-5 items-start rounded-2xl bg-[#f5f5f7] p-6 sm:p-7 hover:bg-[#e8e8ed] transition-colors duration-300">
                <div className="w-11 h-11 rounded-xl bg-white text-[#1d1d1f] flex items-center justify-center shrink-0 shadow-sm">
                  {prop.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#1d1d1f] mb-1">
                    {prop.heading}
                  </h3>
                  <p className="text-[14px] text-[#86868b] leading-relaxed">
                    {prop.body}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ (shared angle) ─── */

const FAQ_ITEMS = [
  {
    q: "How does partner matching work?",
    a: "After onboarding, you're matched with another founder based on what you're building. Partners rotate every week so you get fresh perspectives.",
  },
  {
    q: "Do I have to get on a call with my partner?",
    a: "No. Everything is async. You each do your standup separately with the AI, then you see each other's summaries. No calls, no scheduling.",
  },
  {
    q: "What if my partner doesn't show up?",
    a: "You still get the full value of your own standup. If a partner goes inactive, we'll match you with someone new the following week.",
  },
  {
    q: "Can I do it solo instead?",
    a: "Absolutely. You can switch between solo and shared anytime from your settings.",
  },
  {
    q: "How long does a standup take?",
    a: "5-10 minutes. Three questions, all voice. No typing required.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-5 sm:px-10 py-16 sm:py-24 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-[5vw]">
        <div className="md:col-span-2">
          <ScrollReveal>
            <p className="text-[#0071E3] text-sm font-semibold mb-3 tracking-wide">
              FAQ
            </p>
            <h2 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.035em] text-[#1d1d1f] leading-tight">
              Questions?
              <br />
              Answers.
            </h2>
          </ScrollReveal>
        </div>

        <div className="md:col-span-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <ScrollReveal key={item.q} delay={i * 50}>
                <div className="border-b border-[#d2d2d7]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-4 sm:py-5 text-left group min-h-[48px]"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-[#1d1d1f] text-[15px] sm:text-[16px] pr-4 group-hover:text-[#0071E3] transition-colors">
                      {item.q}
                    </span>
                    <svg
                      className={`w-5 h-5 text-[#86868b] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[14px] text-[#86868b] leading-relaxed pr-10">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ─── */

export default function HomeLandingPage() {
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
            <Link href="/login" className="text-[#0071E3] hover:text-[#0077ED] transition-colors py-2 px-1">
              Log in
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full px-5 text-[13px] border-none shadow-none"
              >
                Try free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-5 sm:px-10 pt-8 sm:pt-16 pb-10 sm:pb-20 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[10vw] items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f5f5f7] rounded-full px-3.5 py-1.5 mb-5 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
              <span className="text-[12px] text-[#86868b] font-medium">New partners matched every Monday</span>
            </div>
            <h1 className="text-[36px] sm:text-[52px] md:text-[60px] font-bold tracking-[-0.04em] leading-[1.06] text-[#1d1d1f]">
              Stop building
              <br />
              alone.{" "}
              <br className="hidden sm:block" />
              <span className="text-[#86868b]">Start shipping together.</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-[#86868b] max-w-[400px] leading-relaxed">
              Get matched with a founder who sees your standup every day. Async accountability that actually works — no calls, no scheduling.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-8 py-4 text-base rounded-full shadow-none border-none w-full sm:w-auto min-h-[48px]"
                >
                  Find your partner
                </Button>
              </Link>
              <a
                href="#how-it-works"
                className="text-[#0071E3] text-[15px] font-semibold hover:underline underline-offset-4 min-h-[48px] flex items-center"
              >
                See how it works &darr;
              </a>
            </div>
          </div>

          <div className="relative">
            <HeroTranscript />
          </div>
        </div>
      </section>

      <StatsBar />
      <HowItWorks />
      <OutcomeCards />
      <WhyAnchor />
      <Pricing />
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
