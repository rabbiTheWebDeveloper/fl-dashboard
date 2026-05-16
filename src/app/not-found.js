import Link from "next/link";
import { siteConfig } from "@/lib/seo";

/**
 * Global not-found page (404).
 * Rendered by Next.js when no route matches.
 * Should NOT be indexed.
 */
export const metadata = {
  title: `পৃষ্ঠা পাওয়া যায়নি | ${siteConfig.name}`,
  description: "আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#080514] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 visuals */}
        <div
          className="text-[120px] sm:text-[160px] font-black leading-none mb-4 select-none"
          aria-hidden="true"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          পৃষ্ঠা পাওয়া যায়নি
        </h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা হয়তো সরানো হয়েছে, নাম পরিবর্তন করা
          হয়েছে, অথবা এটি আর নেই।
        </p>

        <nav
          className="flex flex-col sm:flex-row gap-3 justify-center"
          aria-label="Recovery navigation"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:scale-105 transition-all duration-200 shadow-lg shadow-violet-500/25"
          >
            হোমপেজে ফিরুন
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/25 hover:bg-white/5 font-semibold transition-all duration-200"
          >
            লগইন করুন
          </Link>
        </nav>
      </div>
    </main>
  );
}