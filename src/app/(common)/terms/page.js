"use client"
import Head from 'next/head';
import Link from 'next/link';

export default function Terms() {
  return (
    <>
      <Head>
        <title>AMARDokan - শর্তাবলী</title>
        <meta name="description" content="AMARDokan এর সেবা শর্তাবলী ও ব্যবহারের নিয়ম" />
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
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 bangla-text">সেবা শর্তাবলী</h1>
            
            <div className="prose max-w-none bangla-text">
              <div className="mb-8">
                <p className="text-gray-600 mb-6">
                  AMARDokan প্ল্যাটফর্ম ব্যবহারের জন্য আপনাকে আমাদের সেবা শর্তাবলী মেনে চলতে হবে। এই শর্তাবলী AMARDokan ওয়েবসাইট এবং মোবাইল অ্যাপ্লিকেশন ব্যবহারের জন্য প্রযোজ্য।
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">১. অ্যাকাউন্ট নিবন্ধন</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>১.১. AMARDokan ব্যবহার করতে আপনাকে একটি অ্যাকাউন্ট তৈরি করতে হবে।</p>
                    <p>১.২. আপনাকে সঠিক এবং সম্পূর্ণ তথ্য প্রদান করতে হবে।</p>
                    <p>১.৩. আপনার অ্যাকাউন্টের নিরাপত্তার দায়িত্ব আপনারই থাকবে।</p>
                    <p>১.৪. কোনো অননুমোদিত অ্যাক্সেসের ক্ষেত্রে আমাদের অবহিত করুন।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">২. সেবা ব্যবহার</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>২.১. AMARDokan শুধুমাত্র বৈধ ব্যবসায়িক উদ্দেশ্যে ব্যবহার করা যাবে।</p>
                    <p>২.২. কোনো অবৈধ পণ্য বা সেবা বিক্রি করা যাবে না।</p>
                    <p>২.৩. প্ল্যাটফর্মের নিরাপত্তা ব্যবস্থার ক্ষতি করতে পারে এমন কোনো কাজ করা যাবে না।</p>
                    <p>২.৪. অন্যান্য ব্যবহারকারীদের সাথে সম্মানজনক আচরণ করতে হবে।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">৩. পেমেন্ট এবং বিলিং</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>৩.১. সমস্ত লেনদেন বাংলাদেশী টাকায় করা হবে।</p>
                    <p>৩.২. পেমেন্ট গেটওয়ে চার্জ অতিরিক্ত প্রযোজ্য হবে।</p>
                    <p>৩.৩. মাসিক সাবস্ক্রিপশন ফি অগ্রিম পরিশোধ করতে হবে।</p>
                    <p>৩.৪. রিফান্ড নীতিমালা আলাদাভাবে প্রযোজ্য।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">৪. বুদ্ধিবৃত্তিক সম্পত্তি</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>৪.১. AMARDokan প্ল্যাটফর্মের সমস্ত কপিরাইট আমাদের মালিকানাধীন।</p>
                    <p>৪.২. ব্যবহারকারীরা তাদের কন্টেন্টের জন্য নিজেরাই দায়ী।</p>
                    <p>৪.৩. কোনো কন্টেন্ট কপি বা পুনরুৎপাদন করা যাবে না।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">৫. দায়িত্ব সীমাবদ্ধতা</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>৫.১. আমরা সার্ভারের নিরবচ্ছিন্নতা নিশ্চিত করার চেষ্টা করি, কিন্তু গ্যারান্টি দিই না।</p>
                    <p>৫.২. ডাটা হারানোর জন্য আমরা দায়ী নই।</p>
                    <p>৫.৩. তৃতীয় পক্ষের সেবার জন্য আমরা দায়ী নই।</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4 text-indigo-600">৬. শর্তাবলী পরিবর্তন</h2>
                  <div className="space-y-3 text-gray-700">
                    <p>৬.১. আমরা যেকোনো সময় শর্তাবলী পরিবর্তন করতে পারি।</p>
                    <p>৬.২. পরিবর্তনগুলি ওয়েবসাইটে প্রকাশ করা হবে।</p>
                    <p>৬.৩. পরিবর্তিত শর্তাবলী অবগত হওয়ার দায়িত্ব ব্যবহারকারীর।</p>
                  </div>
                </section>

                <div className="bg-blue-50 p-6 rounded-lg mt-8">
                  <h3 className="text-lg font-semibold mb-2 text-blue-800 bangla-text">জরুরি যোগাযোগ</h3>
                  <p className="text-blue-700 bangla-text">
                    কোনো প্রশ্ন বা উদ্বেগ থাকলে আমাদের সাথে যোগাযোগ করুন: <br />
                    ইমেইল: legal@amardokan.com <br />
                    ফোন: +৮৮০ ১৭XX-XXXXXX
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