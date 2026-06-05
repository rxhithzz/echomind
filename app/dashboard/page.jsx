"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { mockGapResult } from "@/lib/mockData";

// ── Knowledge DNA tree structure
const dnaTree = [
  {
    name: "Calculus",
    status: "weak",
    children: [
      { name: "Limits", status: "mastered", children: [] },
      {
        name: "Differentiation",
        status: "weak",
        children: [
          { name: "Algebra", status: "root", children: [] },
          { name: "Functions", status: "root", children: [] },
        ],
      },
      {
        name: "Integration",
        status: "weak",
        children: [{ name: "Trigonometry", status: "root", children: [] }],
      },
    ],
  },
];

// ── Color config per status
const nodeConfig = {
  mastered: {
    bg: "bg-green-100",
    border: "border-green-400",
    text: "text-green-800",
    dot: "bg-green-400",
    label: "Mastered",
  },
  weak: {
    bg: "bg-orange-100",
    border: "border-orange-400",
    text: "text-orange-800",
    dot: "bg-orange-400",
    label: "Weak",
  },
  root: {
    bg: "bg-red-100",
    border: "border-red-500 border-2",
    text: "text-red-800",
    dot: "bg-red-500 animate-pulse",
    label: "Root Gap ⚠️",
  },
  locked: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-500",
    dot: "bg-gray-300",
    label: "Not assessed",
  },
};

// ── Recursive tree node component
function TreeNode({ node, depth = 0 }) {
  const config = nodeConfig[node.status] || nodeConfig.locked;

  return (
    <div className={`${depth > 0 ? "ml-6 mt-2" : ""}`}>
      {/* Connector line for children */}
      <div className="flex items-center gap-2">
        {depth > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-4 h-px bg-gray-300" />
          </div>
        )}
        {/* Node pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}
        >
          <div className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
          <span className={`text-xs font-semibold ${config.text}`}>
            {node.name}
          </span>
          <span className={`text-xs ${config.text} opacity-60`}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Render children recursively */}
      {node.children && node.children.length > 0 && (
        <div className="ml-4 mt-1 border-l-2 border-gray-200 pl-2">
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main dashboard page
export default function DashboardPage() {
  const router = useRouter();
  const [gapData, setGapData] = useState(null);

  // Read gap result from localStorage when page loads
  useEffect(() => {
    const saved = localStorage.getItem("echomind_gap");
    if (saved) {
      setGapData(JSON.parse(saved));
    } else {
      // Fallback to mock data if no assessment was taken
      setGapData(mockGapResult);
    }
  }, []);

  // Show loading state while reading localStorage
  if (!gapData) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar role="student" userName="Student" pageTitle="My Dashboard" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-sm">Loading your results...</p>
        </div>
      </main>
    );
  }

  const scorePercent = Math.round((gapData.score / gapData.total) * 100);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar role="student" userName="Student" pageTitle="My Dashboard" />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* ── Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Your Learning Gap Report
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            AI has analysed your assessment and found the root causes of your
            gaps.
          </p>
        </div>

        {/* ── Score card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Assessment Score</p>
            <p className="text-4xl font-bold text-gray-800">
              {gapData.score}
              <span className="text-xl text-gray-400 font-normal">
                /{gapData.total}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {scorePercent}% correct
            </p>
          </div>
          <div className="text-right">
            <div
              className={`text-4xl font-bold ${
                scorePercent >= 70
                  ? "text-green-500"
                  : scorePercent >= 40
                    ? "text-orange-500"
                    : "text-red-500"
              }`}
            >
              {scorePercent >= 70 ? "😊" : scorePercent >= 40 ? "😐" : "😟"}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {scorePercent >= 70
                ? "Good job!"
                : scorePercent >= 40
                  ? "Needs work"
                  : "Needs attention"}
            </p>
          </div>
        </div>

        {/* ── Knowledge DNA tree */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                🧬 Knowledge DNA
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Visual map of your knowledge — red nodes are root gaps
              </p>
            </div>
          </div>
          <div>
  <h2 className="text-base font-semibold text-gray-800">
    🧬 Knowledge DNA
  </h2>
  <p className="text-xs text-gray-400 mt-0.5">
    Visual map of your knowledge — red nodes are root gaps
  </p>
</div>

<span className="text-xs bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-full">
  {gapData.root_gaps?.length || 3} root gaps found
</span>

          {/* Legend */}
          <div className="flex gap-4 mb-5 flex-wrap">
            {Object.entries(nodeConfig).map(([status, config]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${config.dot.replace("animate-pulse", "")}`}
                />
                <span className="text-xs text-gray-500">{config.label}</span>
              </div>
            ))}
          </div>

          {/* Tree */}
          <div className="bg-gray-50 rounded-xl p-4">
            {dnaTree.map((node, i) => (
              <TreeNode key={i} node={node} depth={0} />
            ))}
          </div>
        </div>

        {/* ── Root cause alert */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">
                Root Cause Found: {gapData.root_cause}
              </h3>
              <p className="text-sm text-red-600 leading-relaxed">
                Your struggles with {gapData.weak_topics?.join(" and ")} trace
                back to weak foundations in{" "}
                <strong>{gapData.root_cause}</strong>. Fix this first and
                everything else becomes easier.
              </p>
            </div>
          </div>
        </div>

        {/* ── Recovery roadmap */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-5">
            🗺️ Your Recovery Roadmap
          </h2>
          <div className="flex flex-col gap-3">
            {gapData.roadmap?.map((step, i) => (
              <div key={step.id} className="flex items-center gap-4">
                {/* Step number circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    step.status === "current"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
                {/* Step content */}
                <div
                  className={`flex-1 px-4 py-3 rounded-xl border ${
                    step.status === "current"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      step.status === "current"
                        ? "text-blue-800"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  {step.status === "current" && (
                    <p className="text-xs text-blue-500 mt-0.5">← Start here</p>
                  )}
                  {step.status === "locked" && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      🔒 Unlocks after previous step
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Start Learning button */}
        <button
          onClick={() => router.push("/chat")}
          className="w-full py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-colors text-base"
        >
          Start Learning with Prof. Kumar →
        </button>
      </div>
    </main>
  );
}
