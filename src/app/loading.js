import React from 'react';

/**
 * Standard Next.js loading component.
 * This is displayed by Next.js during page transitions and initial loads.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080514]">
      <div className="text-center">
        <div className="relative inline-block">
          {/* Main outer ring */}
          <div className="w-20 h-20 border-4 border-white/10 rounded-full animate-spin"></div>
          
          {/* Inner spinning accent ring */}
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-violet-600 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          
          {/* Centered Logo/Character */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold text-lg">আ</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white tracking-tight">AMAR<span className="text-violet-400">Dokan</span></h2>
          <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide">আপনার দোকান তৈরি করা হচ্ছে...</p>
        </div>
        
        {/* Subtle progress indicator */}
        <div className="mt-6 w-48 bg-white/5 rounded-full h-1 mx-auto overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full animate-loading-progress"></div>
        </div>
      </div>
    </div>
  );
}