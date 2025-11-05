"use client"
import React, { useState } from 'react';

const Courier = () => {
    const [activeCourier, setActiveCourier] = useState('steadfast');
    const [isLoading, setIsLoading] = useState(false);

    // Steadfast State
    const [steadfastData, setSteadfastData] = useState({
        apiKey: '',
        secretKey: ''
    });

    // REDX State
    const [redxData, setRedxData] = useState({
        token: ''
    });

    // Pathao State
    const [pathaoData, setPathaoData] = useState({
        clientId: 'nXe0YZ7axr',
        clientSecret: '',
        username: 'alrabbism@gmail.com',
        password: '',
        storeId: '77790'
    });

    const handleSteadfastSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Steadfast Data:', steadfastData);
        
        setIsLoading(false);
    };

    const handleRedxSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('REDX Token:', redxData.token);
        
        setIsLoading(false);
    };

    const handlePathaoSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Pathao Data:', pathaoData);
        
        setIsLoading(false);
    };

    const handleBackClick = () => {
        // Handle back navigation - you can modify this based on your routing
        console.log('Back button clicked');
        window.history.back(); // or use your router's back function
    };

    const couriers = [
        { id: 'steadfast', name: 'Steadfast', color: 'blue' },
        { id: 'redx', name: 'REDX', color: 'red' },
        { id: 'pathao', name: 'Pathao Parcels', color: 'green' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section with Back Button */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        {/* Back Button */}
                        <button
                            onClick={handleBackClick}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back</span>
                        </button>

                        {/* Main Header */}
                        <div className="text-center flex-1">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Courier Integration
                            </h1>
                            <p className="text-gray-600">
                                Connect and manage your courier services
                            </p>
                        </div>

                        {/* Empty div for spacing */}
                        <div className="w-20"></div>
                    </div>
                </div>

                {/* Courier Selection Tabs */}
                <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
                    <div className="flex flex-wrap gap-2">
                        {couriers.map((courier) => (
                            <button
                                key={courier.id}
                                onClick={() => setActiveCourier(courier.id)}
                                className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                                    activeCourier === courier.id
                                        ? `bg-${courier.color}-500 text-white shadow-md`
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {courier.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Steadfast Form */}
                {activeCourier === 'steadfast' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Steadfast
                            </h2>
                            <p className="text-gray-600">Courier Integration</p>
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="mb-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                    Select Steadfast
                                </h3>
                            </div>

                            <form onSubmit={handleSteadfastSubmit} className="space-y-6">
                                {/* API Key */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        API Key
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={steadfastData.apiKey}
                                            onChange={(e) => setSteadfastData({
                                                ...steadfastData,
                                                apiKey: e.target.value
                                            })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter API Key"
                                        />
                                        <input
                                            type="password"
                                            value={steadfastData.apiKey}
                                            onChange={(e) => setSteadfastData({
                                                ...steadfastData,
                                                apiKey: e.target.value
                                            })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Confirm API Key"
                                        />
                                    </div>
                                </div>

                                {/* Secret Key */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Secret Key
                                    </label>
                                    <div className="space-y-2">
                                        <input
                                            type="password"
                                            value={steadfastData.secretKey}
                                            onChange={(e) => setSteadfastData({
                                                ...steadfastData,
                                                secretKey: e.target.value
                                            })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter Secret Key"
                                        />
                                        <input
                                            type="password"
                                            value={steadfastData.secretKey}
                                            onChange={(e) => setSteadfastData({
                                                ...steadfastData,
                                                secretKey: e.target.value
                                            })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Confirm Secret Key"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* REDX Form */}
                {activeCourier === 'redx' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                REDX
                            </h2>
                            <p className="text-gray-600">Courier Integration</p>
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="mb-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                    Select Redx
                                </h3>
                            </div>

                            <form onSubmit={handleRedxSubmit} className="space-y-6">
                                {/* Token */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Token
                                    </label>
                                    <input
                                        type="text"
                                        value={redxData.token}
                                        onChange={(e) => setRedxData({
                                            ...redxData,
                                            token: e.target.value
                                        })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter Token"
                                    />
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 focus:ring-4 focus:ring-red-200 transition-all duration-200 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Pathao Form */}
                {activeCourier === 'pathao' && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Pathao Parcels
                            </h2>
                            <p className="text-gray-600">Courier Integration</p>
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="mb-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                    Select Pathao Parcels
                                </h3>
                            </div>

                            <form onSubmit={handlePathaoSubmit} className="space-y-6">
                                {/* Client ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pathao Client Id
                                    </label>
                                    <input
                                        type="text"
                                        value={pathaoData.clientId}
                                        onChange={(e) => setPathaoData({
                                            ...pathaoData,
                                            clientId: e.target.value
                                        })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                {/* Client Secret */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pathao Client Secret
                                    </label>
                                    <input
                                        type="password"
                                        value={pathaoData.clientSecret}
                                        onChange={(e) => setPathaoData({
                                            ...pathaoData,
                                            clientSecret: e.target.value
                                        })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Enter Client Secret"
                                    />
                                </div>

                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pathao Username
                                    </label>
                                    <input
                                        type="email"
                                        value={pathaoData.username}
                                        onChange={(e) => setPathaoData({
                                            ...pathaoData,
                                            username: e.target.value
                                        })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pathao Password
                                    </label>
                                    <input
                                        type="password"
                                        value={pathaoData.password}
                                        onChange={(e) => setPathaoData({
                                            ...pathaoData,
                                            password: e.target.value
                                        })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="Enter Password"
                                    />
                                </div>

                                {/* Store ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pathao Store ID
                                    </label>
                                    <input
                                        type="text"
                                        value={pathaoData.storeId}
                                        onChange={(e) => setPathaoData({
                                            ...pathaoData,
                                            storeId: e.target.value
                                        })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                {/* Webhook Info */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-semibold text-gray-700 mb-2">
                                        Pathao Dashboard &gt; Developer's API &gt; Webhook Integration
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">CallbackURL:</span>
                                            <p className="text-gray-700">https://web.funnelliner.com/pathao/webhook/funnelliner1234</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Secret:</span>
                                            <p className="text-gray-700">funnelliner1234</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50"
                                    >
                                        {isLoading ? 'Submitting...' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Status Indicator */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <span className="text-sm font-medium text-gray-700">
                                {activeCourier === 'steadfast' && 'Steadfast API Status: Ready'}
                                {activeCourier === 'redx' && 'REDX API Status: Ready'}
                                {activeCourier === 'pathao' && 'Pathao API Status: Ready'}
                            </span>
                        </div>
                        <span className="text-xs text-gray-500">Last updated: Just now</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courier;