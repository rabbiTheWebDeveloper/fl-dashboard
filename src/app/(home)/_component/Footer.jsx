"use client";
import { Facebook, Youtube, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
  Company: ["About Us", "Blog", "Careers", "Press Kit", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  Support: ["Documentation", "WhatsApp Support", "Video Tutorials", "Community", "Status Page"],
};

const socials = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
  { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
  { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
];

export const Footer = () => {
  return (
    <footer className="relative bg-[#050310] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <span className="text-white font-black text-lg">আ</span>
              </div>
              <div>
                <span className="text-xl font-black text-white">AMAR<span className="text-violet-400">Dokan</span></span>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">E-commerce OS</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
              Bangladesh&apos;s most complete e-commerce management platform. Automate your business, scale your profits, and reclaim your time.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>hello@amardokan.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center transition-all duration-200 ${social.color} hover:border-transparent hover:scale-110`}
                >
                  <social.icon className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-white text-sm mb-5 tracking-wide">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-8 mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-slate-400 text-sm">Get product updates, tips, and industry news delivered to your inbox.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
              />
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all whitespace-nowrap shadow-lg shadow-violet-500/20 flex-shrink-0">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-slate-500 text-sm">
            © 2025 AMARDokan. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            Made with ❤️ for Bangladesh&apos;s e-commerce ecosystem
          </p>
        </div>
      </div>
    </footer>
  );
};
