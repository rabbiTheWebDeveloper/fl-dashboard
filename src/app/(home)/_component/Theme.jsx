import { HeroSection } from "./HeroSection";
import { Navbar } from "./Navbar";
import { ProblemsSection } from "./ProblemsSection";


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
