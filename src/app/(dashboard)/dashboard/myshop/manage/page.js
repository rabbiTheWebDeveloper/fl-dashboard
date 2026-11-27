import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  FileText,
  Globe,
  Image as ImageIcon,
  Link2,
  MessageCircle,
  MessageSquare,
  Package,
  Settings,
  Sliders,
  Sparkles,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const shopSections = [
  {
    id: 1,
    title: "Shop Settings",
    description:
      "Configure store logo, contact details, address, and storefront metadata.",
    icon: Settings,
    gradient: "from-violet-600 to-indigo-600",
    badge: "Core",
    href: "/dashboard/myshop/manage/shop-settings",
  },
  {
    id: 2,
    title: "Shop Domain",
    description:
      "Connect and verify your custom domain for a branded shopping experience.",
    icon: Globe,
    gradient: "from-cyan-500 to-blue-600",
    badge: "Domain",
    href: "/dashboard/myshop/manage/domain",
  },
  {
    id: 3,
    title: "Delivery Charges",
    description:
      "Set Inside Dhaka, Subarea, and Outside Dhaka shipping rates.",
    icon: Truck,
    gradient: "from-emerald-500 to-teal-600",
    badge: "Shipping",
    href: "/dashboard/myshop/manage/delivery",
  },
  {
    id: 4,
    title: "Courier Setup",
    description:
      "Integrate Steadfast, Pathao, and RedX APIs for one-click parcel booking.",
    icon: Package,
    gradient: "from-amber-500 to-orange-500",
    badge: "Logistics",
    href: "/dashboard/myshop/manage/courier",
  },
  {
    id: 5,
    title: "Slider Management",
    description:
      "Upload hero sliders to highlight seasonal campaigns and top deals.",
    icon: Sliders,
    gradient: "from-fuchsia-500 to-purple-600",
    badge: "Visuals",
    href: "/dashboard/myshop/manage/slider",
  },
  {
    id: 6,
    title: "Banner Management",
    description:
      "Manage promotional storefront banners for collections and flash sales.",
    icon: ImageIcon,
    gradient: "from-rose-500 to-pink-600",
    badge: "Visuals",
    href: "/dashboard/myshop/manage/banner",
  },
  {
    id: 7,
    title: "SEO & Pixels",
    description:
      "Configure Facebook Pixel, TikTok Pixel, and Google Analytics tracking.",
    icon: BarChart3,
    gradient: "from-indigo-500 to-sky-500",
    badge: "Growth",
    href: "/dashboard/myshop/manage/seo-marketing",
  },
  {
    id: 8,
    title: "Social Links",
    description:
      "Connect your Facebook, Instagram, YouTube, and WhatsApp profiles.",
    icon: Link2,
    gradient: "from-pink-500 to-rose-500",
    badge: "Social",
    href: "/dashboard/myshop/manage/social-links",
  },
  {
    id: 9,
    title: "Payment Gateway",
    description:
      "Enable bKash, Nagad, SSLCommerz, and online checkout options.",
    icon: CreditCard,
    gradient: "from-teal-500 to-emerald-600",
    badge: "Soon",
    href: "/dashboard/myshop/manage/payment",
  },
  {
    id: 10,
    title: "SMS Automation",
    description:
      "Send automated order confirmation and delivery alerts via SMS.",
    icon: MessageSquare,
    gradient: "from-purple-500 to-violet-600",
    badge: "Soon",
    href: "/dashboard/myshop/manage/sms-support",
  },
  {
    id: 11,
    title: "Live Chat Support",
    description:
      "Embed Messenger & WhatsApp chat widgets directly on your storefront.",
    icon: MessageCircle,
    gradient: "from-sky-500 to-cyan-600",
    badge: "Soon",
    href: "/dashboard/myshop/manage/chat-support",
  },
  {
    id: 12,
    title: "Store Policies",
    description:
      "Publish Return, Refund, and Privacy policies to boost buyer trust.",
    icon: FileText,
    gradient: "from-orange-500 to-amber-500",
    badge: "Soon",
    href: "/dashboard/myshop/manage/policy",
  },
];

export default function ManageShopPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <Card className="rgb-card border-slate-200/80 bg-white/95 py-6">
        <CardContent className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge className="bg-violet-500/10 text-violet-700 border-violet-200 mb-2">
              <Sparkles className="w-3 h-3 mr-1" />
              Store Control Center
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Manage Your <span className="rgb-gradient-text">Online Shop</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Configure domains, couriers, marketing pixels, sliders, and
              storefront branding from one unified hub.
            </p>
          </div>
          <Button asChild variant="gradient">
            <Link href="/dashboard/myshop/theme">
              Customize Theme
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {shopSections.map((section) => {
          const Icon = section.icon;
          const isSoon = section.badge === "Soon";
          return (
            <Link key={section.id} href={section.href} className="group block">
              <Card className="h-full border-slate-200/80 bg-white/95 hover:border-violet-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        isSoon
                          ? "bg-amber-500/10 text-amber-700 border-amber-200 text-[10px]"
                          : "bg-slate-100 text-slate-600 border-slate-200 text-[10px]"
                      }
                    >
                      {section.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 pt-3 group-hover:text-violet-700 transition-colors">
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 group-hover:translate-x-0.5 transition-transform">
                    Configure <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
