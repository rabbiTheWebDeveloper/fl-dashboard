import React from "react";
import { format } from "date-fns";

const MyOrders = ({ orders = [] }) => {
  const statusStyles = {
    Pending: "bg-amber-100 text-amber-800",
    Completed: "bg-emerald-100 text-emerald-800",
    Failed: "bg-rose-100 text-rose-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-purple-100 text-purple-800",
  };

  const cardTypeColors = {
    VISA: "bg-gradient-to-r from-blue-600 to-blue-400",
    MASTERCARD: "bg-gradient-to-r from-orange-500 to-red-500",
    AMEX: "bg-gradient-to-r from-green-600 to-teal-400",
    DEFAULT: "bg-gradient-to-r from-gray-600 to-gray-400",
  };

  const getCardTypeStyle = (type) => {
    return cardTypeColors[type] || cardTypeColors.DEFAULT;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <div className="text-sm text-gray-500">
          {orders.length} {orders.length === 1 ? "order" : "orders"} found
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mt-1 max-w-md mx-auto">
            You haven't placed any orders yet. When you do, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on{" "}
                      {format(
                        new Date(order.createdAt),
                        "MMMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[order.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    Card Details
                  </h3>

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Card Preview */}
                    <div
                      className={`${getCardTypeStyle(
                        order.card.type
                      )} w-full md:w-72 h-44 rounded-xl p-5 text-white shadow-lg`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs opacity-80">Card Type</p>
                          <p className="font-bold">{order.card.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-80">Level</p>
                          <p className="font-bold">{order.card.level}</p>
                        </div>
                      </div>
                      <div className="mt-8">
                        <p className="text-xs opacity-80">Expires</p>
                        <p className="font-mono">{order.card.expiry}</p>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="font-mono tracking-widest">
                          •••• {order.card.bin}
                        </p>
                        <div className="text-right">
                          <p className="text-xs opacity-80">Price</p>
                          <p className="font-bold">${order.card.price}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500">Bank</p>
                        <p className="font-medium">{order.card.bank}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500">Country</p>
                        <p className="font-medium">{order.card.country}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500">Seller</p>
                        <p className="font-medium">{order.card.seller}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="font-medium">{order.card.category}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium">
                          {order.card.city}, {order.card.state} {order.card.zip}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500">Card Status</p>
                        <p className="font-medium">{order.card.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
