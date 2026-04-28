"use client";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahim Ahmed",
    handle: "@rahim_fashion",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "AMARDokan completely transformed my e-commerce business. The bulk invoice printing alone saves me 3 hours every single day. ROI was immediate!",
    stars: 5,
    business: "Fashion Store Owner",
    highlight: true,
  },
  {
    name: "Afrin Sultana",
    handle: "@afrin_boutique",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "The fake order prevention feature has saved me thousands of taka in wasted ad spend. This tool pays for itself over and over again.",
    stars: 5,
    business: "Boutique Owner",
    highlight: false,
  },
  {
    name: "Rifat Hossain",
    handle: "@rifat_electronics",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    text: "I can now track every return parcel, monitor my team performance, and see exactly which products make profit. Game changer for my business.",
    stars: 5,
    business: "Electronics Retailer",
    highlight: false,
  },
  {
    name: "Sumon Khan",
    handle: "@sumon_grocery",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    text: "Finally a complete solution built for Bangladesh. The Pathao and Redx integration works flawlessly. Customer support is top-notch.",
    stars: 5,
    business: "Grocery Business",
    highlight: false,
  },
  {
    name: "Nadia Rahman",
    handle: "@nadia_cosmetics",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    text: "Stock management used to be my biggest headache. Now I get automatic alerts when products run low. Never miss a sale anymore!",
    stars: 5,
    business: "Cosmetics Brand",
    highlight: false,
  },
  {
    name: "Kamal Uddin",
    handle: "@kamal_clothing",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
    text: "The profit reports are incredibly detailed. I now know exactly where every taka goes. Scaled from 50 to 500 orders/day in 3 months!",
    stars: 5,
    business: "Clothing Distributor",
    highlight: false,
  },
];

const StarRating = ({ count }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
);

export const TestimonialsSection = () => {
  return (
    <section id="reviews" className="relative py-32 bg-[#080514] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
      <div className="absolute top-1/3 left-0 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-yellow-400 tracking-wide">Customer Reviews</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Loved by 2,000+{" "}
            <span
              className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Businesses
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Real businesses, real results. See what Bangladesh&apos;s top e-commerce entrepreneurs say about AMARDokan.
          </p>

          {/* Rating summary */}
          <div className="inline-flex items-center gap-3 mt-8 px-6 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="text-2xl font-black text-white">4.9</span>
            <span className="text-slate-400 text-sm">from 2,000+ reviews</span>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`relative group rounded-2xl p-7 border transition-all duration-300 hover:scale-[1.02] ${
                testimonial.highlight
                  ? "bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border-yellow-500/30"
                  : "bg-white/[0.03] border-white/8 hover:bg-white/[0.05] hover:border-white/15"
              }`}
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-6 h-6 text-white/5 fill-current" />

              <div className="relative z-10">
                <StarRating count={testimonial.stars} />

                <p className="text-slate-300 text-sm leading-relaxed mt-5 mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.business}</p>
                    <p className="text-xs text-violet-400/70 mt-0.5">{testimonial.handle}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
