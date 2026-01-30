import { Button } from './ui/button';
import { 
  FileText, 
  ShieldCheck, 
  PackageSearch, 
  Zap, 
  BarChart2, 
  Users,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Incomplete Order Tracking',
    description: 'Keep customers on order forms to complete purchases every time quickly.',
    color: 'teal',
  },
  {
    icon: ShieldCheck,
    title: 'Fake Order Prevention',
    description: 'Block duplicate orders, Checkout OTP, and return customer identification.',
    color: 'purple',
  },
  {
    icon: PackageSearch,
    title: 'Return Order Tracking',
    description: 'Keep track of whether courier companies are returning all parcels properly.',
    color: 'blue',
  },
  {
    icon: Zap,
    title: 'Do More in Less Time',
    description: 'Save massive amounts of time by automating your e-commerce tasks.',
    color: 'orange',
  },
  {
    icon: BarChart2,
    title: 'Detailed Reporting',
    description: 'Get comprehensive reports on sales, profits, and business performance.',
    color: 'pink',
  },
  {
    icon: Users,
    title: 'Employee Performance',
    description: 'Track and measure your team\'s productivity and performance metrics.',
    color: 'green',
  },
];

const colorClasses = {
  purple: 'icon-box-purple',
  orange: 'icon-box-orange',
  teal: 'icon-box-teal',
  pink: 'icon-box-pink',
  blue: 'icon-box-blue',
  green: 'icon-box-green',
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blob-purple rounded-full blur-3xl opacity-30" />

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            All features and
            <br />
            <span className="gradient-text">automation in one platform</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            All the tools you need to manage your e-commerce business
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 bg-card rounded-2xl border border-border hover-lift cursor-pointer"
            >
              <div className={`icon-box ${colorClasses[feature.color]} mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg">
            See All Features
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
