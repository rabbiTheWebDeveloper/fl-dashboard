"use client";
import { CTASection } from "./CTASection";
import { FAQSection } from "./FAQSection";
import { FeaturesSection } from "./FeaturesSection";
import { FloatingChat } from "./FloatingChat";
import { Footer } from "./Footer";
import { HeroSection } from "./HeroSection";
import { Navbar } from "./Navbar";
import { PricingSection } from "./PricingSection";
import { ProblemsSection } from "./ProblemsSection";
import { TestimonialsSection } from "./TestimonialsSection";

/**
 * Landing page composition.
 * Each section is a <section> or <article> with a proper id for deep linking
 * (matching the href="#..." values in the Navbar).
 * The <Navbar> lives inside <header>, the marketing sections form the page body,
 * and <Footer> is a <footer> landmark — all semantic at the component level.
 */
const Theme = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#080514",
        color: "#fff",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Primary navigation landmark */}
      <Navbar />

      {/* Hero — h1 lives inside HeroSection */}
      <HeroSection />

      {/* Supporting sections — each carries its own h2 */}
      <ProblemsSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />

      {/* Site-wide footer landmark */}
      <Footer />

      {/* Floating accessibility-friendly chat widget */}
      <FloatingChat />
    </div>
  );
};

export default Theme;
