"use client";
import Navbar from "@/components/Navbar";

export default function TeacherPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar role="teacher" userName="Prof. Kumar" pageTitle="Upload Notes" />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800">Teacher Portal</h1>
        <p className="text-gray-500 mt-2">Upload content coming on Day 7.</p>
      </div>
    </main>
  );
}
