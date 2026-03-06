import Link from "next/link";
import type { Metadata } from "next";
import { articles } from "./articles";

export const metadata: Metadata = {
  title: "Blog — Anchor | Daily Standups for Solopreneurs",
  description:
    "Productivity tips, accountability strategies, and founder habits. Learn how daily standups help solopreneurs ship faster and stay consistent.",
  openGraph: {
    title: "Anchor Blog — Accountability & Productivity for Solopreneurs",
    description:
      "Productivity tips, accountability strategies, and founder habits from the Anchor team.",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F1]">
      <nav className="flex items-center justify-between px-10 py-5 max-w-[1100px] mx-auto border-b border-[#E8DDD3]">
        <Link href="/" className="text-[22px] font-bold text-[#C4654A]">
          Anchor
        </Link>
        <div className="flex items-center gap-5 text-sm text-[#8a7e74]">
          <Link href="/" className="hover:text-[#2C2825] transition-colors">
            Home
          </Link>
          <Link
            href="/login"
            className="bg-[#C4654A] hover:bg-[#D4856A] text-white px-4 py-2 rounded-[10px] text-sm font-semibold transition-all"
          >
            Get Early Access
          </Link>
        </div>
      </nav>

      <div className="max-w-[800px] mx-auto px-6 py-16">
        <h1 className="text-[40px] font-bold tracking-[-0.02em] text-[#2C2825] mb-3">
          Blog
        </h1>
        <p className="text-lg text-[#8a7e74] mb-12">
          Accountability strategies, productivity systems, and founder habits
          that actually work.
        </p>

        <div className="space-y-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block group"
            >
              <article className="bg-white rounded-[14px] border border-[#E8DDD3] p-8 transition-all hover:border-[#C4654A]/30 hover:shadow-[0_4px_24px_rgba(196,101,74,0.08)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[11px] font-semibold text-[#C4654A] uppercase tracking-[1px]">
                    {article.category}
                  </span>
                  <span className="text-[12px] text-[#a89a8e]">
                    {article.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-[#2C2825] mb-2 group-hover:text-[#C4654A] transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-sm text-[#8a7e74] leading-relaxed">
                  {article.description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <footer className="px-10 py-6 border-t border-[#E8DDD3] text-center text-xs text-[#a89a8e]">
        2026 Anchor. All rights reserved.
      </footer>
    </div>
  );
}
