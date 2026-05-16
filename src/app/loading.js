/**
 * Global loading UI — displayed by Next.js App Router during page navigations.
 * Uses only Tailwind + globals.css classes; no inline <style> tags needed.
 */
export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#080514]"
      role="status"
      aria-label="পেজ লোড হচ্ছে"
    >
      <div className="text-center">
        {/* Spinner rings */}
        <div className="relative inline-block w-20 h-20">
          {/* Static outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          {/* Spinning accent ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-600 animate-spin"
            style={{ animationDuration: "0.9s" }}
          />
          {/* Brand logo centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-black text-lg" aria-hidden="true">
                আ
              </span>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="mt-8">
          <p className="text-xl font-bold text-white tracking-tight">
            AMAR<span className="text-violet-400">Dokan</span>
          </p>
          <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide">
            আপনার দোকান তৈরি করা হচ্ছে…
          </p>
        </div>

        {/* Shimmer progress bar — pure CSS, no inline <style> */}
        <div className="mt-6 w-48 bg-white/5 rounded-full h-1 mx-auto overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full animate-loading-progress" />
        </div>
      </div>
    </div>
  );
}