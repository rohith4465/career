"use client";
import { useState } from "react";

export const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm MithraBot. Ask me anything about this website, features, or resume tips!" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    // Simple bot response logic (can be replaced with API call)
    let response = "";
    if (/resume|builder|parser|analysis/i.test(input)) {
      response = "Mithra Resumes lets you build, parse, and analyze resumes for free. Try the Builder, Parser, or Analysis tabs above!";
    } else if (/ats|score/i.test(input)) {
      response = "ATS stands for Applicant Tracking System. Our parser and analysis tools help you optimize your resume for ATS.";
    } else if (/open source|free/i.test(input)) {
      response = "Yes! Mithra Resumes is completely free and open-source. You can contribute or use it without restrictions.";
    } else if (/contact|support/i.test(input)) {
      response = "For support or feedback, check our GitHub or use the contact form on the homepage.";
    } else {
      response = "I'm here to help! Ask me about resume building, parsing, analysis, or website features.";
    }
    setTimeout(() => {
      setMessages(msgs => [...msgs, { sender: "bot", text: response }]);
    }, 500);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-full bg-white border border-purple-200 rounded-xl shadow-lg p-4 flex flex-col gap-2">
      <div className="font-bold text-purple-700 mb-2">MithraBot Chat</div>
      <div className="flex-1 overflow-y-auto max-h-48 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "bot" ? "text-gray-700 mb-1" : "text-blue-700 text-right mb-1"}>
            <span className="inline-block px-2 py-1 rounded-lg" style={{ background: msg.sender === "bot" ? "#f3e8ff" : "#e0f2fe" }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1 text-sm"
          placeholder="Ask about Mithra Resumes..."
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-purple-700"
        >Send</button>
      </div>
    </div>
  );
};
