"use client";
import { myshopUpdateSeoMarketingQueryAction } from "@/app/actions/myshop";
import React, { useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";

const SeoMarketing = ({ user, settings = {} }) => {
  const [formData, setFormData] = useState({
    gtmId: settings?.gtmId || "",
    facebookPixelId: settings?.facebookPixelId || "",
    facebookPixelToken: settings?.facebookPixelToken || "",
    facebookTestEventId: settings?.facebookTestEventId || "",
    tikTokPixelId: settings?.tikTokPixelId || "",
    tikTokPixelToken: settings?.tikTokPixelToken || "",
    tikTokTestEventCode: settings?.tikTokTestEventCode || "",
  });

  const [loading, setLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  // Refs for all input fields
  const inputRefs = useRef({});

  const handleChange = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleCopy = (text) => {
    if (!text) {
      toast.warning("No content to copy!");
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(null), 2000);
    toast.success("Copied to clipboard!");
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const data = {
        shopId: user?.shopId,
        ...formData,
      };
      
      const response = await myshopUpdateSeoMarketingQueryAction(data);

      if (response?.status) {
        toast.success("SEO & Marketing settings updated successfully!");
      } else {
        toast.error(response?.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Error updating settings!");
    } finally {
      setLoading(false);
    }
  };

  // Enhanced InputField Component with Better UX
  const InputField = ({ 
    label, 
    placeholder, 
    value, 
    onChange, 
    type = "text",
    fieldName,
    description,
    isPassword = false
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);

    // Store ref for external access
    React.useEffect(() => {
      if (fieldName) {
        inputRefs.current[fieldName] = inputRef;
      }
    }, [fieldName]);

    const handleClear = () => {
      onChange("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        
        {description && (
          <p className="text-xs text-gray-500 mb-2">{description}</p>
        )}
        
        <div className="relative">
          <input
            ref={inputRef}
            type={isPassword && !showPassword ? "password" : type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => handleFocus(fieldName)}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`
              w-full border rounded-lg px-4 py-3 outline-none transition-all duration-200
              ${focusedField === fieldName
                ? "border-indigo-500 ring-2 ring-indigo-200 bg-white shadow-sm"
                : "border-gray-300 bg-gray-50 hover:bg-white hover:border-gray-400"
              }
              ${value ? "pr-20" : "pr-10"}
            `}
          />
          
          {/* Action Buttons */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Clear field"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </>
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                  )}
                </svg>
              </button>
            )}
            
            {/* Focus indicator */}
            {focusedField === fieldName && (
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        {/* Character counter for long fields */}
        {(fieldName?.includes('Token') || fieldName?.includes('Id')) && value.length > 30 && (
          <div className="text-xs text-gray-500 mt-1 text-right">
            {value.length} characters
          </div>
        )}
      </div>
    );
  };

  // Enhanced Copyable URL Field
  const CopyableUrlField = ({ label, description, url, disabled }) => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="font-semibold mb-2">{label}</h3>
      <p className="text-gray-700 text-sm mb-3">{description}</p>
      <div className="flex items-stretch gap-2">
        <div className="flex-1">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 bg-white font-mono text-sm"
            placeholder={disabled ? "Shop ID required" : ""}
          />
        </div>
        <button
          onClick={() => handleCopy(url)}
          disabled={disabled || !url}
          className={`
            px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 min-w-20
            ${disabled || !url
              ? "bg-gray-400 cursor-not-allowed"
              : copiedLink === url
              ? "bg-green-600 hover:bg-green-700"
              : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md"
            }
          `}
        >
          {copiedLink === url ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );

  const sitemapUrl = user?.shopId 
    ? `https://shop.example.com/api/${user.shopId}/sitemaps.xml`
    : "";

  const facebookFeedUrl = user?.shopId
    ? `https://shop.example.com/api/${user.shopId}/facebook-product-feed.xml`
    : "";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        SEO & Marketing Integrations
      </h2>

      {/* Domain Setup Warning */}
      {!user?.domain_name && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Domain Setup Required</p>
              <p className="text-sm mt-1">To setup <b>GTM</b> or <b>Facebook Pixel</b>, please configure your shop domain first.</p>
            </div>
          </div>
        </div>
      )}

      {/* Sitemaps Section */}
      <CopyableUrlField
        label="Sitemaps for Search Engine"
        description="Add sitemaps to Google Search Console to help your website rank better."
        url={sitemapUrl}
        disabled={!user?.shopId}
      />

      {/* Facebook Data Feed */}
      <CopyableUrlField
        label="Facebook Data Feed"
        description="Add or upload your product feed to the Facebook Catalog."
        url={facebookFeedUrl}
        disabled={!user?.shopId}
      />

      {/* GTM Section */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold mb-4 text-lg text-gray-800">Google Tag Manager</h3>
        <InputField
          label="GTM ID"
          placeholder="e.g. GTM-XXXXXX"
          value={formData.gtmId}
          onChange={(val) => handleChange("gtmId", val)}
          fieldName="gtmId"
          description="Enter your Google Tag Manager Container ID"
        />
      </div>

      {/* Facebook Pixel Section */}
      <div className="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="font-semibold mb-4 text-lg text-gray-800">
          Facebook Conversion API and Pixel
        </h3>
        <InputField
          label="Facebook Pixel ID"
          placeholder="Enter your Facebook Pixel ID"
          value={formData.facebookPixelId}
          onChange={(val) => handleChange("facebookPixelId", val)}
          fieldName="facebookPixelId"
          description="Find this in your Facebook Events Manager"
        />
        <InputField
          label="Pixel Access Token"
          placeholder="Enter your Pixel Access Token"
          value={formData.facebookPixelToken}
          onChange={(val) => handleChange("facebookPixelToken", val)}
          fieldName="facebookPixelToken"
          description="Keep this secure - it provides access to your Facebook data"
          isPassword={true}
        />
        <InputField
          label="Test Event ID"
          placeholder="Enter Test Event ID (optional)"
          value={formData.facebookTestEventId}
          onChange={(val) => handleChange("facebookTestEventId", val)}
          fieldName="facebookTestEventId"
          description="For testing purposes only"
        />
      </div>

      {/* TikTok Pixel Section */}
      <div className="mb-8 p-4 bg-pink-50 rounded-lg border border-pink-200">
        <h3 className="font-semibold mb-4 text-lg text-gray-800">
          TikTok Pixel and Events API
        </h3>
        <InputField
          label="TikTok Pixel ID"
          placeholder="Enter your TikTok Pixel ID"
          value={formData.tikTokPixelId}
          onChange={(val) => handleChange("tikTokPixelId", val)}
          fieldName="tikTokPixelId"
          description="Find this in your TikTok Events Manager"
        />
        <InputField
          label="TikTok Access Token"
          placeholder="Enter your TikTok Access Token"
          value={formData.tikTokPixelToken}
          onChange={(val) => handleChange("tikTokPixelToken", val)}
          fieldName="tikTokPixelToken"
          description="Keep this secure - it provides access to your TikTok data"
          isPassword={true}
        />
        <InputField
          label="TikTok Test Event Code"
          placeholder="Enter Test Event Code (optional)"
          value={formData.tikTokTestEventCode}
          onChange={(val) => handleChange("tikTokTestEventCode", val)}
          fieldName="tikTokTestEventCode"
          description="For testing purposes only"
        />
      </div>

      {/* Update Button */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => {
            setFormData({
              gtmId: settings?.gtmId || "",
              facebookPixelId: settings?.facebookPixelId || "",
              facebookPixelToken: settings?.facebookPixelToken || "",
              facebookTestEventId: settings?.facebookTestEventId || "",
              tikTokPixelId: settings?.tikTokPixelId || "",
              tikTokPixelToken: settings?.tikTokPixelToken || "",
              tikTokTestEventCode: settings?.tikTokTestEventCode || "",
            });
            toast.info("Form reset to original values");
          }}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`
            px-8 py-3 rounded-lg text-white font-medium transition-all duration-200 min-w-32
            ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg transform hover:scale-105"
            }
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Updating...
            </div>
          ) : (
            "Update Settings"
          )}
        </button>
      </div>
    </div>
  );
};

export default SeoMarketing;