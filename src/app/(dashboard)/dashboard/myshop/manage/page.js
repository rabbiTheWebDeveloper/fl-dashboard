import React from "react";
import Link from "next/link";
import {
  Settings,
  Truck,
  MessageSquare,
  Globe,
  CreditCard,
  MessageCircle,
  FileText,
  BarChart3,
  Link2,
} from "lucide-react";

const ManageShopPage = () => {
  const shopSections = [
    {
      id: 1,
      title: "Shop Settings",
      description:
        "Customize your shop’s general configurations for a smooth experience.",
      icon: Settings,
      color: "from-blue-500 to-blue-600",
      href: "/dashboard/myshop/manage/shop-settings",
    },
    {
      id: 2,
      title: "Delivery Support",
      description:
        "Manage delivery options to ensure smooth and efficient fulfillment.",
      icon: Truck,
      color: "from-green-500 to-green-600",
      href: "/dashboard/myshop/manage/delivery",
    },
    {
      id: 3,
      title: "SMS Support",
      description:
        "Enable SMS notifications and keep your customers informed in real-time.",
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
      href: "/dashboard/myshop/manage/sms-support",
    },
    {
      id: 4,
      title: "Shop Domain",
      description:
        "Configure and manage your shop’s domain and general settings.",
      icon: Globe,
      color: "from-indigo-500 to-indigo-600",
      href: "/dashboard/myshop/manage/domain",
    },
    {
      id: 5,
      title: "Payment Gateway",
      description:
        "Integrate payment options to provide secure and flexible checkout.",
      icon: CreditCard,
      color: "from-emerald-500 to-emerald-600",
      href: "/dashboard/myshop/manage/payment",
    },
    {
      id: 6,
      title: "Chat Support",
      description:
        "Offer instant help and communication with a chat support system.",
      icon: MessageCircle,
      color: "from-cyan-500 to-cyan-600",
      href: "/dashboard/myshop/manage/chat-support",
    },
    {
      id: 7,
      title: "Shop Policy",
      description:
        "Set up refund, return, and customer service policies for your shop.",
      icon: FileText,
      color: "from-amber-500 to-amber-600",
      href: "/dashboard/myshop/manage/policy",
    },
    {
      id: 8,
      title: "SEO & Marketing Integrations",
      description:
        "Connect SEO tools and marketing integrations to increase visibility.",
      icon: BarChart3,
      color: "from-orange-500 to-orange-600",
      href: "/dashboard/myshop/manage/seo-marketing",
    },
    {
      id: 9,
      title: "Social Links",
      description:
        "Add and manage your social media links to improve engagement.",
      icon: Link2,
      color: "from-pink-500 to-pink-600",
      href: "/dashboard/myshop/manage/social-links",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Manage Shop
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Set up and customize your shop to ensure a smooth and efficient experience.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                href={section.href}
                key={section.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 group cursor-pointer block"
              >
                <div className="p-6">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${section.color} mb-4 group-hover:scale-105 transition-transform duration-300`}
                  >
                    <Icon className="text-white w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {section.description}
                  </p>

                  {/* Manage Button */}
                  <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">
                    <span>Manage</span>
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Need help setting up your shop?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our support team is here to help you get the most out of your shop configuration.
            </p>
            <Link
              href="/support"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg inline-block"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageShopPage;
