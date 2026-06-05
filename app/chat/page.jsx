"use client";
import Navbar from "@/components/Navbar";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar role="student" userName="Student" pageTitle="AI Tutor" />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800">AI Tutor Chat</h1>
        <p className="text-gray-500 mt-2">Chat interface coming on Day 13.</p>
      </div>
    </main>
  );
}
