import { Button } from '@/components/ui/button';
import { Play, Zap, Users, Package, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: '1000+', label: 'Users' },
  { icon: Package, value: '5M+', label: 'Orders' },
  { icon: TrendingUp, value: '98%', label: 'Success' },
];

export const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 -left-40 w-96 h-96 blob-purple rounded-full blur-3xl opacity-60" />
      <div className="absolute top-40 -right-40 w-80 h-80 blob-teal rounded-full blur-3xl opacity-50" />

      <div className="container relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              #1 E-commerce Solution in Bangladesh
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Your E-commerce Business
            <br />
            <span className="gradient-text">Bulk Invoice Print</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Order management, stock tracking, courier integration, and business reporting — all automated in one platform
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button variant="hero" size="lg">
            Schedule a Demo
            <Zap className="w-4 h-4" />
          </Button>
          <Button variant="heroOutline" size="lg">
            <Play className="w-4 h-4" />
            Watch Demo
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-12">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            5-minute setup
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            2000+ Businesses
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-8 md:gap-12 px-8 py-6 bg-card rounded-2xl shadow-xl border border-border">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="w-5 h-5 text-primary" />
                  <span className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
