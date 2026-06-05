"use client";
import Navbar from "@/components/Navbar";

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar role="student" userName="Student" pageTitle="Assessment" />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800">Assessment</h1>
        <p className="text-gray-500 mt-2">Questions coming on Day 8.</p>
      </div>
    </main>
  );
}
