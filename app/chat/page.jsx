"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { sendChatMessage } from "@/lib/api";

// ── Suggested questions
const suggestions = [
  "What is integration?",
  "Explain differentiation simply",
  "Why do we study limits?",
  "Help me with algebra basics",
  "What is a function?",
];

export default function ChatPage() {
  const router = useRouter();
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "professor",
      text: "Hello! I'm Professor Kumar, your AI tutor. I've reviewed your learning gap report — your root gap is in Algebra, which is affecting your Differentiation and Integration. Let's fix that together. What would you like to start with?",
      time: "",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleSend(text) {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMsg = {
      id: Date.now(),
      sender: "student",
      text: messageText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    (async () => {
      try {
        const response = await sendChatMessage(messageText, null, "S001");

        const professorMsg = {
          id: Date.now() + 1,
          sender: "professor",
          text: response?.reply || "No response received.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        };

        setMessages((prev) => [...prev, professorMsg]);
      } catch (err) {
        console.error(err);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "professor",
            text: "Failed to contact AI server.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          },
        ]);
      }

      setIsTyping(false);
    })();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar role="student" userName="Student" pageTitle="AI Tutor" />

      <div
        className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6"
        style={{ height: "calc(100vh - 65px)" }}
      >
        {/* ── Professor info bar */}
        <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            PK
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Prof. Kumar</p>
            <p className="text-xs text-green-500 font-medium">
              ● Online — Knowledge Twin Active
            </p>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs text-blue-500 hover:underline"
            >
              ← Back to report
            </button>
          </div>
        </div>

        {/* ── Messages area */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.sender === "student" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {msg.sender === "professor" && (
                <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1">
                  PK
                </div>
              )}

              <div
                className={`max-w-xs lg:max-w-md ${
                  msg.sender === "student" ? "items-end" : "items-start"
                } flex flex-col gap-1`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "student"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.time && (
                  <span className="text-xs text-gray-400 px-1">{msg.time}</span>
                )}
              </div>
            </div>
          ))}

          {/* ── Typing indicator */}
          {isTyping && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                PK
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1 items-center h-4">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Suggested questions */}
        {messages.length < 3 && (
          <div className="flex gap-2 flex-wrap mb-3">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── Input area */}
        <div className="bg-white rounded-2xl border border-gray-200 flex items-end gap-3 p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Prof. Kumar anything about Calculus..."
            rows={1}
            className="flex-1 resize-none text-sm text-gray-800 focus:outline-none bg-transparent placeholder-gray-400 max-h-28 overflow-y-auto"
            style={{ minHeight: "24px" }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              input.trim() && !isTyping
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            ↑
          </button>
        </div>
      </div>
    </main>
  );
}