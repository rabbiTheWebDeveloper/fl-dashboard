"use client";
import React, { useState } from "react";

const Domain = () => {
  const [domains, setDomains] = useState([
    {
      name: "fldemo.online",
      status: "Connected",
      nameservers: ["ns1.vercel-dns.com", "ns2.vercel-dns.com"],
      records: {
        a: ["163.61.156.64"],
        cname: ["secure.funnelliner.com"],
      },
    },
  ]);

  const [newDomain, setNewDomain] = useState("");
  const [currentDomain, setCurrentDomain] = useState("mywebsite.com");
  const [copiedNameserver, setCopiedNameserver] = useState("");

  const handleAddDomain = () => {
    if (newDomain.trim()) {
      setDomains([
        ...domains,
        {
          name: newDomain.trim(),
          status: "Pending",
          nameservers: ["ns1.vercel-dns.com", "ns2.vercel-dns.com"],
          records: { a: [], cname: [] },
        },
      ]);
      setNewDomain("");
    }
  };

  const handleClearDomain = (domainName) => {
    setDomains(domains.filter((domain) => domain.name !== domainName));
  };

  const handleSaveDomain = (domainName) => {
    // Simulate saving domain configuration
    console.log("Saving domain:", domainName);
    alert(`Domain ${domainName} configuration saved!`);
  };

  const handleUpdateCurrentDomain = () => {
    // Logic to update the current domain
    console.log("Updating current domain to:", currentDomain);
    alert(`Current domain updated to: ${currentDomain}`);
  };

  const handleBack = () => {
    // Navigate back or close modal
    console.log("Going back");
    window.history.back();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedNameserver(text);
      setTimeout(() => setCopiedNameserver(""), 2000);
    });
  };

  const vercelNameservers = ["ns1.vercel-dns.com", "ns2.vercel-dns.com"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Domains</h1>
          <p className="text-gray-600">
            These domains are assigned to your website.
          </p>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* Nameserver Configuration Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Configure Nameservers
          </h3>
          <div className="mb-4">
            <p className="text-gray-700 mb-3">
              Update your domain's nameservers to point to Vercel:
            </p>
            <div className="space-y-2">
              {vercelNameservers.map((nameserver, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border"
                >
                  <code className="font-mono text-sm text-gray-800">
                    {nameserver}
                  </code>
                  <button
                    onClick={() => copyToClipboard(nameserver)}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  >
                    {copiedNameserver === nameserver ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500 italic">
            Update these nameservers with your domain registrar to connect your
            domain.
          </p>
        </div>
        {/* Add New Domain Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Domain
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Enter new domain name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            />
            <button
              onClick={handleAddDomain}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
            >
              Add Domain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Domain;
