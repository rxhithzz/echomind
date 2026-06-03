export const mockQuestions = [
  {
    id: 1,
    question: "Solve for x: 2x + 4 = 10",
    topic: "Algebra",
    options: ["x = 2", "x = 3", "x = 4", "x = 5"],
    answer: "x = 3",
  },
  {
    id: 2,
    question: "What is f(x) = x² when x = 3?",
    topic: "Functions",
    options: ["6", "9", "12", "3"],
    answer: "9",
  },
  {
    id: 3,
    question: "What is the limit of 1/x as x → ∞?",
    topic: "Limits",
    options: ["1", "0", "∞", "-1"],
    answer: "0",
  },
  {
    id: 4,
    question: "Simplify: 3(x + 2) − x",
    topic: "Algebra",
    options: ["2x + 6", "2x + 2", "4x + 6", "3x + 2"],
    answer: "2x + 6",
  },
];

export const mockGapResult = {
  score: 4,
  total: 10,
  weak_topics: ["Algebra", "Differentiation"],
  root_cause: "Algebra",
  roadmap: [
    { id: 1, title: "Algebra Chapter 3 — Equations", status: "current" },
    { id: 2, title: "Functions and graphs", status: "locked" },
    { id: 3, title: "Trigonometric identities", status: "locked" },
    { id: 4, title: "Retry: Differentiation", status: "locked" },
  ],
};

export const mockProgress = {
  mastered: ["Limits"],
  weak: ["Differentiation", "Integration"],
  root_gaps: ["Algebra", "Functions"],
};
