// pages/privacy.js
"use client"
import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>AMARDokan - গোপনীয়তা নীতি</title>
        <meta name="description" content="AMARDokan এর গোপনীয়তা নীতি ও ডেটা সুরক্ষা" />
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-xl">আ</span>
                  </div>
                  <h1 className="text-2xl font-bold text-indigo-600">AMARDokan</h1>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium">হোম</Link>
              <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium">লগইন</Link>
              <Link href="/registration" className="text-gray-600 hover:text-indigo-600 font-medium">নিবন্ধন</Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 bangla-text">গোপনীয়তা নীতি</h1>
            
            <div className="prose max-w-none bangla-text">
              <div className="mb-8">
                <p className="text-gray-600 mb-6">
                  AMARDokan আপনার গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই নীতিতে বর্ণিত হয়েছে আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত করি।
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">১. তথ্য সংগ্রহ</h2>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>১.১. ব্যক্তিগত তথ্য:</strong> নাম, ইমেইল, ফোন নম্বর, ঠিকানা ইত্যাদি।</p>
                    <p><strong>১.২. ব্যবসায়িক তথ্য:</strong> দোকানের নাম, পণ্যের তথ্য, বিক্রয় ডেটা ইত্যাদি।</p>
                    <p><strong>১.৩. প্রযুক্তিগত তথ্য:</strong> IP অ্যাড্রেস, ব্রাউজার টাইপ, ডিভাইস তথ্য ইত্যাদি।</p>
                    <p><strong>১.৪. ব্যবহার সংক্রান্ত তথ্য:</strong> পৃষ্ঠা ভিজিট, ক্লিক, সেশন ডুরেশন ইত্যাদি।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">২. তথ্য ব্যবহার</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>২.১. সেবা প্রদান এবং উন্নয়ন করা।</p>
                    <p>২.২. গ্রাহক সেবা এবং সহায়তা প্রদান করা।</p>
                    <p>২.৩. নিরাপত্তা এবং জালিয়াতি রোধ করা।</p>
                    <p>২.৪. গুরুত্বপূর্ণ আপডেট এবং নোটিফিকেশন পাঠানো।</p>
                    <p>২.৫. প্ল্যাটফর্মের কার্যকারিতা বিশ্লেষণ করা।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">৩. তথ্য শেয়ারিং</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>৩.১. আমরা আপনার তথ্য তৃতীয় পক্ষের সাথে বিক্রি করি না।</p>
                    <p>৩.২. শুধুমাত্র সেবা প্রদানের জন্য প্রয়োজনীয় অংশীদারদের সাথে শেয়ার করা হয়।</p>
                    <p>৩.৩. আইনি বাধ্যবাধকতা থাকলে শেয়ার করা হতে পারে।</p>
                    <p>৩.৪. ব্যবসা হস্তান্তরের ক্ষেত্রে তথ্য স্থানান্তরিত হতে পারে।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">৪. ডেটা সুরক্ষা</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>৪.১. SSL এনক্রিপশন ব্যবহার করে ডেটা ট্রান্সমিশন।</p>
                    <p>৪.২. নিরাপদ সার্ভারে ডেটা সংরক্ষণ।</p>
                    <p>৪.৩. নিয়মিত সিকিউরিটি অডিট এবং মনিটরিং।</p>
                    <p>৪.৪. কর্মচারীদের গোপনীয়তা প্রশিক্ষণ।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">৫. কুকি এবং ট্র্যাকিং</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>৫.১. প্রয়োজনীয় কুকি: লগইন সেশন এবং প্রাথমিক ফাংশনের জন্য।</p>
                    <p>৫.২. বিশ্লেষণাত্মক কুকি: ব্যবহার অভিজ্ঞতা উন্নয়নের জন্য।</p>
                    <p>৫.৩. আপনি ব্রাউজার সেটিংস থেকে কুকি নিয়ন্ত্রণ করতে পারেন।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">৬. আপনার অধিকার</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>৬.১. আপনার ব্যক্তিগত তথ্য অ্যাক্সেস করার অধিকার।</p>
                    <p>৬.২. ভুল তথ্য সংশোধনের অধিকার।</p>
                    <p>৬.৩. তথ্য মুছে ফেলার অনুরোধ করার অধিকার।</p>
                    <p>৬.৪. ডেটা প্রসেসিং সীমাবদ্ধ করার অধিকার।</p>
                    <p>৬.৫. ডেটা পোর্টেবিলিটির অধিকার।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">৭. শিশুদের গোপনীয়তা</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>৭.১. AMARDokan ১৬ বছর以下的 শিশুদের জন্য নয়।</p>
                    <p>৭.২. আমরা ইচ্ছাকৃতভাবে শিশুদের তথ্য সংগ্রহ করি না।</p>
                    <p>৭.৩. শিশুর তথ্য পাওয়া গেলে তা মুছে ফেলা হবে।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">৮. আন্তর্জাতিক ডেটা ট্রান্সফার</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>৮.১. ডেটা প্রধানত বাংলাদেশে সংরক্ষিত হয়।</p>
                    <p>৮.২. আন্তর্জাতিক সেবা প্রদানকারীদের সাথে শেয়ার করা হতে পারে।</p>
                    <p>৮.৩. যথাযথ সুরক্ষা ব্যবস্থা অনুসরণ করা হয়।</p>
                  </div>
                </section>

                <div className="bg-green-50 p-6 rounded-lg mt-8">
                  <h3 className="text-lg font-semibold mb-2 text-green-800 bangla-text">গোপনীয়তা সম্পর্কিত প্রশ্ন</h3>
                  <p className="text-green-700 bangla-text">
                    গোপনীয়তা সংক্রান্ত কোনো প্রশ্ন থাকলে যোগাযোগ করুন: <br />
                    ইমেইল: privacy@amardokan.com <br />
                    ডেটা প্রোটেকশন অফিসার: +৮৮০ ১৭XX-XXXXXX
                  </p>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-500 text-sm bangla-text">
                    শেষ আপডেট: ১ জানুয়ারি, ২০২৫
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          font-family: 'Hind Siliguri', sans-serif;
        }
        .bangla-text {
          line-height: 1.8;
        }
        .prose {
          line-height: 1.8;
        }
        .prose p {
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
}