"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How long does setup take?",
    a: "Setup takes less than 5 minutes. Simply connect your e-commerce platform, configure your courier services, and you're ready to go. No technical knowledge required — our onboarding wizard walks you through everything step by step.",
  },
  {
    q: "Which platforms do you integrate with?",
    a: "We integrate with all major platforms including Daraz, Shopify, WooCommerce, and custom websites through our API. For couriers, we support Pathao, Redx, eCourier, Sundarban, SSLCOMMERZ, and more.",
  },
  {
    q: "Is there a free trial available?",
    a: "Yes! We offer a 14-day free trial for our Pro plan with no credit card required. You can also use our Starter plan for free forever with up to 100 orders/month included.",
  },
  {
    q: "Do you offer training and support?",
    a: "Absolutely! We provide comprehensive onboarding via video tutorials, live chat, and 24/7 WhatsApp support. Enterprise customers receive dedicated account managers and on-site training sessions.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription at any time with no questions asked. We also offer a 7-day money-back guarantee for all paid plans. Your data remains accessible for 30 days after cancellation.",
  },
  {
    q: "How does fake order prevention work?",
    a: "Our AI-powered system uses multiple signals: phone number verification via OTP, device fingerprinting, order pattern analysis, and blacklist matching against known fraudulent numbers. This blocks up to 95% of fake orders automatically.",
  },
  {
    q: "Is my business data secure?",
    a: "We use bank-grade AES-256 encryption for all data at rest and TLS 1.3 in transit. Our servers are hosted on AWS with 99.9% uptime SLA. We are fully compliant with Bangladesh data protection regulations.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="relative py-32 bg-[#080514] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-sm font-semibold text-violet-400 tracking-wide">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Got Questions?{" "}
            <span
              className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              We&apos;ve Got Answers.
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            Everything you need to know about AMARDokan.
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index
                  ? "bg-white/[0.06] border-violet-500/30"
                  : "bg-white/[0.03] border-white/8 hover:border-white/15"
              }`}
            >
              <button
                className="flex items-center justify-between w-full text-left px-7 py-5 gap-4"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className={`font-semibold text-base transition-colors ${openIndex === index ? "text-white" : "text-slate-300"}`}>
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIndex === index ? "bg-violet-500/20 rotate-180" : "bg-white/5"
                }`}>
                  <ChevronDown className={`w-4 h-4 transition-colors ${openIndex === index ? "text-violet-400" : "text-slate-400"}`} />
                </div>
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-slate-400 text-sm leading-relaxed px-7 pb-6">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-6 rounded-2xl bg-white/5 border border-white/8">
            <div className="text-left">
              <p className="font-semibold text-white">Still have questions?</p>
              <p className="text-sm text-slate-400">Our team is always ready to help you</p>
            </div>
            <a
              href="https://wa.me/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-500 transition-colors whitespace-nowrap"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
