"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { myshopUpdateDeliveryQueryAction } from "@/app/actions/myshop";
import { toast } from "react-toastify";

const Delivery = ({ user, deliveryInfo }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shippingStatus, setShippingStatus] = useState(
    deliveryInfo?.shippingStatus || true
  );

  const [formData, setFormData] = useState({
    deliveryChargeInside: deliveryInfo?.data?.deliveryChargeInside || "",
    deliveryChargeOutside: deliveryInfo?.data?.deliveryChargeOutside || "",
    deliveryChargeSubarea: deliveryInfo?.data?.deliveryChargeSubarea || "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...user,
        ...formData,
        shippingStatus,
      };

      const response = await myshopUpdateDeliveryQueryAction(data);

      if (response?.status) {
        toast.success("Shipping info updated successfully!");
      } else {
        toast.error(response?.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating shipping info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-indigo-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">
            Shipping Cost Info
          </h2>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-indigo-700 border border-indigo-400 rounded-lg hover:bg-indigo-100 transition-all"
          >
            ← Back
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Update your{" "}
          <span className="font-medium text-indigo-600">shipping cost</span> and
          delivery status below.
        </p>

        {/* Status Toggle */}
        <div className="flex items-center justify-between mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <span className="text-sm font-medium text-gray-700">
            Shipping Active Status
          </span>

          <button
            type="button"
            onClick={() => setShippingStatus(!shippingStatus)}
            className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors ${
              shippingStatus ? "bg-indigo-700" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform bg-white rounded-full transition-transform ${
                shippingStatus ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>

          <span
            className={`ml-2 text-sm font-semibold ${
              shippingStatus ? "text-indigo-700" : "text-gray-400"
            }`}
          >
            {shippingStatus ? "ON" : "OFF"}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            {
              name: "deliveryChargeInside",
              label: "Delivery Charge (Inside)",
              placeholder: "Enter delivery charge for inside area",
            },
            {
              name: "deliveryChargeOutside",
              label: "Delivery Charge (Outside)",
              placeholder: "Enter delivery charge for outside area",
            },
            {
              name: "deliveryChargeSubarea",
              label: "Delivery Charge (Subarea)",
              placeholder: "Enter delivery charge for subarea",
            },
          ].map((item) => (
            <div key={item.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {item.label}
              </label>
              <input
                type="number"
                name={item.name}
                value={formData[item.name]}
                onChange={handleChange}
                placeholder={item.placeholder}
                className="w-full border border-indigo-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 font-semibold py-3 rounded-lg shadow transition-all ${
                loading
                  ? "bg-indigo-600 text-indigo-200 cursor-not-allowed"
                  : "bg-indigo-700 hover:bg-indigo-800 text-indigo-100"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-indigo-100"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Delivery;
