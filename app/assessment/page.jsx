"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { mockQuestions } from "@/lib/mockData";

export default function AssessmentPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = mockQuestions[currentIndex];
  const total = mockQuestions.length;
  const isLast = currentIndex === total - 1;
  const progress = Math.round((currentIndex / total) * 100);

  // ── Pick an option
  function handleSelect(option) {
    setSelected(option);
  }

  // ── Next question or Submit
  function handleNext() {
    if (!selected) return;

    // Save this answer
    const updatedAnswers = { ...answers, [question.id]: selected };
    setAnswers(updatedAnswers);

    if (isLast) {
      // Last question — save to localStorage and go to dashboard
      setIsSubmitting(true);
      localStorage.setItem("echomind_answers", JSON.stringify(updatedAnswers));
      localStorage.setItem(
        "echomind_gap",
        JSON.stringify({
          score: 2,
          total: total,
          weak_topics: ["Algebra", "Differentiation"],
          root_cause: "Algebra",
          roadmap: [
            {
              id: 1,
              title: "Algebra Chapter 3 — Equations",
              status: "current",
            },
            { id: 2, title: "Functions and graphs", status: "locked" },
            { id: 3, title: "Trigonometric identities", status: "locked" },
            { id: 4, title: "Retry: Differentiation", status: "locked" },
          ],
        }),
      );
      setTimeout(() => router.push("/dashboard"), 1000);
    } else {
      // Move to next question
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar role="student" userName="Student" pageTitle="Assessment" />

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* ── Header: topic + question count */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {question.topic}
          </span>
          <span className="text-sm text-gray-400">
            Question {currentIndex + 1} of {total}
          </span>
        </div>

        {/* ── Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Question card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
          {/* Question text */}
          <h2 className="text-lg font-semibold text-gray-800 mb-8 leading-relaxed">
            {question.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all ${
                  selected === option
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-100 bg-gray-50 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <span className="mr-3 text-gray-400 font-normal">
                  {["A", "B", "C", "D"][i]}.
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* ── Next / Submit button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selected || isSubmitting}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-colors ${
              !selected || isSubmitting
                ? "bg-gray-300 cursor-not-allowed"
                : isLast
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting
              ? "Analysing gaps..."
              : isLast
                ? "Submit Assessment ✓"
                : "Next Question →"}
          </button>
        </div>

        {/* ── Answer progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {mockQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < currentIndex
                  ? "bg-green-400"
                  : i === currentIndex
                    ? "bg-blue-500"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
