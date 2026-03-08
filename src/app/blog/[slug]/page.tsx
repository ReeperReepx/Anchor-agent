import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug } from "../articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | Anchor`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "Anchor",
    },
    publisher: {
      "@type": "Organization",
      name: "Anchor",
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex items-center justify-between px-10 py-5 max-w-[1100px] mx-auto border-b border-[#E5E5E5]">
        <Link href="/" className="text-[22px] font-bold text-[#0071E3]">
          Anchor
        </Link>
        <div className="flex items-center gap-5 text-sm text-[#86868B]">
          <Link
            href="/blog"
            className="hover:text-[#1D1D1F] transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/login"
            className="bg-[#0071E3] hover:bg-[#0077ED] text-white px-4 py-2 rounded-[10px] text-sm font-semibold transition-all"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      <article className="max-w-[700px] mx-auto px-6 py-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-semibold text-[#0071E3] uppercase tracking-[1px]">
              {article.category}
            </span>
            <span className="text-[12px] text-[#9CA3AF]">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-[12px] text-[#9CA3AF]">
              {article.readTime}
            </span>
          </div>
          <h1 className="text-[36px] font-bold tracking-[-0.02em] text-[#1D1D1F] leading-[1.2] mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-[#86868B] leading-relaxed">
            {article.description}
          </p>
        </div>

        <div
          className="prose-anchor"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-16 pt-8 border-t border-[#E5E5E5]">
          <div className="bg-white rounded-[14px] border border-[#E5E5E5] p-8 text-center">
            <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">
              Ready to start your streak?
            </h3>
            <p className="text-sm text-[#86868B] mb-5">
              Anchor is a voice-first daily standup for solopreneurs. Start your 7-day free trial.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-[#0071E3] hover:bg-[#0077ED] text-white px-6 py-3 rounded-[10px] text-sm font-semibold transition-all shadow-[0_2px_12px_rgba(255,149,0,0.3)]"
            >
              Start Free Trial
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/blog"
            className="text-sm text-[#0071E3] hover:text-[#0077ED] transition-colors"
          >
            &larr; Back to all articles
          </Link>
        </div>
      </article>

      <footer className="px-10 py-6 border-t border-[#E5E5E5] text-center text-xs text-[#9CA3AF]">
        2026 Anchor. All rights reserved.
      </footer>
    </div>
  );
}
