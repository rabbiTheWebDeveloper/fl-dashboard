"use client";
import { CTASection } from "./CTASection";
import { FeaturesSection } from "./FeaturesSection";
import { FloatingChat } from "./FloatingChat";
import { Footer } from "./Footer";
import { HeroSection } from "./HeroSection";
import { Navbar } from "./Navbar";
import { ProblemsSection } from "./ProblemsSection";
import { TestimonialsSection } from "./TestimonialsSection";


const Theme = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Theme;
