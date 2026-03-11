"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Pricing } from "@/components/landing/pricing";

/* ─── Hero visual: two founder cards being matched ─── */

function HeroMatchVisual() {
  return (
    <div className="relative w-full h-[420px] sm:h-[460px] flex items-center justify-center">
      {/* Connection line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-[2px] bg-gradient-to-r from-[#0071E3] to-[#34C759] opacity-60" />

      {/* Founder card 1 */}
      <div className="absolute top-[15%] left-[5%] sm:left-[8%] w-[200px] sm:w-[220px] hero-bubble" style={{ animationDelay: "0.1s" }}>
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#e5e5e5]/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#0071E3]/10 flex items-center justify-center text-[#0071E3] text-[15px] font-bold">A</div>
            <div>
              <div className="text-[14px] font-semibold text-[#1d1d1f]">Alex</div>
              <div className="text-[11px] text-[#86868b]">SaaS founder</div>
            </div>
          </div>
          <div className="text-[12px] text-[#6e6e73] leading-relaxed">Building a scheduling tool for freelancers. Just hit 100 users.</div>
        </div>
      </div>

      {/* Founder card 2 */}
      <div className="absolute bottom-[15%] right-[5%] sm:right-[8%] w-[200px] sm:w-[220px] hero-bubble" style={{ animationDelay: "0.5s" }}>
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-[#e5e5e5]/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#5B5FC7]/10 flex items-center justify-center text-[#5B5FC7] text-[15px] font-bold">M</div>
            <div>
              <div className="text-[14px] font-semibold text-[#1d1d1f]">Maya</div>
              <div className="text-[11px] text-[#86868b]">SaaS founder</div>
            </div>
          </div>
          <div className="text-[12px] text-[#6e6e73] leading-relaxed">Launched beta for an invoicing app. Focused on getting to $1k MRR.</div>
        </div>
      </div>

      {/* Match badge in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hero-bubble" style={{ animationDelay: "0.9s" }}>
        <div className="bg-[#0071E3] text-white rounded-full px-5 py-2.5 shadow-lg flex items-center gap-2 text-[13px] font-semibold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Matched for this week
        </div>
      </div>

      {/* Calendar invite preview */}
      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 hero-bubble" style={{ animationDelay: "1.3s" }}>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-[#e5e5e5]/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#34C759]/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-[12px] font-semibold text-[#1d1d1f]">Weekly Founder Call</div>
            <div className="text-[11px] text-[#86868b]">Wednesday, 30 min</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Ticker ─── */

const TICKER_ITEMS = [
  "Weekly Matching",
  "Real Conversations",
  "Goal-Aligned Pairs",
  "Fresh Perspectives",
  "No Scheduling Hassle",
  "15-30 Min Calls",
  "Founder Community",
  "New Match Every Monday",
  "Accountability That Works",
  "No AI, Just Humans",
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

/* ─── How it works ─── */

function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 sm:px-10 py-16 sm:py-24 bg-[#000000]">
      <ScrollReveal>
        <div className="text-center mb-8 sm:mb-10 max-w-[1080px] mx-auto">
          <h2 className="text-[28px] sm:text-[36px] font-bold tracking-[-0.035em] text-[#f5f5f7]">
            How it works
          </h2>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="bg-white rounded-2xl border border-[#e5e5e5] overflow-hidden max-w-[720px] mx-auto shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e5e5e5] bg-[#fafafa]">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            <span className="text-[12px] text-[#86868b] ml-3 font-medium">Anchor | Weekly Matching</span>
          </div>

          <div className="p-5 sm:p-8 space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#0071E3] text-white text-[13px] font-bold flex items-center justify-center shrink-0">1</div>
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">Sign up and tell us what you&apos;re building</div>
                <div className="text-[13px] text-[#86868b] mt-0.5">Takes 30 seconds. Pick your goals and timezone.</div>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#0071E3] text-white text-[13px] font-bold flex items-center justify-center shrink-0">2</div>
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">Get matched with a founder every Monday</div>
                <div className="text-[13px] text-[#86868b] mt-0.5">Randomly paired with someone building in a similar space. Fresh match every week.</div>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#0071E3] text-white text-[13px] font-bold flex items-center justify-center shrink-0">3</div>
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">Hop on a 15-30 min call</div>
                <div className="text-[13px] text-[#86868b] mt-0.5">Schedule it at a time that works for both of you. Share wins, blockers, and keep each other honest.</div>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-[#34C759] text-white text-[13px] font-bold flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[#1d1d1f]">Repeat every week</div>
                <div className="text-[13px] text-[#86868b] mt-0.5">New founder, new perspective, every single Monday.</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/login?product=matching"
            className="inline-flex items-center justify-center bg-[#0071E3] hover:bg-[#0077ED] text-white px-8 py-3 rounded-full text-[14px] font-semibold transition-colors min-h-[48px]"
          >
            Get matched this week
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ─── Outcomes ─── */

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
              Someone else is
              <br />
              in the trenches.
              <br />
              <span className="text-[#86868b]">That changes everything.</span>
            </h2>
            <p className="text-[#86868b] text-base sm:text-lg mt-4 max-w-[420px] leading-relaxed">
              When you talk to another founder every week, you stop spinning your wheels. You get perspective, accountability, and the energy that comes from knowing you&apos;re not alone.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="bg-[#f5f5f7] rounded-2xl p-6 sm:p-8 max-w-[360px] mx-auto md:ml-auto md:mr-0">
            <div className="flex items-center justify-between mb-5">
              <div className="text-[15px] font-semibold text-[#1d1d1f]">This week&apos;s match</div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                <span className="text-[12px] text-[#86868b]">Call scheduled</span>
              </div>
            </div>

            {/* Your card */}
            <div className="bg-white rounded-xl p-4 border border-[#e5e5e5]/80 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#0071E3] flex items-center justify-center text-[10px] font-bold text-white">Y</div>
                <span className="text-[12px] font-semibold text-[#1d1d1f]">You</span>
              </div>
              <p className="text-[12px] text-[#6e6e73] leading-relaxed">Shipped the payment flow, onboarding 5 beta users this week.</p>
            </div>

            {/* Match card */}
            <div className="bg-white rounded-xl p-4 border border-[#e5e5e5]/80">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[#5B5FC7] flex items-center justify-center text-[10px] font-bold text-white">J</div>
                <span className="text-[12px] font-semibold text-[#1d1d1f]">Jordan</span>
                <span className="text-[10px] text-[#86868b] ml-auto">SaaS founder</span>
              </div>
              <p className="text-[12px] text-[#6e6e73] leading-relaxed">Launched to Product Hunt, working on retention. Wants to hit $2k MRR by April.</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#e5e5e5] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0071E3" strokeWidth="2">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[11px] text-[#86868b]">Wed 3pm ET</span>
              </div>
              <span className="text-[10px] text-[#86868b]">New match Monday</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Why Anchor ─── */

const VALUE_PROPS = [
  {
    heading: "Matched by what you're building",
    body: "Paired with founders in similar spaces: SaaS, freelance, e-commerce, side projects. Someone who actually gets what you're doing.",
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
    heading: "One call, zero prep",
    body: "No agenda required. Just show up, talk about what you're working on, and get the energy boost of talking to someone who's in it too.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    heading: "New founder every week",
    body: "Fresh perspective every Monday. See how other builders work, pick up ideas, and stay motivated by people who are actually shipping.",
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
              You don&apos;t need a co-founder. You need someone who shows up every week and asks &ldquo;what did you ship?&rdquo;
            </p>
            <div className="mt-8">
              <Link
                href="/login?product=matching"
                className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white px-7 py-3 rounded-full text-[14px] font-semibold transition-colors w-full sm:w-auto min-h-[48px]"
              >
                Get matched with a founder
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

/* ─── FAQ ─── */

const FAQ_ITEMS = [
  {
    q: "How does matching work?",
    a: "Every Monday, you get matched with a random founder who's building something in a similar space. You see their name, what they're building, and their email. Then you schedule a call that week.",
  },
  {
    q: "What do we talk about on the call?",
    a: "Whatever's useful. Most people share what they shipped, what's blocking them, and set a commitment for next week. No agenda required — just show up and be real.",
  },
  {
    q: "What if my match doesn't show up?",
    a: "It happens. If your match goes inactive, you'll get a new one the following Monday. We're building a community of people who actually show up.",
  },
  {
    q: "How long is the call?",
    a: "15-30 minutes is the sweet spot. Short enough to not be a burden, long enough to actually help. You and your match decide the exact time.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — 7 days free, no credit card required. Try it for a week and see if having a weekly founder call changes how you work.",
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
            <Link href="/login?product=matching" className="text-[#0071E3] hover:text-[#0077ED] transition-colors py-2 px-1">
              Log in
            </Link>
            <Link href="/login?product=matching">
              <Button
                size="sm"
                className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full px-5 text-[13px] border-none shadow-none"
              >
                Get matched
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
              <span className="text-[12px] text-[#86868b] font-medium">New matches every Monday</span>
            </div>
            <h1 className="text-[36px] sm:text-[52px] md:text-[60px] font-bold tracking-[-0.04em] leading-[1.06] text-[#1d1d1f]">
              Meet a new
              <br />
              founder{" "}
              <br className="hidden sm:block" />
              <span className="text-[#86868b]">every week.</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-[#86868b] max-w-[400px] leading-relaxed">
              Get randomly matched with another builder for a weekly call. No AI, no apps — just a real conversation with someone who gets it.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Link href="/login?product=matching">
                <Button
                  size="lg"
                  className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-8 py-4 text-base rounded-full shadow-none border-none w-full sm:w-auto min-h-[48px]"
                >
                  Get matched free
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
            <HeroMatchVisual />
          </div>
        </div>
      </section>

      <StatsBar />
      <HowItWorks />
      <OutcomeCards />
      <WhyAnchor />
      <Pricing loginHref="/login?product=matching" />
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
