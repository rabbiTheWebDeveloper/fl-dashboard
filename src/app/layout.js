import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "AMARDokan - আপনার অনলাইন দোকান তৈরি করুন সহজেই",
    template: "%s | AMARDokan",
  },
  description:
    "AMARDokan দিয়ে শুরু করুন আপনার ই-কমার্স ব্যবসা। সম্পূর্ণ বাংলায় এবং সহজ ব্যবহারযোগ্য ইন্টারফেস। বাংলাদেশের জন্য তৈরি সম্পূর্ণ বাংলা ই-কমার্স সমাধান।",
  keywords:
    "ই-কমার্স, অনলাইন দোকান, বাংলাদেশ, বাংলা, ইকমার্স প্লাটফর্ম, AMARDokan, অনলাইন ব্যবসা, পণ্য বিক্রয়",
  authors: [{ name: "AMARDokan Team" }],
  creator: "AMARDokan",
  publisher: "AMARDokan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://amardokan-two.vercel.app/"),
  alternates: {
    canonical: "/",
    languages: {
      "bn-BD": "/bn-BD",
    },
  },
  openGraph: {
    title: "AMARDokan - আপনার অনলাইন দোকান তৈরি করুন সহজেই",
    description:
      "AMARDokan দিয়ে শুরু করুন আপনার ই-কমার্স ব্যবসা। সম্পূর্ণ বাংলায় এবং সহজ ব্যবহারযোগ্য ইন্টারফেস।",
    url: "https://amardokan-two.vercel.app/",
    siteName: "AMARDokan",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AMARDokan - ই-কমার্স প্লাটফর্ম",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMARDokan - আপনার অনলাইন দোকান তৈরি করুন সহজেই",
    description:
      "AMARDokan দিয়ে শুরু করুন আপনার ই-কমার্স ব্যবসা। সম্পূর্ণ বাংলায় এবং সহজ ব্যবহারযোগ্য ইন্টারফেস।",
    images: ["/twitter-image.jpg"],
    creator: "@amardokan",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  category: "ecommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "AMARDokan",
                "url": "https://amardokan-two.vercel.app/",
                "logo": "https://amardokan-two.vercel.app/logo.png",
                "description": "বাংলাদেশের জন্য তৈরি সম্পূর্ণ বাংলা ই-কমার্স সমাধান।",
                "sameAs": [
                  "https://facebook.com/amardokan",
                  "https://twitter.com/amardokan"
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "AMARDokan",
                "url": "https://amardokan-two.vercel.app/",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://amardokan-two.vercel.app/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How long does setup take?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Setup takes less than 5 minutes. Simply connect your e-commerce platform and you're ready to go."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is there a free trial available?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! We offer a 14-day free trial for our Pro plan with no credit card required."
                    }
                  }
                ]
              }
            ]),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main id="main-content">
          {children}
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
