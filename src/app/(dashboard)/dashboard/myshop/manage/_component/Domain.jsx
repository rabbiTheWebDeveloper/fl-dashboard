"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { myshopUpdateDomainQueryAction } from "@/app/actions/myshop";
const vercelNameservers = ["ns1.vercel-dns.com", "ns2.vercel-dns.com"];
const Domain = ({ user, domainInfo }) => {
  const [newDomain, setNewDomain] = useState(domainInfo?.domain_name || "");
  const [copiedNameserver, setCopiedNameserver] = useState("");
  const [loading, setLoading] = useState(false);
  const handleBack = () => window.history.back();
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedNameserver(text);
      setTimeout(() => setCopiedNameserver(""), 2000);
    });
  };
  // 🔹 Save / Update Domain
  const handleSaveDomain = async () => {
    if (!newDomain.trim()) {
      toast.error("Please enter a domain name!");
      return;
    }

    setLoading(true);

    try {
      const data = {
        ...user,
        domain_name: newDomain.trim(),
      };
      const response = await myshopUpdateDomainQueryAction(data);

      if (response?.status) {
        toast.success("Shipping info updated successfully!");
      } else {
        toast.error(response?.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error saving domain:", error);
      toast.error(error?.message || "❌ Failed to save domain");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
            Manage and connect your custom domain.
          </p>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* Nameserver Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Configure Nameservers
          </h3>
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
          <p className="text-sm text-gray-500 italic mt-3">
            Update these nameservers with your domain registrar to connect your
            domain.
          </p>
        </div>

        {/* Add / Update Domain Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add or Update Domain
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="example.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
            />
            <button
              onClick={handleSaveDomain}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white transition-all ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Saving..." : "Save Domain"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Domain;
