// lib/api.js
// ─────────────────────────────────────────
// All backend API calls live here.
// Pages import these functions — never call fetch() directly in pages.
// When backend URL changes, only this file needs updating.
// ─────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── AI backend URL (teammate's ngrok tunnel)
// ⚠️ When teammate restarts ngrok, only update this one line
const AI_BASE_URL =
  "https://4f17-2401-4900-1ce3-2ccb-d5b-5006-e68a-c1a3.ngrok-free.app";

// ── 1. Upload notes and create knowledge twin
export async function uploadNotes(file, professorName) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("professor_name", professorName);

    const res = await fetch(`${BASE_URL}/upload-notes`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
    // Returns: { success: true, twin_id: "abc123" }
  } catch (error) {
    console.error("uploadNotes error:", error);
    return { success: false, error: error.message };
  }
}

// ── 2. Get assessment questions from AI backend
export async function getQuestions() {
  try {
    const res = await fetch(`${AI_BASE_URL}/quiz/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: "Calculus",
        num_questions: 5,
        student_id: "S001",
      }),
    });

    if (!res.ok) throw new Error("Failed to fetch questions");

    const data = await res.json();

    // Normalize AI response into the shape the assessment page expects:
    // [{ id, question, topic, options, correct }]
    return data.questions.map((q, index) => ({
      id: index + 1,
      question: q.question,
      topic: data.topic || "Calculus",
      options: Object.values(q.options), // converts { A: "...", B: "..." } → ["...", "..."]
      correct: q.correct,               // stored for local fallback scoring
    }));
  } catch (error) {
    console.error("getQuestions error:", error);
    return [];
  }
}

// ── 3. Submit quiz answers to AI backend and get real score + gap analysis
// FIX: Added topic and auto_save_scores which the backend requires
export async function submitAssessment(studentId, answers, questions) {
  try {
    const res = await fetch(`${AI_BASE_URL}/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: "Calculus",       // ✅ required by backend
        student_id: studentId,
        questions: questions,
        answers: answers,
        auto_save_scores: true,  // ✅ required by backend
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("submitAssessment raw error:", err);
      throw new Error("Assessment submission failed");
    }

    return await res.json();
    // Returns: { total, correct, score_percent, results }
  } catch (error) {
    console.error("submitAssessment error:", error);
    return null;
  }
}

// ── 4. Get student progress for dashboard
export async function getStudentProgress(studentId) {
  try {
    const res = await fetch(
      `${BASE_URL}/student-progress?student_id=${studentId}`,
    );
    if (!res.ok) throw new Error("Failed to fetch progress");
    return await res.json();
  } catch (error) {
    console.error("getStudentProgress error:", error);
    return null;
  }
}

// ── 5. Send chat message to AI professor
export async function sendChatMessage(message, twinId, studentId) {
  try {
    const res = await fetch(`${AI_BASE_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: message,
        expert_name: "Prof. Kumar",
        student_id: studentId || "S001",
      }),
    });

    if (!res.ok) throw new Error("Chat failed");

    const data = await res.json();

    return {
      reply: data.answer,
    };
  } catch (error) {
    console.error("sendChatMessage error:", error);
    return null;
  }
}