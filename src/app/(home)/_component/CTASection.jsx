import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-20 gradient-cta relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      <div className="container relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Start your e-commerce journey today!
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
          Get a free demo and see how Ecomdrive can transform your business
        </p>
        <Button
          variant="heroOutline"
          size="xl"
          className="bg-card text-foreground border-0 hover:bg-card/90"
        >
          Schedule a Demo
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </section>
  );
};
