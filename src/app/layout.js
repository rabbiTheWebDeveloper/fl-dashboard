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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        data-new-gr-c-s-check-loaded="14.1254.0"
        data-gr-ext-installed=""
        cz-shortcut-listen="true"
       
      >
        {children}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      </body>
    </html>
  );
}
