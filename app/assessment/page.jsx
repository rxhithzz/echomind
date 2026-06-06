"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getQuestions, submitAssessment } from "@/lib/api"; // ✅ FIX: added submitAssessment

export default function AssessmentPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      const data = await getQuestions();
      if (data && data.length > 0) {
        setQuestions(data);
      }
      setLoading(false);
    }
    loadQuestions();
  }, []);

  const question = questions[currentIndex];
  const total = questions.length;
  const isLast = currentIndex === total - 1;
  const progress = total > 0 ? Math.round((currentIndex / total) * 100) : 0;

  function handleSelect(option) {
    setSelected(option);
  }

  // ✅ FIX: handleNext is now async so we can await submitAssessment
  async function handleNext() {
    if (!selected) return;

    const updatedAnswers = { ...answers, [question.id]: selected };
    setAnswers(updatedAnswers);

    if (isLast) {
      setIsSubmitting(true);

      try {
        // ✅ FIX: Call real AI scoring — no more hardcoded score: 2
        const result = await submitAssessment(
          "S001",
          updatedAnswers,
          questions
        );

        if (result) {
          // ✅ Save real result from AI backend
          // result shape: { total, correct, score_percent, results }
          localStorage.setItem("echomind_gap", JSON.stringify(result));
        } else {
          // Fallback: compute score locally if AI server is down
          const correctCount = questions.reduce((acc, q) => {
            return updatedAnswers[q.id] === q.correct ? acc + 1 : acc;
          }, 0);

          localStorage.setItem(
            "echomind_gap",
            JSON.stringify({
              correct: correctCount,
              total: total,
              score_percent: Math.round((correctCount / total) * 100),
              results: [],
            }),
          );
        }

        // Save raw answers separately
        localStorage.setItem(
          "echomind_answers",
          JSON.stringify(updatedAnswers),
        );

        router.push("/dashboard");
      } catch (err) {
        console.error("Submission error:", err);
        setIsSubmitting(false);
      }
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar role="student" userName="Student" pageTitle="Assessment" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-sm animate-pulse">
            Loading questions from AI...
          </p>
        </div>
      </main>
    );
  }

  if (!question) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar role="student" userName="Student" pageTitle="Assessment" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-sm">
            No questions found. Please check your connection and refresh.
          </p>
        </div>
      </main>
    );
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
          <h2 className="text-lg font-semibold text-gray-800 mb-8 leading-relaxed">
            {question.question}
          </h2>

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
          {questions.map((_, i) => (
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