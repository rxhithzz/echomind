"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function TeacherPage() {
  const router = useRouter();

  const [professorName, setProfessorName] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // ── Handle file picked via browse button
  function handleFileChange(e) {
    const picked = e.target.files[0];
    if (picked && picked.type === "application/pdf") {
      setFile(picked);
      setError("");
    } else {
      setError("Please select a PDF file only.");
    }
  }

  // ── Handle drag over the drop zone
  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  // ── Handle drag leave
  function handleDragLeave() {
    setIsDragging(false);
  }

  // ── Handle file dropped into drop zone
  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
      setError("");
    } else {
      setError("Please drop a PDF file only.");
    }
  }

  // ── Handle upload button click
  function handleUpload() {
    if (!professorName.trim()) {
      setError("Please enter the professor's name.");
      return;
    }
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    setIsUploading(true);
    setError("");

    // Simulate upload delay (replace with real API call on Day 14)
    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        fileName: file.name,
        professorName: professorName.trim(),
        size: (file.size / 1024).toFixed(1) + " KB",
        uploadedAt: new Date().toLocaleTimeString(),
      };
      setUploadedFiles([...uploadedFiles, newEntry]);
      setSuccessMsg(
        `Knowledge Twin created for ${professorName.trim()} successfully!`,
      );
      setFile(null);
      setProfessorName("");
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Clear success message after 4 seconds
      setTimeout(() => setSuccessMsg(""), 4000);
    }, 1500);
  }

  // ── Remove a file from the list
  function handleRemove(id) {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar role="teacher" userName="Prof. Kumar" pageTitle="Upload Notes" />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* ── Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Create Knowledge Twin
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Upload your lecture notes and AI will build a digital version of
            your teaching style.
          </p>
        </div>

        {/* ── Upload card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          {/* Professor name input */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professor Name
            </label>
            <input
              type="text"
              placeholder="e.g. Prof. Kumar"
              value={professorName}
              onChange={(e) => setProfessorName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Drag and drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : file
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              // File selected state
              <div>
                <div className="text-3xl mb-2">📄</div>
                <p className="text-sm font-semibold text-green-700">
                  {file.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {(file.size / 1024).toFixed(1)} KB — Click to change file
                </p>
              </div>
            ) : (
              // Empty state
              <div>
                <div className="text-3xl mb-3">☁️</div>
                <p className="text-sm font-semibold text-gray-600">
                  Drag &amp; drop your PDF here
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-300 mt-3">PDF files only</p>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className="mt-4 px-4 py-3 bg-green-50 border border-green-100 rounded-xl">
              <p className="text-sm text-green-700">✅ {successMsg}</p>
            </div>
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`mt-5 w-full py-3 rounded-xl font-semibold text-white transition-colors ${
              isUploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading
              ? "Creating Knowledge Twin..."
              : "Upload & Create Knowledge Twin"}
          </button>
        </div>

        {/* ── Uploaded files list */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Knowledge Twins Created ({uploadedFiles.length})
            </h2>
            <div className="flex flex-col gap-3">
              {uploadedFiles.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.fileName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.professorName} · {item.size} · {item.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
                      Twin Ready
                    </span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-300 hover:text-red-400 text-lg transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Empty state for file list */}
        {uploadedFiles.length === 0 && (
          <div className="text-center py-8 text-gray-300 text-sm">
            No knowledge twins created yet.
          </div>
        )}
      </div>
    </main>
  );
}
