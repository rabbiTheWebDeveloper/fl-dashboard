import { buildMetadata } from "@/lib/seo";
import React from "react";

export const metadata = buildMetadata({
  title: "শপ মার্কেটপ্লেস — শীঘ্রই আসছে",
  description:
    "AMARDokan শপ মার্কেটপ্লেস শীঘ্রই আসছে। নোটিফিকেশন পেতে আপনার ইমেইল দিন।",
  path: "/shop",
  noIndex: true, // not ready for indexing
});

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Animated Logo/Icon */}
        <div className="mb-8" aria-hidden="true">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-pulse">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Coming <span className="text-blue-600">Soon</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
          Something amazing is on the way. We&apos;re working hard to bring you
          an incredible experience.
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-8" aria-label="Development progress">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span aria-label="75 percent complete">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: "75%" }}
            />
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/20 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Get Notified When We Launch
          </h2>
          <form className="flex flex-col sm:flex-row gap-3" aria-label="Launch notification signup">
            <label htmlFor="notify-email" className="sr-only">
              Email address
            </label>
            <input
              id="notify-email"
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              autoComplete="email"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md"
            >
              Notify Me
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-3">
            We&apos;ll send you one email when we&apos;re ready. No spam.
          </p>
        </div>

        {/* Social Links */}
        <div className="mt-12">
          <p className="text-gray-600 mb-6">Follow us for updates</p>
          <nav className="flex justify-center space-x-6" aria-label="Social media links">
            {[
              { name: "Twitter", icon: "🐦", url: "#" },
              { name: "Facebook", icon: "📘", url: "#" },
              { name: "Instagram", icon: "📷", url: "#" },
              { name: "LinkedIn", icon: "💼", url: "#" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                aria-label={`Follow us on ${social.name}`}
                className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20 hover:shadow-md hover:scale-110 transition-all duration-300 text-lg"
              >
                <span aria-hidden="true">{social.icon}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-300/30">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} AMARDokan. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Decorative elements — hidden from AT */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-bounce" aria-hidden="true" />
      <div className="absolute top-20 right-20 w-6 h-6 bg-purple-400 rounded-full opacity-30 animate-pulse" aria-hidden="true" />
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-indigo-400 rounded-full opacity-25 animate-bounce delay-75" aria-hidden="true" />
      <div className="absolute bottom-10 right-10 w-5 h-5 bg-blue-300 rounded-full opacity-20 animate-pulse delay-150" aria-hidden="true" />
    </div>
  );
};

export default ComingSoon;