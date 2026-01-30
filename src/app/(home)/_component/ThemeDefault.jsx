import Link from "next/link";



export default function ThemeDefault() {
  return (
 <div className="bg-gray-50">
  {/* Header/Navigation */}
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-xl">আ</span>
        </div>
        <h1 className="text-2xl font-bold text-indigo-600">AMARDokan</h1>
      </div>
      <nav className="hidden md:flex space-x-8">
        <a
          href="#features"
          className="text-gray-600 hover:text-indigo-600 font-medium"
        >
          বৈশিষ্ট্য
        </a>
        <a
          href="#solutions"
          className="text-gray-600 hover:text-indigo-600 font-medium"
        >
          সেবাসমূহ
        </a>
        <a
          href="#pricing"
          className="text-gray-600 hover:text-indigo-600 font-medium"
        >
          মূল্য
        </a>
        <a
          href="#testimonials"
          className="text-gray-600 hover:text-indigo-600 font-medium"
        >
          গ্রাহক মতামত
        </a>
        <a
          href="#contact"
          className="text-gray-600 hover:text-indigo-600 font-medium"
        >
          যোগাযোগ
        </a>
      </nav>
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
          লগইন
        </Link>
        <a
          href="/registration"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          ফ্রি ট্রায়াল শুরু করুন
        </a>
      </div>
    </div>
  </header>
  {/* Hero Section */}
  <section className="hero-bg text-white py-16 md:py-24">
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 bangla-text">
        আপনার অনলাইন দোকান তৈরি করুন সহজেই
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto bangla-text">
        AMARDokan দিয়ে শুরু করুন আপনার ই-কমার্স ব্যবসা। সম্পূর্ণ বাংলায় এবং
        সহজ ব্যবহারযোগ্য ইন্টারফেস।
      </p>
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
        <a
          href="#"
          className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition bangla-text"
        >
          ফ্রি ট্রায়াল শুরু করুন
        </a>
        <a
          href="#"
          className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition bangla-text"
        >
          ডেমো দেখুন
        </a>
      </div>
    </div>
  </section>
  {/* Features Section */}
  <section id="features" className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-4 bangla-text">
        AMARDokan এর বিশেষ বৈশিষ্ট্য
      </h2>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto bangla-text">
        আমাদের প্ল্যাটফর্মে রয়েছে সবচেয়ে প্রয়োজনীয় ফিচারগুলো যা আপনার
        ব্যবসাকে করবে আরও সহজ এবং লাভজনক
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Feature Cards */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm feature-card">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 bangla-text">
            পণ্য ব্যবস্থাপনা
          </h3>
          <p className="text-gray-600 bangla-text">
            সহজেই পণ্য যোগ করুন, ক্যাটাগরাইজ করুন এবং স্টক ম্যানেজ করুন। এক
            ক্লিকেই শত শত পণ্য আপলোড করতে পারবেন।
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm feature-card">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 bangla-text">
            পেমেন্ট গেটওয়ে
          </h3>
          <p className="text-gray-600 bangla-text">
            বাংলাদেশের সকল জনপ্রিয় পেমেন্ট মেথড সাপোর্ট করে। bKash, Nagad,
            Rocket সহ সকল মোবাইল ফাইন্যান্স সার্ভিস।
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm feature-card">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 bangla-text">
            বিশ্লেষণ ও রিপোর্ট
          </h3>
          <p className="text-gray-600 bangla-text">
            বিস্তারিত সেলস রিপোর্ট, কাস্টমার বিহেভিয়ার এনালাইসিস এবং ব্যবসার
            성능 মনিটর করার সব টুলস একসাথে।
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm feature-card">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 bangla-text">
            মাল্টি-চ্যানেল বিক্রয়
          </h3>
          <p className="text-gray-600 bangla-text">
            ওয়েবসাইট, ফেসবুক পেজ, ইন্সটাগ্রাম সহ একাধিক চ্যানেল থেকে অর্ডার
            ম্যানেজ করুন একই ড্যাশবোর্ড থেকে।
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm feature-card">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 bangla-text">
            ইনভেন্টরি ব্যবস্থাপনা
          </h3>
          <p className="text-gray-600 bangla-text">
            অটোমেটেড স্টক আপডেট, লো-স্টক নোটিফিকেশন এবং পূর্ণাঙ্গ ইনভেন্টরি
            ট্র্যাকিং সিস্টেম।
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm feature-card">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 bangla-text">
            ২৪/৭ সাপোর্ট
          </h3>
          <p className="text-gray-600 bangla-text">
            বাংলায় ২৪/৭ কাস্টমার সাপোর্ট। ফোন, ইমেইল এবং লাইভ চ্যাটের মাধ্যমে
            যেকোনো সমস্যার সমাধান।
          </p>
        </div>
      </div>
    </div>
  </section>
  {/* How It Works Section */}
  <section className="py-16 bg-gray-100">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-4 bangla-text">
        কিভাবে কাজ করে AMARDokan?
      </h2>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto bangla-text">
        মাত্র ৩টি সহজ ধাপে শুরু করুন আপনার অনলাইন ব্যবসা
      </p>
      <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
        <div className="text-center max-w-xs">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            ১
          </div>
          <h3 className="text-xl font-semibold mb-2 bangla-text">
            নিবন্ধন করুন
          </h3>
          <p className="text-gray-600 bangla-text">
            বিনামূল্যে অ্যাকাউন্ট তৈরি করুন এবং আপনার দোকানের তথ্য দিন
          </p>
        </div>
        <div className="text-center max-w-xs">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            ২
          </div>
          <h3 className="text-xl font-semibold mb-2 bangla-text">
            পণ্য যোগ করুন
          </h3>
          <p className="text-gray-600 bangla-text">
            আপনার পণ্যগুলোর ছবি এবং বিবরণ সহ যোগ করুন
          </p>
        </div>
        <div className="text-center max-w-xs">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            ৩
          </div>
          <h3 className="text-xl font-semibold mb-2 bangla-text">
            বিক্রয় শুরু করুন
          </h3>
          <p className="text-gray-600 bangla-text">
            আপনার দোকান লাইভ করুন এবং অর্ডার নেওয়া শুরু করুন
          </p>
        </div>
      </div>
      <div className="text-center mt-12">
        <a
          href="#"
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition bangla-text"
        >
          এখনই শুরু করুন
        </a>
      </div>
    </div>
  </section>
  {/* Pricing Section */}
  <section id="pricing" className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-4 bangla-text">
        মূল্য পরিকল্পনা
      </h2>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto bangla-text">
        সবার জন্য উপযোগী এবং সাশ্রয়ী মূল্যের প্যাকেজ
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-4 bangla-text">বেসিক</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">৳৫০০</span>
            <span className="text-gray-600 bangla-text">/মাস</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">৫০টি পর্যন্ত পণ্য</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">বেসিক থিম</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">ইমেল সাপোর্ট</span>
            </li>
          </ul>
          <a
            href="#"
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition bangla-text"
          >
            নির্বাচন করুন
          </a>
        </div>
        <div className="bg-white border-2 border-indigo-600 rounded-lg p-8 text-center relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm bangla-text">
            সবচেয়ে জনপ্রিয়
          </div>
          <h3 className="text-xl font-semibold mb-4 bangla-text">
            স্ট্যান্ডার্ড
          </h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">৳১২০০</span>
            <span className="text-gray-600 bangla-text">/মাস</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">৫০০টি পর্যন্ত পণ্য</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">কাস্টমাইজযোগ্য থিম</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">প্রায়োরিটি সাপোর্ট</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">বিক্রয় বিশ্লেষণ</span>
            </li>
          </ul>
          <a
            href="#"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition bangla-text"
          >
            নির্বাচন করুন
          </a>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-4 bangla-text">প্রিমিয়াম</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">৳২৫০০</span>
            <span className="text-gray-600 bangla-text">/মাস</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">অসীম পণ্য</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">এডভান্সড থিম</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">২৪/৭ প্রায়োরিটি সাপোর্ট</span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="bangla-text">মাল্টি-ভেন্ডর সাপোর্ট</span>
            </li>
          </ul>
          <a
            href="#"
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition bangla-text"
          >
            নির্বাচন করুন
          </a>
        </div>
      </div>
    </div>
  </section>
  {/* CTA Section */}
  <section className="py-16 gradient-bg text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-6 bangla-text">
        আপনার ব্যবসাকে ডিজিটাল করুন আজই!
      </h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto bangla-text">
        হাজারো ব্যবসায়ী AMARDokan ব্যবহার করে তাদের অনলাইন উপস্থিতি তৈরি
        করেছেন। আজই যোগ দিন তাদের সাথে।
      </p>
      <a
        href="#"
        className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition bangla-text"
      >
        ফ্রি ট্রায়াল শুরু করুন
      </a>
    </div>
  </section>
  {/* Footer */}
  <footer className="bg-gray-800 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">আ</span>
            </div>
            <h3 className="text-xl font-bold">AMARDokan</h3>
          </div>
          <p className="text-gray-400 bangla-text">
            বাংলাদেশের জন্য তৈরি সম্পূর্ণ বাংলা ই-কমার্স সমাধান।
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 bangla-text">দ্রুত লিংক</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition bangla-text"
              >
                হোম
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="text-gray-400 hover:text-white transition bangla-text"
              >
                বৈশিষ্ট্য
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                className="text-gray-400 hover:text-white transition bangla-text"
              >
                মূল্য
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-gray-400 hover:text-white transition bangla-text"
              >
                যোগাযোগ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 bangla-text">সেবাসমূহ</h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition bangla-text"
              >
                ওয়েবসাইট তৈরি
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition bangla-text"
              >
                ই-কমার্স সলিউশন
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition bangla-text"
              >
                ডিজিটাল মার্কেটিং
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition bangla-text"
              >
                সাপোর্ট
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 bangla-text">যোগাযোগ</h4>
          <ul className="space-y-2">
            <li className="text-gray-400 bangla-text">
              ইমেইল: support@amardokan.com
            </li>
            <li className="text-gray-400 bangla-text">ফোন: +৮৮০ ১৭XX-XXXXXX</li>
            <li className="text-gray-400 bangla-text">
              ঠিকানা: ঢাকা, বাংলাদেশ
            </li>
          </ul>
        </div>
      </div>
<div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
  <a
    target="_blank"
    href="https://www.sslcommerz.com/"
    title="SSLCommerz"
    aria-label="SSLCommerz"
  >
    <img
      src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-01.png"
      alt="SSLCommerz"
      style={{ width: "100%", height: "auto" }}
    />
  </a>

  <p className="bangla-text">© ২০২৫ AMARDokan. সকল স্বত্ব সংরক্ষিত।</p>
</div>

    </div>
  </footer>
</div>

  );
}
