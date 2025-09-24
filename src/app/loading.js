"use client";
import { useState, useEffect } from 'react';

// components/LoadingSpinner.js
export  function LoadingSpinner({ size = "medium", text = "লোড হচ্ছে..." }) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xlarge: "w-24 h-24"
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
    xlarge: "text-xl"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-indigo-200`}></div>
        
        {/* Spinning ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin`}></div>
        
        {/* AMARDokan logo inside */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-indigo-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">আ</span>
          </div>
        </div>
      </div>
      
      {text && (
        <p className={`mt-4 text-gray-600 font-medium ${textSizes[size]} bangla-text`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Alternative spinner designs
export function PulseLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 bg-indigo-600 rounded-full animate-pulse flex items-center justify-center">
          <span className="text-white font-bold text-xl">আ</span>
        </div>
        <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium bangla-text">লোড হচ্ছে...</p>
    </div>
  );
}

export function DotsLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium bangla-text">লোড হচ্ছে...</p>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative">
          {/* Main spinner */}
          <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin"></div>
          
          {/* Inner spinner */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
          
          {/* Logo */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">আ</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 bangla-text">AMARDokan</h3>
          <p className="text-gray-600 mt-2 bangla-text">আপনার দোকান তৈরি করা হচ্ছে...</p>
        </div>
        
        {/* Progress bar */}
        <div className="mt-6 w-64 bg-gray-200 rounded-full h-2 mx-auto">
          <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  );
}

// Skeleton loading components
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 rounded mb-4"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded mb-2"></div>
      ))}
    </div>
  );
}
export default function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 bangla-text">লোডিং কম্পোনেন্ট ডেমো</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 bangla-text">বেসিক স্পিনার</h3>
          <LoadingSpinner />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 bangla-text">পালস লোডিং</h3>
          <PulseLoading />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 bangla-text">ডটস লোডিং</h3>
          <DotsLoading />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 bangla-text">ছোট স্পিনার</h3>
          <LoadingSpinner size="small" text="প্রসেসিং..." />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 bangla-text">বড় স্পিনার</h3>
          <LoadingSpinner size="large" text="ডেটা লোড হচ্ছে..." />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 bangla-text">কার্ড সkeleton</h3>
          <CardSkeleton />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 bangla-text">টেবিল সkeleton</h3>
        <TableSkeleton />
      </div>
    </div>
  );
}