"use client";
import { createDepositeAction } from "@/app/actions/depoite";
import { getUserId } from "@/lib/auth";
import { useState, useEffect } from "react";
import {
  FiPlus,
  FiCopy,
  FiArrowRight,
  FiCheck,
  FiClock,
  FiX,
} from "react-icons/fi";
import QRCode from "react-qr-code";
import { toast } from "react-toastify";
const paymentMethods = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: "/icon/bitcoin.png",
    address: "1Fy2MiHrEB5WimDwpDBekw8XQhGnC8ynGa",
  },
  {
    id: "ethereum",
    name: "Ethereum (ERC20)",
    icon: "/icon/Ethereum (ERC20).jpeg",
    address: "0xdc2a7b4a8cace66cfdd220bd52310d80ddd25539",
  },
  {
    id: "litecoin",
    name: "Litecoin",
    icon: "/icon/Litecoin.png",
    address: "LUZscD9nv8E11kwwGDgoWn2CkZqPgRdocQ",
  },
];
const DepositPage = ({ getdepositeList }) => {
  const [formData, setFormData] = useState({
    method: "",
    amount_crypto: 0,
    telegramId: "",
  });

  // UI state
  const [activeStep, setActiveStep] = useState(1); // 1: select method, 2: payment details, 3: confirmation
  const [copied, setCopied] = useState(false);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    setDeposits(getdepositeList);
    setLoading(false);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodSelect = (methodId) => {
    setFormData((prev) => ({ ...prev, method: methodId }));
    setActiveStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setActiveStep(3);
  };

  const completePayment = async () => {
    const userId = getUserId();
    const newDeposit = {
      ...formData,
      amount_crypto: parseFloat(formData.amount_crypto),
      amount_usd: parseFloat(formData.amount_crypto) * 50000, // Mock conversion
      userId,
    };

    try {
      setLoading(true);
      const response = await createDepositeAction(newDeposit);

      if (response?.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Added successfully!");
      setActiveStep(1);
      setFormData({
        method: "",
        amount_crypto: "",
        telegramId: "",
      });
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find((m) => m.id === formData.method);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Make a Payment
        </h1>
        <p className="text-gray-600 mb-6">
          Select cryptocurrency and complete your payment
        </p>

        {/* Payment Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between mb-8">
            <div
              className={`flex flex-col items-center ${
                activeStep >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep >= 1 ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                {activeStep > 1 ? <FiCheck /> : 1}
              </div>
              <span className="mt-2 text-sm">Select Method</span>
            </div>
            <div
              className={`flex flex-col items-center ${
                activeStep >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep >= 2 ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                {activeStep > 2 ? <FiCheck /> : 2}
              </div>
              <span className="mt-2 text-sm">Payment Details</span>
            </div>
            <div
              className={`flex flex-col items-center ${
                activeStep >= 3 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep >= 3 ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                3
              </div>
              <span className="mt-2 text-sm">Complete</span>
            </div>
          </div>

          {/* Step 1: Select Payment Method */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Select Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className="border rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center"
                  >
                    <img
                      src={method.icon}
                      alt={method.name}
                      className="w-12 h-12 mb-2"
                    />
                    <span className="font-medium">{method.name}</span>
                    <div className="mt-2 flex items-center text-blue-600">
                      <span>Select</span>
                      <FiArrowRight className="ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {activeStep === 2 && selectedMethod && (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setActiveStep(1)}
                  className="mr-4 text-gray-500 hover:text-gray-700"
                >
                  &larr;
                </button>
                <div className="flex items-center">
                  <img
                    src={selectedMethod.icon}
                    alt={selectedMethod.name}
                    className="w-8 h-8 mr-2"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedMethod.name} Payment
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (Crypto)
                    </label>
                    <input
                      type="number"
                      step="0.00000001"
                      name="amount_crypto"
                      value={formData.amount_crypto}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={
                        formData.amount_crypto
                          ? (
                              parseFloat(formData.amount_crypto) * 50000
                            ).toFixed(2)
                          : ""
                      }
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-50"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telegram ID
                  </label>
                  <input
                    type="text"
                    name="telegramId"
                    value={formData.telegramId}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="@username"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  >
                    Continue to Payment <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Payment Confirmation */}
          {activeStep === 3 && selectedMethod && (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setActiveStep(2)}
                  className="mr-4 text-gray-500 hover:text-gray-700"
                >
                  &larr;
                </button>
                <div className="flex items-center">
                  <img
                    src={selectedMethod.icon}
                    alt={selectedMethod.name}
                    className="w-8 h-8 mr-2"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Complete Your Payment
                  </h2>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FiClock className="text-blue-600 text-xl" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Payment pending
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Send exactly {formData.amount}{" "}
                      {selectedMethod.id === "bitcoin"
                        ? "BTC"
                        : selectedMethod.id === "ethereum"
                        ? "ETH"
                        : "LTC"}{" "}
                      to the address below.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-white border rounded-lg p-4 mb-4 flex flex-col items-center">
                    <div className="mb-4 p-2 bg-white rounded">
                      <QRCode
                        value={selectedMethod.address}
                        size={192}
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    </div>
                    <div className="text-center">
                      <button
                        onClick={() => copyToClipboard(selectedMethod.address)}
                        className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
                      >
                        <FiCopy className="mr-1" />
                        {copied ? "Copied!" : "Copy Address"}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Amount to Send
                      </label>
                      <div className="font-medium">
                        {formData.amount}{" "}
                        {selectedMethod.id === "bitcoin"
                          ? "BTC"
                          : selectedMethod.id === "ethereum"
                          ? "ETH"
                          : "LTC"}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Equivalent in USD
                      </label>
                      <div className="font-medium">
                        ${(parseFloat(formData.amount) * 50000).toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Recipient Address
                      </label>
                      <div className="flex items-center">
                        <div className="font-mono bg-gray-100 p-2 rounded flex-1 text-sm truncate">
                          {selectedMethod.address}
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(selectedMethod.address)
                          }
                          className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                          title="Copy to clipboard"
                        >
                          {copied ? (
                            <FiCheck className="text-green-500" />
                          ) : (
                            <FiCopy />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        disabled={loading}
                        onClick={completePayment}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "I've Sent the Payment"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="font-semibold text-gray-800">Payment History</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">Loading payment history...</div>
          ) : deposits.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No payment history found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telegram
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deposits.map((deposit) => {
                    const method = paymentMethods.find(
                      (m) => m.id === deposit.method
                    );
                    return (
                      <tr key={deposit.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {method && (
                              <img
                                src={method.icon}
                                alt={method.name}
                                className="w-6 h-6 mr-2"
                              />
                            )}
                            <span>{method?.name || deposit.method}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">
                            {deposit.amount_usd}{" "}
                            {deposit.method === "bitcoin"
                              ? "BTC"
                              : deposit.method === "ethereum"
                              ? "ETH"
                              : "LTC"}
                          </div>
                          <div className="text-xs text-gray-500">
                            ${deposit.amount_usd}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {deposit.telegramId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              deposit.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {deposit.status === "completed" ? (
                              <FiCheck className="mr-1" />
                            ) : (
                              <FiClock className="mr-1" />
                            )}
                            {deposit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {deposit?.createdAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositPage;
