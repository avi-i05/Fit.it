import React, { useState } from "react";

const PolicySupport = () => {
  // Messages sent from Admin → Partner
  const [adminMessages] = useState([
    {
      id: 1,
      title: "Policy Update",
      content: "📜 Return period extended from 7 days to 10 days for festive season.",
      date: "2025-09-05",
    },
    {
      id: 2,
      title: "Reminder",
      content: "🚚 Please update shipping details for pending orders.",
      date: "2025-09-07",
    },
  ]);

  // Partner support response
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("⚠️ Please write your issue before submitting.");
      return;
    }
    setSubmitted(true);
    setMessage("");

    // Auto-hide after 3s
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-purple-700 flex items-center">
          📋 Policy & Support
        </h2>

        {/* Policy Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-700">📜 Return Policy</h3>
            <p className="text-gray-700 mt-2">
              Products can be returned within <strong>10 days</strong> of delivery if unused and in original packaging.
            </p>
          </div>
          <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-700">📌 Terms & Conditions</h3>
            <p className="text-gray-700 mt-2">
              All transactions follow our <strong>terms & conditions</strong>. Please review them before placing an order.
            </p>
          </div>
        </div>

        {/* Admin Messages */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">📨 Messages from Admin</h3>
        {adminMessages.length === 0 ? (
          <p className="text-gray-600 italic">No messages yet.</p>
        ) : (
          <div className="space-y-4 mb-8">
            {adminMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h4 className="font-semibold text-purple-700">{msg.title}</h4>
                <p className="text-gray-700 mt-1">{msg.content}</p>
                <p className="text-sm text-gray-500 mt-2">📅 {msg.date}</p>
              </div>
            ))}
          </div>
        )}

        {/* Partner Response */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">💬 Partner Support Response</h3>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              rows="4"
              placeholder="Write your response or issue here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition transform hover:scale-[1.02]"
            >
              Send Response
            </button>
          </form>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded text-green-700 font-medium">
            ✅ Your response has been sent to Admin. Our team will follow up shortly.
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicySupport;
