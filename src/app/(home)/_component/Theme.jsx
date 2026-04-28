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

const Theme = () => {
  return (
    <div className="min-h-screen" style={{ background: "#080514", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />
      <HeroSection />
      <ProblemsSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Theme;
