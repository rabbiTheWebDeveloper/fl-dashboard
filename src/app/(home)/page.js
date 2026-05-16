import { siteConfig, buildMetadata, faqSchema, breadcrumbSchema, webPageSchema, softwareApplicationSchema } from "@/lib/seo";
import Theme from "./_component/Theme";

/* ─── FAQ data (reused in JSON-LD) ─── */
const faqs = [
  {
    question: "How long does setup take?",
    answer:
      "Setup takes less than 5 minutes. Simply connect your e-commerce platform, configure your courier services, and you're ready to go. No technical knowledge required.",
  },
  {
    question: "Which platforms do you integrate with?",
    answer:
      "We integrate with all major platforms including Daraz, Shopify, WooCommerce, and custom websites. For couriers, we support Pathao, Redx, eCourier, Sundarban, and more.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! We offer a 14-day free trial for our Pro plan with no credit card required. You can also use our Starter plan for free forever with up to 100 orders/month.",
  },
  {
    question: "Do you offer training and support?",
    answer:
      "Absolutely! We provide comprehensive onboarding via video tutorials, live chat, and 24/7 WhatsApp support.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time with no questions asked. We also offer a 7-day money-back guarantee for all paid plans.",
  },
  {
    question: "How does fake order prevention work?",
    answer:
      "Our AI-powered system uses phone number verification via OTP, device fingerprinting, order pattern analysis, and blacklist matching to block up to 95% of fake orders automatically.",
  },
];

/* ─── Page-level Metadata ─── */
export const metadata = buildMetadata({
  title: "Bangladesh's #1 E-commerce Automation Platform",
  description:
    "AMARDokan — বাংলাদেশের সেরা ই-কমার্স অটোমেশন প্ল্যাটফর্ম। বাল্ক ইনভয়েস প্রিন্ট, অর্ডার ম্যানেজমেন্ট, ফেক অর্ডার প্রতিরোধ, স্টক ট্র্যাকিং ও কুরিয়ার ইন্টিগ্রেশন — সব এক ড্যাশবোর্ডে।",
  path: "/",
  keywords: [
    "ই-কমার্স অটোমেশন",
    "বাল্ক ইনভয়েস প্রিন্ট",
    "ফেক অর্ডার প্রতিরোধ",
    "অর্ডার ম্যানেজমেন্ট",
    "কুরিয়ার ইন্টিগ্রেশন",
  ],
});

const Page = () => {
  const breadcrumbs = [{ name: "Home", path: "/" }];

  return (
    <>
      {/* JSON-LD: WebPage, BreadcrumbList, SoftwareApplication, FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            webPageSchema({
              title: `AMARDokan — Bangladesh's #1 E-commerce Automation Platform`,
              description:
                "বাংলাদেশের সেরা ই-কমার্স অটোমেশন প্ল্যাটফর্ম।",
              path: "/",
              dateModified: new Date().toISOString(),
            }),
            breadcrumbSchema(breadcrumbs),
            faqSchema(faqs),
          ]),
        }}
      />
      <Theme />
    </>
  );
};

export default Page;