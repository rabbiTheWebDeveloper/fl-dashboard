import React from 'react';

const ComingSoon = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center">
                {/* Animated Logo/Icon */}
                <div className="mb-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-pulse">
                        <svg 
                            className="w-12 h-12 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M13 10V3L4 14h7v7l9-11h-7z" 
                            />
                        </svg>
                    </div>
                </div>

                {/* Main Content */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Coming <span className="text-blue-600">Soon</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                    Something amazing is on the way. We're working hard to bring you an incredible experience.
                </p>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-12">
                    {[
                        { label: 'Days', value: '00' },
                        { label: 'Hours', value: '00' },
                        { label: 'Minutes', value: '00' },
                        { label: 'Seconds', value: '00' }
                    ].map((item, index) => (
                        <div key={index} className="text-center">
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20">
                                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                                    {item.value}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">
                                    {item.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: '75%' }}
                        ></div>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/20 max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Get Notified When We Launch
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md">
                            Notify Me
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        We'll send you one email when we're ready. No spam.
                    </p>
                </div>

                {/* Social Links */}
                <div className="mt-12">
                    <p className="text-gray-600 mb-6">Follow us for updates</p>
                    <div className="flex justify-center space-x-6">
                        {[
                            { name: 'Twitter', icon: '🐦', url: '#' },
                            { name: 'Facebook', icon: '📘', url: '#' },
                            { name: 'Instagram', icon: '📷', url: '#' },
                            { name: 'LinkedIn', icon: '💼', url: '#' }
                        ].map((social, index) => (
                            <a
                                key={index}
                                href={social.url}
                                className="w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20 hover:shadow-md hover:scale-110 transition-all duration-300 text-lg"
                                title={social.name}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-300/30">
                    <p className="text-gray-500">
                        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Floating Elements for Decoration */}
            <div className="absolute top-10 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute top-20 right-20 w-6 h-6 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-3 h-3 bg-indigo-400 rounded-full opacity-25 animate-bounce delay-75"></div>
            <div className="absolute bottom-10 right-10 w-5 h-5 bg-blue-300 rounded-full opacity-20 animate-pulse delay-150"></div>
        </div>
    );
};

export default ComingSoon;