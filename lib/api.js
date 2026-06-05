// lib/api.js
// ─────────────────────────────────────────
// All backend API calls live here.
// Pages import these functions — never call fetch() directly in pages.
// When backend URL changes, only this file needs updating.
// ─────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

// ── 2. Get assessment questions
export async function getQuestions() {
  try {
    const res = await fetch(`${BASE_URL}/assessment/questions`);
    if (!res.ok) throw new Error("Failed to fetch questions");
    return await res.json();
    // Returns: [{ id, question, topic, options }]
  } catch (error) {
    console.error("getQuestions error:", error);
    return null;
  }
}

// ── 3. Submit assessment answers and get gap analysis
export async function submitAssessment(studentId, answers) {
  try {
    const res = await fetch(`${BASE_URL}/assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId,
        answers: answers,
      }),
    });

    if (!res.ok) throw new Error("Assessment submission failed");
    return await res.json();
    // Returns: { score, total, weak_topics, root_cause, roadmap }
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
    // Returns: { mastered, weak, root_gaps }
  } catch (error) {
    console.error("getStudentProgress error:", error);
    return null;
  }
}

// ── 5. Send chat message to AI professor
export async function sendChatMessage(message, twinId, studentId) {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        twin_id: twinId,
        student_id: studentId,
      }),
    });

    if (!res.ok) throw new Error("Chat failed");
    return await res.json();
    // Returns: { reply: "Professor's response..." }
  } catch (error) {
    console.error("sendChatMessage error:", error);
    return null;
  }
}
