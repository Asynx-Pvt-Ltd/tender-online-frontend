"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

const Page = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all messages when component mounts
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/auth/messages`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data.messages.reverse());
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to load messages");
      setIsLoading(false);
    }
  };

  const handleSaveMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENPOINT}/api/auth/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to store message");
      }

      const data = await response.json();
      setMessages(data.improvement); // Update with the new array from backend
      setMessage(""); // Clear textarea
      toast.success("Message stored successfully");
    } catch (error) {
      toast.error("Failed to store message");
    }
  };

  return (
    <div className="p-6 w-full min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-3xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Room for Improvement
        </h2>

        <p className="text-gray-500 text-center">
          We would love to hear your feedback on how we can improve our services
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here..."
          className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={4}
        />

        <button
          onClick={handleSaveMessage}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition-all"
        >
          Send Feedback
        </button>

        {/* Messages Display Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Previous Feedback
          </h3>

          {isLoading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <p className="text-gray-700">{msg}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No feedback yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
