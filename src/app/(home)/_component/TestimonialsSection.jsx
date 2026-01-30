import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahim',
    handle: '@rahim_fashion',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content: 'EcomDrive has completely changed the way I run my e-commerce business. The automation saves me hours every day!',
    rating: 5,
  },
  {
    name: 'Afrin',
    handle: '@afrin_fashion',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    content: 'The fake order prevention feature alone has saved me thousands. Best investment for my business!',
    rating: 5,
  },
  {
    name: 'Rifat',
    handle: '@rifat_bd',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content: 'EcomDrive is a game changer! I can now follow up with customers and recover lost sales efficiently.',
    rating: 5,
  },
  {
    name: 'Sumon',
    handle: '@sumon_store',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    content: 'Finally found a complete solution for my business. The reporting features are incredibly detailed.',
    rating: 5,
  },
  {
    name: 'Maria',
    handle: '@maria_boutique',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    content: 'EcomDrive helped me track every incomplete order. My conversion rate has increased by 40%!',
    rating: 5,
  },
  {
    name: 'Rahat',
    handle: '@rahat123',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop&crop=face',
    content: 'The team management feature is exactly what I needed. Now I know who is performing well.',
    rating: 5,
  },
  {
    name: 'Tamanna',
    handle: '@tamanna_store',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    content: 'Best e-commerce management tool in Bangladesh. The support team is also very responsive!',
    rating: 4,
  },
  {
    name: 'Jakir',
    handle: '@jakir_electronics',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    content: 'Stock management was my biggest headache. EcomDrive solved it completely. Highly recommended!',
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section id="reviews" className="py-20 bg-card overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Customer Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What our clients
            <br />
            <span className="gradient-text">are saying?</span>
          </h2>
          <p className="text-muted-foreground">
            1000+ satisfied business owners use Ecomdrive
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.handle}
              className="p-5 bg-background rounded-2xl border border-border hover-lift"
            >
              {/* Rating */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-foreground mb-4 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.handle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
