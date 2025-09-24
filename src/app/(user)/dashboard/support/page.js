"use client";
import { useState } from "react";
import {
  FiSend,
  FiCopy,
  FiMessageSquare,
  FiMail,
  FiExternalLink,
} from "react-icons/fi";

const SupportPage = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "support",
      text: "Hello! How can we help you today?",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "user",
      text: "I'm having issues with my deposit",
      time: "10:32 AM",
    },
  ]);
  const [activeTab, setActiveTab] = useState("telegram");
  const telegramSupportId = "@NONVCC2";

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "user",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage("");

    // Here you would typically send the message to your backend
    setTimeout(() => {
      const replyMessage = {
        id: chatMessages.length + 2,
        sender: "support",
        text: "Thanks for your message. Our team will get back to you shortly.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, replyMessage]);
    }, 2000);
  };

  const copyTelegramId = () => {
    navigator.clipboard.writeText(telegramSupportId);
    alert("Telegram ID copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Support Center
        </h1>

        {/* Support Options Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 font-medium ${
              activeTab === "chat"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiMessageSquare className="inline mr-2" />
            Live Chat
          </button>
          <button
            onClick={() => setActiveTab("telegram")}
            className={`px-4 py-2 font-medium ${
              activeTab === "telegram"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg
              className="inline mr-2 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.023c.24-.213-.054-.334-.373-.121l-6.86 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            Telegram Support
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`px-4 py-2 font-medium ${
              activeTab === "email"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiMail className="inline mr-2" />
            Email Support
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-800">Live Support Chat</h2>
              <p className="text-sm text-gray-500">
                Our team typically responds within 15 minutes
              </p>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <FiSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Telegram Tab */}
        {activeTab === "telegram" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-800">
                24/7 Telegram Support
              </h2>
              <p className="text-sm text-gray-500">
                Get instant help from our Telegram support bot
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.023c.24-.213-.054-.334-.373-.121l-6.86 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  Our Telegram Support
                </h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Contact us instantly through our Telegram support bot. We
                  provide 24/7 assistance for all your queries.
                </p>

                {/* QR Code Design */}
                <div className="mb-6 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <img
                    src="/6242468148938918804.jpg"
                    alt="Telegram QR Code"
                    className="w-40 h-40 object-contain"
                  />
                  <p className="mt-2 text-sm text-gray-500">Scan to connect</p>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg w-full max-w-md mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-gray-800">
                      {telegramSupportId}
                    </span>
                    <button
                      onClick={copyTelegramId}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FiCopy className="mr-1" /> Copy
                    </button>
                  </div>
                </div>

                <a
                  href={`https://t.me/${telegramSupportId.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Telegram <FiExternalLink className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Email Tab */}
        {activeTab === "email" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="font-semibold text-gray-800">Email Support</h2>
              <p className="text-sm text-gray-500">
                We'll respond within 24 hours
              </p>
            </div>

            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your issue in detail..."
                    required
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Send Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
